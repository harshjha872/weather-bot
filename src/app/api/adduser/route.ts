import { NextResponse } from "next/server"
import prisma from '../../db/db.config';

export async function POST(req: Request, res: Response) {
    const user = await req.json()
    const newUser = await prisma.user.create({
        data: user
    })
    return NextResponse.json({ msg: 'user created', user: newUser});
}