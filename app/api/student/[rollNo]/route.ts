import { NextResponse } from "next/server";
import dbConnect from "@/lib/server/mongoose";
import StudentModel from "@/model/students.model";
import { requireTeacher } from "@/lib/server/auth";

type UpdateBody = {
  name?: unknown;
  rollNo?: unknown;
  password?: unknown;
  fatherNo?: unknown;
  department?: unknown;
  semester?: unknown;
  fineAmount?: unknown;
  fineStatus?: unknown;
};

function parseUpdateBody(body: UpdateBody) {
  if (
    body.name === undefined ||
    body.rollNo === undefined ||
    body.fatherNo === undefined ||
    body.department === undefined ||
    body.semester === undefined ||
    body.fineAmount === undefined ||
    body.fineStatus === undefined
  ) {
    return { error: "name, rollNo, fatherNo, department, semester, fineAmount, and fineStatus are required" };
  }

  const name = String(body.name).trim();
  const rollNo = String(body.rollNo).trim();
  const fatherNo = String(body.fatherNo).trim();
  const department = String(body.department).trim();
  const semester = Number(body.semester);
  const fineAmount = Number(body.fineAmount);

  if (!name || !rollNo || !fatherNo || !department) {
    return { error: "name, rollNo, fatherNo, and department cannot be empty" };
  }

  if (!Number.isInteger(semester) || semester < 1) {
    return { error: "semester must be a positive whole number" };
  }

  if (!Number.isFinite(fineAmount) || fineAmount < 0) {
    return { error: "fineAmount must be a non-negative number" };
  }

  if (body.fineStatus !== "paid" && body.fineStatus !== "unpaid") {
    return { error: "fineStatus must be paid or unpaid" };
  }

  const password =
    body.password === undefined || body.password === null || String(body.password).trim() === ""
      ? undefined
      : String(body.password);

  const roundedFine = Math.round(fineAmount);
  const fineStatus = body.fineStatus as "paid" | "unpaid";

  return {
    data: {
      name,
      rollNo,
      fatherNo,
      department,
      semester,
      fineAmount: roundedFine,
      fineStatus,
      password,
      isCleared: roundedFine === 0 || fineStatus === "paid",
    },
  };
}

export async function PATCH(
  request: Request,
  context: { params: Promise<{ rollNo: string }> },
) {
  const auth = await requireTeacher();
  if ("response" in auth) {
    return auth.response;
  }

  const { rollNo } = await context.params;
  const currentRollNo = decodeURIComponent(rollNo);

  if (!currentRollNo) {
    return NextResponse.json({ message: "Roll number is required" }, { status: 400 });
  }

  let body: UpdateBody;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ message: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = parseUpdateBody(body);
  if ("error" in parsed) {
    return NextResponse.json({ message: parsed.error }, { status: 400 });
  }

  try {
    await dbConnect();

    if (parsed.data.rollNo !== currentRollNo) {
      const duplicate = await StudentModel.findOne({ rollNo: parsed.data.rollNo }).lean();
      if (duplicate) {
        return NextResponse.json({ message: "Roll number already in use" }, { status: 409 });
      }
    }

    const updateFields: Record<string, unknown> = {
      name: parsed.data.name,
      rollNo: parsed.data.rollNo,
      fatherNo: parsed.data.fatherNo,
      department: parsed.data.department,
      semester: parsed.data.semester,
      fineAmount: parsed.data.fineAmount,
      fineStatus: parsed.data.fineStatus,
      isCleared: parsed.data.isCleared,
    };

    if (parsed.data.password !== undefined) {
      updateFields.password = parsed.data.password;
    }

    const updated = await StudentModel.findOneAndUpdate(
      { rollNo: currentRollNo },
      updateFields,
      { new: true, runValidators: true },
    )
      .select("-password")
      .lean();

    if (!updated) {
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      message: "Student record updated",
      student: updated,
      previousRollNo: currentRollNo,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
