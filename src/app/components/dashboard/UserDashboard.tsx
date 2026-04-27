import { User } from "@prisma/client";

interface UserDashboardProps{
    teamMembers:User[], 
    CurrentUser:User
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const UserDashboard = ({teamMembers, CurrentUser}:UserDashboardProps) => {    
    return (
        // two column layout
        // left side : my team members table with code, name, email
        // right side : all team members table with code, name, email, role
        <div className="grid grid-cols-2 gap-4">
            <div>
                <h2>My Team Members</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Team Code</th>
                            <th>Name</th>
                            <th>Email</th>
                        </tr>
                    </thead>
                    <tbody>
                        {teamMembers.map(member => (
                            <tr key={member.id}>
                                <td>{member.teamId}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
        </div>
    )
}   

export default UserDashboard;