import { NextResponse } from "next/server";

export async function POST() {
    try{
        const response = NextResponse.json({ message: "User logged out successfully" }, { status: 200 });
        response.cookies.set("token", "", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
            path: "/",
        });
        return response;
    }catch(error) {
        console.log("Error occur during user logout" + error);
        return NextResponse.json({ message: "Error occur during user logout" }, { status: 500 });
    }
}