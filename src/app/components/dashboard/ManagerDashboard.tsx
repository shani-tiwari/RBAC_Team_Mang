import { User } from "@prisma/client";
import { Users, UsersRound } from "lucide-react";

interface ManagerDashboardProps{
    myTeamMembers:User[], 
    allTeamMembers:User[], 
    CurrentUser:User
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const ManagerDashboard = ({myTeamMembers, allTeamMembers, CurrentUser}:ManagerDashboardProps) => {    
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-zinc-100 tracking-tight">Manager Dashboard</h1>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                                {myTeamMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No team members found.</td>
                                    </tr>
                                ) : (
                                    myTeamMembers.map(member => (
                                        <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-300">{member.teamId || '-'}</td>
                                            <td className="px-6 py-4 text-zinc-300">{member.name}</td>
                                            <td className="px-6 py-4">{member.email}</td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* All Team Members */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm">
                    <div className="px-6 py-4 border-b border-zinc-800 flex items-center gap-2">
                        <UsersRound className="w-5 h-5 text-purple-500" />
                        <h2 className="text-lg font-semibold text-zinc-100">All Team Members</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-zinc-400">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50">
                                <tr>
                                    <th className="px-6 py-3 font-medium">Team Code</th>
                                    <th className="px-6 py-3 font-medium">Name</th>
                                    <th className="px-6 py-3 font-medium">Role</th>
                                </tr>
                            </thead>
                            <tbody>
                                {allTeamMembers.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No members found.</td>
                                    </tr>
                                ) : (
                                    allTeamMembers.map(member => (
                                        <tr key={member.id} className="border-b border-zinc-800 hover:bg-zinc-800/50 transition-colors">
                                            <td className="px-6 py-4 font-medium text-zinc-300">{member.teamId || '-'}</td>
                                            <td className="px-6 py-4 text-zinc-300">
                                                <div>{member.name}</div>
                                                <div className="text-xs text-zinc-500">{member.email}</div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-md text-xs font-medium border border-zinc-700">
                                                    {member.role.toLowerCase()}
                                                </span>
                                            </td>
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

export default ManagerDashboard;