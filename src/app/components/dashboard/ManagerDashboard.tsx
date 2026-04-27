import { User } from "@prisma/client";

interface ManagerDashboardProps{
    myTeamMembers:User[], 
    allTeamMembers:User[], 
    CurrentUser:User
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagerDashboard = ({myTeamMembers, allTeamMembers, CurrentUser}:ManagerDashboardProps) => {    
    return (
        // my team members table with code, name, email
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
                        {myTeamMembers.map(member => (
                            <tr key={member.id}>
                                <td>{member.teamId}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <div>
                <h2>All Team Members</h2>
                <table>
                    <thead>
                        <tr>
                            <th>Team Code</th>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {allTeamMembers.map(member => ( 
                            <tr key={member.id}>
                                <td>{member.teamId}</td>
                                <td>{member.name}</td>
                                <td>{member.email}</td>
                                <td>{member.role}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}   

export default ManagerDashboard;