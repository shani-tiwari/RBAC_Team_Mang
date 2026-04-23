import { NextResponse } from "next/server";
import { getCurrentUser } from "@/app/lib/auth";



export async function GET() {
    try{
        const user = await getCurrentUser();
        if(!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }
        return NextResponse.json({ user }, { status: 200 });
    }catch(error) {
        console.log("Error occur during user fetch" + error);
        return new NextResponse(JSON.stringify({ message: "Error occur during user fetch" }), { status: 500 });
    }
}