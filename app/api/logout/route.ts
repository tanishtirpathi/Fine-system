import { NextResponse } from 'next/server';
import dbConnect from '@/lib/server/mongoose';
import { isLoggedIn } from '@/app/middleware/isLoggedIn';
export async function POST() {
  try {
    await dbConnect();
    const user = await isLoggedIn();
    // Clear the JWT cookie by setting it to an empty value and an expired date
    const response = NextResponse.json(
      { message: 'Logout successful' } , user ? { status: 200 } : { status: 401 });
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });
    response.cookies.set('jwt', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0),
      path: '/',
    });

    return response;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ message: 'Logout failed' }, { status: 500 });
  }
}