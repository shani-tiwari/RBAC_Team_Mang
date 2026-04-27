import { User } from "@prisma/client"

const UserDashboard = ({teamMembers, CurrentUser}:{
    teamMembers:User[], 
    CurrentUser:User
}) => {

    return (
        <div>
            User Dashboard
        </div>
    )

}
export default UserDashboard