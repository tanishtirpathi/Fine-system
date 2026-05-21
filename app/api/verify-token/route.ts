import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import jwt from 'jsonwebtoken';

export async function POST(req: Request) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value; 

  if (!token) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ message: 'Server misconfiguration' }, { status: 500 });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (typeof decoded !== 'object' || !decoded || !('role' in decoded)) {
      return NextResponse.json({ message: 'Invalid token payload' }, { status: 401 });
    }

    return NextResponse.json({ role: (decoded as { role: string }).role });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
  }
}