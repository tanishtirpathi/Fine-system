import { NextResponse } from "next/server";
import dbConnect from "@/lib/server/mongoose";
import StudentModel from "@/model/students.model";
import { requireTeacher } from "@/lib/server/auth";

export async function POST() {
  const auth = await requireTeacher();
  if ("response" in auth) {
    return auth.response;
  }

  try {
    await dbConnect();

    const result = await StudentModel.updateMany(
      {},
      {
        fineAmount: 0,
        fineStatus: "paid",
        isCleared: true,
      },
    );

    const students = await StudentModel.find().select("-password").lean();

    return NextResponse.json({
      message: "All student fines cleared",
      modifiedCount: result.modifiedCount,
      students,
    });
  } catch (error) {
    console.error("Error clearing all fines:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
