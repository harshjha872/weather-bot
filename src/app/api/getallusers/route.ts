import { NextResponse } from "next/server"
import prisma from '../../db/db.config';

export async function GET(req: Request, res: Response) {

    const allusers = await prisma.user.findMany()
    
    return NextResponse.json({ users: allusers});
}