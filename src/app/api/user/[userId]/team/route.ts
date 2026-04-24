import { prisma } from "@/app/db";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: {params: Promise<{userId: string}>}) {
    try {
        const params = await context.params;
        const userId = params.userId;
        
        const user = await getCurrentUser();
        if(!user || !checkUserPermission(user, Role.ADMIN)){
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
                user: null
            }, { status: 401 });
        };

        const { teamId } = await req.json();
        if(teamId){
            const team = await prisma.team.findUnique({where: {id: teamId}});
            
            if(!team){
                return NextResponse.json({
                    success: false,
                    message: "Team doesn't exist",
                    user: null
                }, { status: 404 });
            };
        }

        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { teamId },
            include: {
                team: true
            }
        });

        return NextResponse.json({
            success: true,
            message: teamId ? "User added to team successfully" : "User removed from team successfully",
            user: updatedUser
        }, { status: 200 });

    } catch (error) {
        console.log("Something went wrong: ", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong",
            user: null
        }, { status: 500 });
    }
}