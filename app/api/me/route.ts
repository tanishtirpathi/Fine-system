import { NextResponse } from 'next/server';
import dbConnect from '@/lib/server/mongoose';
import { isLoggedIn } from '@/app/middleware/isLoggedIn';

export async function GET(request: Request) {
    try {
        await dbConnect();
        const user = await isLoggedIn();
        if (!user) {
            return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
        }
        return NextResponse.json({ user }, { status: 200 });
    }
    catch (error) {
        console.error('Error fetching user data:', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}