import { getCurrentUser } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { redirect } from "next/navigation";


const dashboardLayout = async() => {
    const user = await getCurrentUser();

    // if user is not logged in then redirect to login page
    if (!user) return redirect("/login");

    // redirect - based on role
    switch(user.role){
        case Role.ADMIN:
            return redirect("/dashboard/admin");
        case Role.MANAGER:
            return redirect("/dashboard/manager");
        case Role.USER:
            return redirect("/dashboard/user");
        default:
            break;
    };
};

export default dashboardLayout;