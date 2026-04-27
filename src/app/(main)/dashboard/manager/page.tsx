import ManagerDashboard from "@/app/components/dashboard/ManagerDashboard";
import { prisma } from "@/app/db";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";

const ManagerPage = async() => {
    const user = await getCurrentUser();
    // check permission before rendering
    if(!user || !checkUserPermission(user, Role.MANAGER)) return redirect("/unauthorized");

    // fetch manager own team members and manager team data from DB
    const myTeamMembers = user.teamId ? await prisma.user.findMany({
        where:{
            teamId: user.teamId,
            role  : {not: Role.ADMIN}
        },
        include:{
            team: {
                select: {
                    id:true,
                    name: true,
                    code:true,
                    description:true
                }
            },
        }
    }) : [];

    // fetch all team members from(cross-team) excluding sensitive info
    const allTeamMembers = await prisma.user.findMany({
        where:{
            role  : {not: Role.ADMIN}
        },
        include:{
            team: {
                select: {
                    id:true,
                    name: true,
                    code:true,
                    description:true
                }
            },
        },
        orderBy: {
            teamId: "desc"
        }
    });

    

    // return the data to components - this data is not formatted yet
    return <ManagerDashboard
                myTeamMembers={myTeamMembers} 
                allTeamMembers={allTeamMembers} 
                CurrentUser={user} 
            />


}

export default ManagerPage;