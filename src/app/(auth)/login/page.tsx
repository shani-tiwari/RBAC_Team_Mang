"use client";

import { apiClient } from "@/app/lib/apiClient";
import { LoginState } from "@/app/types";
import Link from "next/link";
import { useActionState } from "react";


const LoginPage = () => {
    const [state, loginAction, isPending] = useActionState<LoginState, FormData>(
        async(_prevState, formData) => {
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;

            if (!email || !password) {
                return { success: false, error: "All fields are required" };
            }
            try {
                await apiClient.login(email, password);
                window.location.href = "/dashboard";
                return { success: true, error: undefined };
            } catch (error) {
                console.log(error);
                return { success: false, error: "Login failed" };
            }
        },
        //initial state
        { success: undefined, error: undefined }
    ) 
    return (
        <div className="bg-slate-700 rounded-xl p-6 border max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Login</h1>

            {/* if want to register */}
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Create an account?</p>
                <Link href="/register" className="text-sm text-blue-500 hover:text-blue-600">Register</Link>
            </div>

            {/* register form  */}
            <form action={loginAction} className="space-y-4">
                
                {/* email */}
                <div className="space-y-2">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        required 
                        autoComplete="email"
                        placeholder="your email - shanitiwari2021@gmail.com"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* password */}
                <div className="space-y-2">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required 
                        autoComplete="new-password"
                        placeholder="create a password"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* error message */}
                {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

                {/* submit button */}
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {isPending ? "Logging in..." : "Login"}
                </button>

            </form>
        </div>
    );
};

export default LoginPage;