import { prisma } from "@/app/db";
import { generateToken, hashPassWord } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function POST(req: NextRequest): Promise<Response> {
    try{
        const {name, email, password, teamCode} = await req.json();

        if(!name || !email || !password) { return NextResponse.json({ message: "All fields are required" }, { status: 400 }); }

        // const userAlreadyExists = await prisma.user.findUnique({ where: {email} });
        // if(userAlreadyExists) { return NextResponse.json({ message: "User already exists" }, { status: 409 }); }

        let teamId: string | undefined;
        if(teamCode) {
            const team = await prisma.team.findUnique({ where: {code: teamCode} });
            if(!team) { return NextResponse.json({ message: "Team not found" }, { status: 404 }); }
            teamId = team.id;
        }
         
        //  have all fields and user is new one -> creating new user
        const hashedPassword = await hashPassWord(password);

        // first user become admin - other become user
        const userCount = await prisma.user.count();
        const assignedRole = userCount === 0 ? Role.ADMIN : Role.USER;
        
        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: assignedRole,
                teamId: teamId ?? undefined,
            },
            include: {
                team: true
            }
        });
        //  generate token for user
        const token = await generateToken(user.id);
        
        const response = NextResponse.json({
            user:{
                name: user.name,
                email: user.email,
                id: user.id,
                role: user.role,
                teamId: user.teamId
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