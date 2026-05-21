import { NextResponse } from 'next/server';
import { isTeacher } from '@/app/middleware/isTeacher';
import Student from '@/model/students.model';
import dbConnect from '@/lib/server/mongoose';
import { isLoggedIn } from '@/app/middleware/isLoggedIn';

export async function POST(req: Request) {
    // Check if the user is a teacher using the middleware

    const user = await isLoggedIn();
    console.log("Logged In User:", user);
    isTeacher(user);

    try {
        await dbConnect(); // Ensure database connection is established
        // Fetch all students from the database
        const students = await Student.find();
        return NextResponse.json(students);
    } catch (error) {
        console.error('Error fetching students:', error);
        return NextResponse.json({ message: 'Internal Server Error' }, { status: 500 });
    }
}