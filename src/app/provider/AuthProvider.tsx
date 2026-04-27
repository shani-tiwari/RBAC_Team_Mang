"use client"
import { createContext, useActionState, useContext, useEffect, useState } from "react";
import { AuthContextType, LoginState } from "../types";
import { Role, User } from "@prisma/client";
import { apiClient } from "../lib/apiClient";


const AuthContext = createContext<AuthContextType | undefined>(undefined);


//  provider
function AuthProvider({children}: {children: React.ReactNode}) {

    const [user, setUser] = useState<User | null>(null); 

    // useActionState
    // const [loginState, loginAction, isPending] = useActionState( async(prevState: LoginState, formData: FormData): Promise<LoginState> =>{
    //     const email = formData.get("email") as string;
    //     const password = formData.get("password") as string;
    //     if(!email || !password){
    //         return { success: false, error: "All fields are required" };
    //     }
    //     try {
    //         const data = await apiClient.login(email, password) as unknown as {user: User};
    //         setUser(data.user);
    //         return { success: true, user: data.user, error: undefined };
    //     } catch (error) {
    //         console.log(error);
    //         return { success: false, user: null};
    //     }
    // }, { success: undefined, user: undefined, error: undefined });
    
    const [loginState, loginAction, isPending] = useActionState<LoginState, FormData>(
        async (_prevState, formData) => {
            const email = formData.get("email");
            const password = formData.get("password");

            if (typeof email !== "string" || typeof password !== "string" || !email || !password) {
                return { success: false, user: null, error: "All fields are required" };
            }

            try {
                const data = await apiClient.login(email, password) as unknown as {user: User};
                return { success: true, user: data.user, error: undefined };
            } catch (error) {
                console.log(error);
                return { success: false, user: null, error: "Login failed" };
            }
        },
        { success: undefined, user: null, error: undefined }
    );


    const logout = async () => {
        try {
            await apiClient.logout();
            setUser(null);
            window.location.href = '/';
        } catch (error) {
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
                const data = await apiClient.getCurrentUser() as unknown as {user: User | null };
                setUser(data.user);
            } catch (error) {
                console.log(error);
                setUser(null);
            }
        };
        checkAuth();
    }, []);

    // useEffect(() => {
    //     if (loginState?.success && loginState.user) {
    //         setUser(loginState.user);
    //     }
    // }, [loginState]);

    return (
       <AuthContext.Provider value={{ 
         user,
         login: loginAction,
         logout, 
         hasPermission,
         isPending,
         loginState
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
