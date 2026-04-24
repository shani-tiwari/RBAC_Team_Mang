
import { prisma } from "@/app/db";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest, context: {params: Promise<{userId: string}>}) {
    try {
        const params = await context.params;
        const userId = params.userId;
        
        const currentUser = await getCurrentUser();
        if(!currentUser || !checkUserPermission(currentUser, Role.ADMIN)){
            return NextResponse.json({
                success: false,
                message: "Unauthorized",
                user: null
            }, { status: 401 });
        };

        // prevent user to change their own role
        if(currentUser.id === userId){
            return NextResponse.json({
                success: false,
                message: "Unauthorized, you can't change your own role",
                user: null
            }, { status: 401 });
        }

        // validate role
        const { role } = await req.json();
        const validateRoles = [Role.MANAGER, Role.USER];
        
        if(role && !validateRoles.includes(role)){
            return NextResponse.json({
                success: false,
                message: "Invalid role",
                user: null
            }, { status: 400 });
        }

        // update the user role
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { role },
            include: {
                team: true
            }
        });

        return NextResponse.json({
            success: true,
            message: "Role updated successfully",
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