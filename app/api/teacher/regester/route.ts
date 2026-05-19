import { NextResponse } from 'next/server';
import Teacher from '@/model/teachers.model';
import dbConnect from '@/lib/mongoose';

export async function POST(req: Request) {
    try {   
        await dbConnect();

        const body = await req.json();

        // Validate required fields
        const { name, email, password, phoneNo, department } = body;
        if (!name || !email || !password || !phoneNo || !department) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if teacher already exists
        const existingTeacher = await Teacher.findOne({ email });
        if (existingTeacher) {
            return NextResponse.json({ error: 'Teacher already exists' }, { status: 409 });
        }

        // Create new teacher
        const newTeacher = new Teacher({ name, email, password, phoneNo, department });
        await newTeacher.save();

        return NextResponse.json({ message: 'Teacher registered successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error in teacher sign-up:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}