"use client"
import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { AuthContextType } from "../types";
import { Role, User } from "@prisma/client";
import { apiClient } from "../lib/apiClient";

type LoginState = {
    success? : boolean,
    user?: User | null,
    error? : string
}


const AuthContext = createContext<AuthContextType | undefined>(undefined);

//  provider
function AuthProvider({children}: {children: React.ReactNode}) {

    const [user, setUser] = useState<User | void | null | undefined>(null);
    // useActionState
    const [loginState, loginAction, isPending] = useActionState( async(prevState: LoginState, formData: FormData): Promise<LoginState> =>{
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;
        if(!email || !password){
            return { success: false, error: "All fields are required" };
        }
        try {
            const data = await apiClient.login(email, password);
            setUser(data.user);
            return { success: true, user: data.user, error: undefined };
        } catch (error: any) {
            console.log(error);
            return { success: false, user: null, error: error.message };
        }
    }, { success: undefined, user: undefined, error: undefined });

    const logout = async () => {
        try {
            await apiClient.logout();
            setUser(null);
            window.location.href = '/';
        } catch (error: any) {
            console.log(error); 
        }
    };

    const hasPermission = (requiredRole: Role) => {
        if(!user) return false;
        const roleHierarchy = {
            [Role.GUEST]   : 0,
            [Role.USER]    : 1,
            [Role.MANAGER] : 2,
            [Role.ADMIN]   : 3,
        };
        return roleHierarchy[user.role] >= roleHierarchy[requiredRole];
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await apiClient.getCurrentUser();
                setUser(data);
            } catch (error: any) {
                console.log(error);
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    return (
       <AuthContext.Provider value={{
        user, login: loginAction, logout, hasPermission 
       }} >
        {children}
       </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if(!context){
        throw new Error("useAuth must be used within AuthProvider");
    }
    return context;
};

export default AuthProvider;
