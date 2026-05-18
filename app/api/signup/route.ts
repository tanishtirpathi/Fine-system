import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongoose';
import StudentModel from '@/model/students.model';

export async function POST(request: Request) {
    try {
        await dbConnect();

        const { name, rollNo, password  , fatherNo , department } = await request.json();

        if (!name || !rollNo || !password) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        const existingStudent = await StudentModel.findOne({ rollNo });
        if (existingStudent) {
            return NextResponse.json(
                { message: 'Student already exists' },
                { status: 409 }
            );
        }

        const newStudent = new StudentModel({
            name,
            rollNo,
            password,
            fatherNo, // Add default or required fields as needed
            department,
            semester: 1,
            fineAmount: 0,
            fineStatus: 'unpaid',
            isCleared: false
        });

        await newStudent.save();
        return NextResponse.json(
            { message: 'Student created successfully' },
            { status: 201 }
        );
    } catch (error: unknown) {
        console.error('Signup error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}