import { NextResponse } from "next/server";
import bot from "../../../telegram/bot";

export async function GET(req: Request, res: Response) {
    return NextResponse.json({msg: 'hi'})
}