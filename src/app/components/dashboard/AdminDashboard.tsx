"use client"

import { apiClient } from "@/app/lib/apiClient";
import { Role } from "@/app/types";
import { Team, User } from "@prisma/client";
import { useTransition } from "react";
import { ShieldAlert, Network, UserCog } from "lucide-react";

interface AdminDashboardProps {
    users:User[], 
    teams:Team[], 
    CurrentUser:User
}

const AdminDashboard = ({users, teams, CurrentUser}:AdminDashboardProps) => {

    const [isPending, startTransition] = useTransition();

    const handleTeamAssignment = async(userId:string, teamId:string | null) => {
        startTransition(async()=>{
            
            try {
                const res = await apiClient.assignUserToTeam(userId, teamId);
                if(!res.ok){
                    throw new Error("Failed to assign team");
                };
                window.location.reload();
            } catch (error) {
                alert(error instanceof Error ? error.message : "Failed to assign team");
            };

        })
    };

    // update role (ADMIN - MANAGER - MEMBER)
    const handleRoleChange = async(userId:string, role:string) => {
        
        // don't let user change their own role
        if(userId === CurrentUser.id){
            alert("You cannot change your own role");
            return;
        };
        
        startTransition(async()=>{
            try {
                const res = await apiClient.updateUserRole(userId, role);
                if(!res.ok){
                    throw new Error("Failed to change role");
                };
                window.location.reload();
            } catch (error) {
                alert(error instanceof Error ? error.message : "Failed to change role");
            };
        })
    };

    return (
        <div className="space-y-8 pb-12">
            <div className="flex items-center gap-3 border-b border-zinc-800 pb-4">
                <ShieldAlert className="w-8 h-8 text-red-500" />
                <h1 className="text-3xl font-bold text-zinc-100 tracking-tight">Admin Dashboard</h1>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: "Total Users", value: users.length, color: "text-blue-400" },
                    { label: "Total Admins", value: users.filter(u => u.role === Role.ADMIN).length, color: "text-red-400" },
                    { label: "Total Managers", value: users.filter(u => u.role === Role.MANAGER).length, color: "text-purple-400" },
                    { label: "Total Regular Users", value: users.filter(u => u.role === Role.USER).length, color: "text-green-400" },
                ].map((stat, i) => (
                    <div key={i} className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 shadow-sm flex flex-col gap-1">
                        <span className="text-sm font-medium text-zinc-400">{stat.label}</span>
                        <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                {/* Users Management */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
                    <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/95 backdrop-blur z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            <UserCog className="w-5 h-5 text-blue-500" />
                            <h2 className="text-lg font-semibold text-zinc-100">User Management</h2>
                        </div>
                    </div>
                    <div className="overflow-y-auto p-4 space-y-3 flex-1">
                        {users.map(user => (
                            <div key={user.id} className="bg-zinc-950 border border-zinc-800 p-4 rounded-lg flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors hover:border-zinc-700">
                                <div className="flex items-center gap-4">
                                    <div className="shrink-0 w-10 h-10 rounded-full bg-zinc-800 border border-zinc-700 flex items-center justify-center text-zinc-300 font-bold text-sm">
                                        {user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-zinc-200 flex items-center gap-2">
                                            {user.name} 
                                            {user.id === CurrentUser.id && <span className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.5 rounded-sm uppercase tracking-wider">You</span>}
                                        </h3>
                                        <p className="text-xs text-zinc-500">{user.email}</p>
                                    </div>
                                </div>
                                
                                <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
                                    <select 
                                        className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500/50 outline-none w-full sm:w-auto min-w-[120px] disabled:opacity-50"
                                        value={user.role}
                                        disabled={isPending || user.id === CurrentUser.id}
                                        onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                    >
                                        <option value={Role.ADMIN}>Admin</option>
                                        <option value={Role.MANAGER}>Manager</option>
                                        <option value={Role.USER}>User</option>
                                    </select>
                                    
                                    <div className="flex items-center gap-2 w-full sm:w-auto">
                                        <select 
                                            className="bg-zinc-900 border border-zinc-700 text-zinc-300 text-sm rounded-md px-3 py-1.5 focus:ring-2 focus:ring-blue-500/50 outline-none flex-1 sm:w-auto min-w-[140px] disabled:opacity-50"
                                            value={user.teamId ?? ""}
                                            disabled={isPending}
                                            onChange={(e) => handleTeamAssignment(user.id, e.target.value === "" ? null : e.target.value)}
                                        >
                                            <option value="">Unassigned</option>
                                            {teams.map(team => (
                                                <option key={team.id} value={team.id}>{team.name} ({team.code})</option>
                                            ))}
                                        </select>
                                        
                                        {user.teamId && (
                                            <button 
                                                className="shrink-0 bg-red-500/10 text-red-400 hover:bg-red-500/20 px-3 py-1.5 rounded-md text-sm transition-colors border border-red-500/20 disabled:opacity-50"
                                                disabled={isPending} 
                                                onClick={() => handleTeamAssignment(user.id, null)}
                                                title="Remove from Team"
                                            >
                                                Remove
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Teams List */}
                <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-sm flex flex-col h-[600px]">
                    <div className="px-6 py-4 border-b border-zinc-800 flex items-center justify-between shrink-0 bg-zinc-900/95 backdrop-blur z-10 sticky top-0">
                        <div className="flex items-center gap-2">
                            <Network className="w-5 h-5 text-purple-500" />
                            <h2 className="text-lg font-semibold text-zinc-100">Teams Directory</h2>
                        </div>
                    </div>
                    <div className="overflow-auto flex-1 p-0">
                        <table className="w-full text-sm text-left text-zinc-400">
                            <thead className="text-xs text-zinc-500 uppercase bg-zinc-950/50 sticky top-0 z-10">
                                <tr>
                                    <th className="px-6 py-4 font-medium">Team Info</th>
                                    <th className="px-6 py-4 font-medium">Members</th>
                                    <th className="px-6 py-4 font-medium">Managers</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-zinc-800">
                                {teams.length === 0 ? (
                                    <tr>
                                        <td colSpan={3} className="px-6 py-8 text-center text-zinc-500">No teams created yet.</td>
                                    </tr>
                                ) : (
                                    teams.map(team => {
                                        const members = users.filter(user => user.teamId === team.id);
                                        const managerList = members.filter(user => user.role === Role.MANAGER);
                                        
                                        return (
                                            <tr key={team.id} className="hover:bg-zinc-800/30 transition-colors">
                                                <td className="px-6 py-4">
                                                    <div className="font-medium text-zinc-200">{team.name}</div>
                                                    <div className="text-xs text-zinc-500 font-mono mt-0.5">{team.code}</div>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <span className="bg-zinc-800 text-zinc-300 px-2.5 py-1 rounded-full text-xs border border-zinc-700">
                                                        {members.length} member{members.length !== 1 && 's'}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    {managerList.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {managerList.map(mgr => (
                                                                <span key={mgr.id} className="text-xs bg-purple-500/10 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded">
                                                                    {mgr.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    ) : (
                                                        <span className="text-xs text-zinc-500 italic">No manager</span>
                                                    )}
                                                </td>
                                            </tr>
                                        )
                                    })
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}   

export default AdminDashboard;