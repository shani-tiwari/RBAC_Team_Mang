import { prisma } from "@/app/db";
import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";
import AdminDashboard from "@/app/components/dashboard/AdminDashboard";

const AdminPage = async() => {
    const user = await getCurrentUser();
    // check permission before rendering
    if(!user || !checkUserPermission(user, Role.ADMIN)) return redirect("/unauthorized");

    // fetch data for admin dashboard from DB
    const [prismaUsers, prismaTeams] = await Promise.all([
        prisma.user.findMany({
            include: {
                team: true
            },
            orderBy: {
                createdAt: "desc"
            }
        }),
        prisma.team.findMany({
            include: {
                members:{
                    select:{
                        id: true,
                        name: true,
                        email: true,
                        role: true
                    }
                }
            }
        })
    ]);

    // return the data to components - this data is not formatted yet
    return <AdminDashboard 
                users={prismaUsers} 
                teams={prismaTeams} 
                CurrentUser={user} 
            />


}

export default AdminPage;