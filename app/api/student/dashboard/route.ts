import { NextResponse } from "next/server";
import dbConnect from "@/lib/server/mongoose";
import StudentModel from "@/model/students.model";
import { requireStudent } from "@/lib/server/auth";

export async function GET() {
  const auth = await requireStudent();
  if ("response" in auth) {
    return auth.response;
  }

  const meRollNo = auth.user.identifier;
  if (!meRollNo) {
    return NextResponse.json({ message: "Invalid student session" }, { status: 400 });
  }

  try {
    await dbConnect();

    const students = await StudentModel.find().select("-password")
      .sort({ fineAmount: -1 })
      .lean();

    const me = students.find((s) => s.rollNo === meRollNo) ?? null;

    return NextResponse.json({
      meRollNo,
      me,
      students,
    });
  } catch (error) {
    console.error("Error fetching student dashboard:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}

