import { NextResponse } from "next/server";
import dbConnect from "@/lib/server/mongoose";
import StudentModel from "@/model/students.model";
import { requireTeacher } from "@/lib/server/auth";

type UpdateBody = {
  fineAmount?: unknown;
  fineStatus?: unknown;
  isCleared?: unknown;
};

function parseUpdateBody(body: UpdateBody) {
  if (body.fineAmount === undefined || body.fineStatus === undefined || body.isCleared === undefined) {
    return { error: "fineAmount, fineStatus, and isCleared are required" };
  }

  const fineAmount = Number(body.fineAmount);
  if (!Number.isFinite(fineAmount) || fineAmount < 0) {
    return { error: "fineAmount must be a non-negative number" };
  }

  if (body.fineStatus !== "paid" && body.fineStatus !== "unpaid") {
    return { error: "fineStatus must be paid or unpaid" };
  }

  if (typeof body.isCleared !== "boolean") {
    return { error: "isCleared must be a boolean" };
  }

  return {
    data: {
      fineAmount: Math.round(fineAmount),
      fineStatus: body.fineStatus as "paid" | "unpaid",
      isCleared: body.isCleared,
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
  const decodedRollNo = decodeURIComponent(rollNo);

  if (!decodedRollNo) {
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

    const updated = await StudentModel.findOneAndUpdate(
      { rollNo: decodedRollNo },
      {
        fineAmount: parsed.data.fineAmount,
        fineStatus: parsed.data.fineStatus,
        isCleared: parsed.data.isCleared,
      },
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
    });
  } catch (error) {
    console.error("Error updating student:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
