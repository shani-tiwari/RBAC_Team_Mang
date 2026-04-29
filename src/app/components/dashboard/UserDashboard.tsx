import { User } from "@prisma/client";
import { Users } from "lucide-react";

interface UserDashboardProps{
    teamMembers:User[], 
    CurrentUser:User
}

const UserDashboard = ({teamMembers, CurrentUser}:UserDashboardProps) => {    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">User Dashboard</h1>
            
            <div className="grid grid-cols-1 gap-6 max-w-4xl">
                {/* My Team Members */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-500" />
                        <h2 className="text-lg font-semibold text-zinc-100">My Team Members</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-zinc-400">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Team Code</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Email</th>
                                </tr>
                            </thead>
                            <tbody>
                                {teamMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No team members found.</td>
                                    </tr>
                                ) : (
                                    teamMembers.map(member => (
                                        <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-300">{member.teamId || '-'}</td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                {member.name} {member.id === CurrentUser.id && <span className="ml-2 text-xs bg-blue-500/20 text-blue-400 px-2 py-0.5 rounded-full border border-blue-500/30">You</span>}
                                            </td>
                                            <td className="px-6 py-4">{member.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}   

export default UserDashboard;