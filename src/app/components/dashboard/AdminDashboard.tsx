import { Team, User } from "@prisma/client";

const AdminDashboard = ({
    users,
    teams,
    CurrentUser
}:{
    users:User[], 
    teams:Team[], 
    CurrentUser:User
}) => {
    return <div>AdminDashboard</div>
}   

export default AdminDashboard;