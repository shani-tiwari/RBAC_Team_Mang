import { prisma } from "@/app/db";
import { comparePassword, generateToken } from "@/app/lib/auth";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest): Promise<Response> {
    try{
        const {email, password} = await req.json();

        if(!email || !password) { return NextResponse.json({ message: "All fields are required" }, { status: 400 }); }

        const userFromDB = await prisma.user.findUnique({ where: {email}, include: { team: true } });
        if(!userFromDB) { return NextResponse.json({ message: "User not found" }, { status: 404 }); }

        const validPassword = await comparePassword(password, userFromDB.password);
        if(!validPassword) { return NextResponse.json({ message: "Invalid password" }, { status: 401 }); }
        
         
        //  generate token for user
        const token = await generateToken(userFromDB.id);
        
        const response = NextResponse.json({
            user:{
                name: userFromDB.name,
                email: userFromDB.email,
                id: userFromDB.id,
                role: userFromDB.role,
                teamId: userFromDB.teamId
            },
            token: token
        }, {status: 201});

        //  set cookie
        response.cookies.set("token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 60 * 60 * 24 * 7,
        });
 
        return response;

    }catch(error) {
        console.log("Error occur during user registration" + error);
        return new NextResponse(JSON.stringify({ message: "Error occur during user registration" }), { status: 500 });
    }
}