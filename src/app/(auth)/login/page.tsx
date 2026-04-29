"use client";

import { apiClient } from "@/app/lib/apiClient";
import { LoginState } from "@/app/types";
import Link from "next/link";
import { useActionState } from "react";
import { Mail, Lock, LogIn } from "lucide-react";

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
        <div className="bg-zinc-900 rounded-2xl p-8 border border-zinc-800 shadow-2xl max-w-md mx-auto w-full">
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold tracking-tight text-zinc-100 mb-2">Welcome Back</h1>
                <p className="text-sm text-zinc-400">
                    Create an account{" "}
                    <Link href="/register" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
                        Register here
                    </Link>
                </p>
            </div>

            <form action={loginAction} className="space-y-5">
                {/* email */}
                <div className="space-y-1.5">
                    <label htmlFor="email" className="block text-sm font-medium text-zinc-300">Email</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input 
                            type="email" 
                            id="email" 
                            name="email" 
                            required 
                            autoComplete="email"
                            placeholder="name@example.com"
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* password */}
                <div className="space-y-1.5">
                    <label htmlFor="password" className="block text-sm font-medium text-zinc-300">Password</label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-5 w-5 text-zinc-500" />
                        </div>
                        <input 
                            type="password" 
                            id="password" 
                            name="password" 
                            required 
                            autoComplete="current-password"
                            placeholder="••••••••"
                            className="w-full pl-10 pr-4 py-2.5 bg-zinc-950 border border-zinc-800 text-zinc-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all placeholder:text-zinc-600"
                        />
                    </div>
                </div>

                {/* error message */}
                {state?.error && (
                    <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm text-center">
                        {state.error}
                    </div>
                )}

                {/* submit button */}
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-500 transition-all disabled:opacity-50 disabled:cursor-not-allowed font-medium shadow-lg shadow-blue-900/20 mt-6"
                >
                    {isPending ? "Logging in..." : (
                        <>
                            Login <LogIn className="w-4 h-4" />
                        </>
                    )}
                </button>
            </form>
        </div>
    );
};

export default LoginPage;