import { NextResponse } from "next/server";
import Student from "@/model/students.model";
import dbConnect from "@/lib/server/mongoose";
import { requireTeacher } from "@/lib/server/auth";

export async function POST() {
  const auth = await requireTeacher();
  if ("response" in auth) {
    return auth.response;
  }

  try {
    await dbConnect();
    const students = await Student.find().select("-password");
    return NextResponse.json(students);
  } catch (error) {
    console.error("Error fetching students:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
