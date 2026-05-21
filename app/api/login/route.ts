import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/server/mongoose';
import StudentModel from '@/model/students.model';
import TeacherModel from '@/model/teachers.model';
import { Student } from '@/types/student.types';
import { Teacher } from '@/types/teacher.types';

export async function POST(request: Request) {
    try {
        await dbConnect();
        const { identifier, password, role } = await request.json();

        if (!identifier || !password || !role) {
            return NextResponse.json(
                { message: 'Missing required fields' },
                { status: 400 }
            );
        }

        let user: Student | Teacher | null = null;

        if (role === 'student') {
            user = await (StudentModel.findOne({ rollNo: identifier }).lean() as unknown as Promise<Student | null>);
        } else if (role === 'teacher') {
            user = await (TeacherModel.findOne({ email: identifier }).lean() as unknown as Promise<Teacher | null>);
        } else {
            return NextResponse.json(
                { message: 'Invalid role' },
                { status: 400 }
            );
        }

        if (!user) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        if (password !== user.password) {
            return NextResponse.json(
                { message: 'Invalid credentials' },
                { status: 401 }
            );
        }

        const userId = (user as unknown as { _id: string })._id.toString();
        const userIdentifier = role === 'student' ? (user as Student).rollNo : (user as Teacher).email;

        const token = jwt.sign(
            { 
                userId, 
                role,
                name: user.name,
                identifier: userIdentifier
            },
            process.env.JWT_SECRET || 'fallback_secret_key',
            { expiresIn: '1d' }
        );

        const response = NextResponse.json(
            { 
                message: 'Login successful',
                user: {
                    id: userId,
                    name: user.name,
                    role,
                    identifier: userIdentifier
                }
            },
            { status: 200 }
        );

        // Set HttpOnly cookie for the token
        response.cookies.set('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 86400 // 1 day
        });

        return response;

    } catch (error: unknown) {
        console.error('Login error:', error);
        return NextResponse.json(
            { message: 'Internal server error' },
            { status: 500 }
        );
    }
}
