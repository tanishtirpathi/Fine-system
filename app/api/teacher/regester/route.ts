import { NextResponse } from 'next/server';
import Teacher from '@/model/teachers.model';
import dbConnect from '@/lib/server/mongoose';
import jwt from "jsonwebtoken";

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
        if (!newTeacher) {
            return NextResponse.json({ error: 'Failed to create teacher' }, { status: 500 });
        }
        const token= jwt.sign(
            {
                userId: newTeacher._id.toString(),
                role: 'teacher',
                name: newTeacher.name,
                identifier: newTeacher.email
            },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' } 
        );

        await newTeacher.save();
        const response = NextResponse.json({ message: 'Teacher registered successfully' }, { status: 201 });
        response.headers.set('Authorization', `Bearer ${token}`);
        
           response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 1 day
        });

        return response;
        
    } catch (error) {
        console.error('Error in teacher sign-up:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}