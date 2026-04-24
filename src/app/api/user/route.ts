import { prisma } from "@/app/db";
import { getCurrentUser } from "@/app/lib/auth";
import { Prisma, Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";


export async function GET(req: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
                user: null
            }, { status: 401 })
        };

        const searchParams = req.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role");

        if (!teamId || !role) {
            return NextResponse.json({
                success: false,
                message: "Team ID or Role not found",
                user: null
            }, { status: 400 })
        };

        // where clause based on user role 
        let where: Prisma.UserWhereInput = {};
        if (user.role === Role.ADMIN) {
            // admin can see all users in the team
            where = {teamId: user.teamId}
        } else if (user.role === Role.MANAGER) {
            // MANAGER can see users in their team or cross team users but not cross team managers
            where = {OR: [{teamId: user.teamId}, {role: Role.USER}]}
        } else{
            // "regular user"
            where.teamId = user.teamId
            where.role   = { not: Role.ADMIN }
        };

        // additional filter
        if(teamId){
            where.teamId = teamId
        }
        if(role){
            where.role = role as Role ; //! check later 
        }

        const users = await prisma.user.findMany({
            // user data we require 
            where, 
            select: {
                id: true,
                email: true,
                role: true,
                name: true,
                team: {
                    select: {
                        id: true,
                        name: true
                    }
                },
                createdAt: true,
            },
            orderBy: {createdAt: "desc"}
        })

        return NextResponse.json({
            success: true,
            message: "User fetched successfully",
            users: users
        }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong: ", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            user: null
        }, { status: 500 })
    }
}