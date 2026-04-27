import { User } from "@prisma/client";

const ManagerDashboard = ({
    myTeamMembers,
    allTeamMembers,
    CurrentUser
}:{
    myTeamMembers:User[], 
    allTeamMembers:User[], 
    CurrentUser:User
}) => {
    return <div>ManagerDashboard</div>
}   

export default ManagerDashboard;