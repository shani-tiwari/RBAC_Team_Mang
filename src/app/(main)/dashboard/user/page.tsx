import UserDashboard from "@/app/components/dashboard/UserDashboard";
import { prisma } from "@/app/db";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { User } from "@prisma/client";
import { redirect } from "next/navigation";

const UserPage = async() => {
    const user = await getCurrentUser();
    // check permission before rendering
    if(!user || !checkUserPermission(user, Role.USER)) return redirect("/login");

    // fetch user specific data
    const teamMembers = user.teamId ? await prisma.user.findMany({
        where:{
            teamId: user.teamId
        },
        select:{
            id:true,
            name: true,
            email: true,
            role: true
        }
    }) : [];
    

    // return the data to components - this data is not formatted yet
    return <UserDashboard 
                teamMembers={teamMembers as unknown as User[]} 
                CurrentUser={user} 
            />


}

export default UserPage;