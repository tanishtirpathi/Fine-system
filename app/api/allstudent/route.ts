import { NextResponse } from 'next/server';
import isTeacher from '@/app/middleware/isTeacher';
import Student from '@/model/students.model';

export async function GET(req: Request) {
  // Check if the user is a teacher using the middleware
  const isAuthorized = await isTeacher(req);
  if (!isAuthorized) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 403 });
  }

  try {
    // Fetch all students from the database
    const students = await Student.find();
    return NextResponse.json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
  }
}