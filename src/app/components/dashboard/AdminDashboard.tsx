"use client"

import { apiClient } from "@/app/lib/apiClient";
import { Role } from "@/app/types";
import { Team, User } from "@prisma/client";
import { useTransition } from "react";


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

    return <>
        <div className="container mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* users table with role & team */}
                <div className="bg-slate-800 text-white ">
                    {
                        users.map(user => (
                            <div key={user.id} className="bg-white p-4 rounded-lg shadow">
                                <div className="flex items-center gap-4">
                                    <span className="rounded-full bg-slate-700 p-1.5 text-white">{user.name.charAt(0).toUpperCase()}</span>
                                    <h3 className="text-lg font-bold">{user.name}</h3>
                                </div>
                                <p>{user.email}</p>
                                {/* role assignment */}
                                <select 
                                    className="rounded-lg border p-2 text-slate-800"
                                    value={user.role}
                                    disabled={isPending || user.id === CurrentUser.id}
                                    onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                >
                                    <option value={Role.ADMIN}>Admin</option>
                                    <option value={Role.MANAGER}>Manager</option>
                                    <option value={Role.USER}>User</option>
                                </select>
                                {/* team assignment */}
                                <select 
                                    className="rounded-lg border p-2 text-slate-800"
                                    value={user.teamId ?? ""}
                                    disabled={isPending}
                                    onChange={(e) => handleTeamAssignment(user.id, e.target.value === "" ? null : e.target.value)}
                                >
                                    <option value="">No Team</option>
                                    {
                                        teams.map(team => (
                                            <option key={team.id} value={team.id}>{team.name}</option>
                                        ))
                                    }
                                </select>
                                {/* show team code if it's in any team */}
                                {user.teamId && (
                                    <div className="rounded-lg border p-2 text-slate-800">{user.teamId}</div>
                                )}
                                {/* button for removing specific user from the team */}
                                {user.teamId && (
                                    <button 
                                        className="rounded-lg border p-2 text-slate-800" 
                                        disabled={isPending} 
                                        onClick={() => handleTeamAssignment(user.id, null)}
                                    >
                                        Remove from Team
                                    </button>
                                )}
                            </div>
                        ))
                    }
                </div>
                {/* teams table */}
                <div>   
                    <h2>Teams</h2>

                    {
                        teams.map(team => {
                            const members = users.filter(user => user.teamId === team.id);
                            const manager = members.filter(user => user.role === Role.MANAGER);
                            return <>
                                {/* four colums header */}
                                <div className="grid grid-cols-4 gap-4">
                                    <div>Team Name</div>
                                    <div>Team Code</div>
                                    <div>No. of Members</div>
                                    <div>Manager Name</div>
                                </div>
                                {/* four colums data - team name, team code, no. of members, all the managers name and new row for each team  */}
                                <div key={team.id} className="grid grid-cols-4 gap-4">
                                    <div>{team.name}</div>
                                    <div>{team.code}</div>
                                    <div>{members.length + 1}</div>
                                    <div>{manager.length + 1 > 1 ? manager.map((manager) => (
                                        <span key={manager.id}>{manager.name}</span>
                                    )) : "No Manager"}</div> 
                                </div>
                            </>
                        })
                    }
                </div>
            </div>

            {/* stats - no. of all users, admin, managers, members and all teams */}
            {/* with styles from tailwind */}
            <div className="bg-slate-800 text-white mt-4">
                <h2>Statistics</h2>
                <div className="grid grid-cols-4 gap-4">
                    <div>Total Users</div>
                    <div>{users.length}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div>Total Admins</div>
                    <div>{users.filter(user => user.role === Role.ADMIN).length}</div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                    <div>Total Managers</div>
                    <div>{users.filter(user => user.role === Role.MANAGER).length}</div>
                </div>
                <div>
                    <div>Total Users</div>
                    <div>{users.filter(user => user.role === Role.USER).length}</div>
                </div>
            </div>
            
        </div>
    </>
}   

export default AdminDashboard;