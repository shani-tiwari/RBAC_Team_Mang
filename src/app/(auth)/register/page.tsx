"use client";

import { apiClient } from "@/app/lib/apiClient";
import { RegisterState } from "@/app/types";
import Link from "next/link";
import { useActionState } from "react";


const RegisterPage = () => {
    const [state, registerAction, isPending] = useActionState<RegisterState, FormData>(
        async(_prevState, formData) => {
            const name = formData.get("name") as string;
            const email = formData.get("email") as string;
            const password = formData.get("password") as string;
            const teamCode = formData.get("teamCode") as string;

            if (!name || !email || !password || !teamCode) {
                return { success: false, error: "All fields are required" };
            }
            try {
                await apiClient.register({
                    name, 
                    email, 
                    password, 
                    teamCode: teamCode || undefined,
                });
                window.location.href = "/dashboard";
                return { success: true, error: undefined };
            } catch (error) {
                console.log(error);
                return { success: false, error: "Registration failed" };
            }
        },
        //initial state
        { success: undefined, error: undefined }
    ) 
    return (
        <div className="bg-slate-700 rounded-xl p-6 border max-w-md mx-auto mt-10">
            <h1 className="text-2xl font-bold mb-4">Create Account</h1>

            {/* if want to login */}
            <div className="text-center mb-4">
                <p className="text-sm text-gray-500">Already have an account?</p>
                <Link href="/login" className="text-sm text-blue-500 hover:text-blue-600">Login</Link>
            </div>

            {/* register form  */}
            <form action={registerAction} className="space-y-4">
                
                {/* name */}
                <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-medium">Name</label>
                    <input 
                        type="text" 
                        id="name" 
                        name="name" 
                        required 
                        autoComplete="name"
                        placeholder="your full name - shani tiwari"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

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

                {/* team code */}
                <div className="space-y-2">
                    <label htmlFor="teamCode" className="block text-sm font-medium">Team Code <span className="text-gray-500">(optional)</span></label>
                    <input 
                        type="text" 
                        id="teamCode" 
                        name="teamCode" 
                        placeholder="enter your team code"
                        autoComplete="off"
                        className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <p className="text-xs text-gray-500">you can skip this or enter later if you have one</p>
                </div>

                {/* error message */}
                {state?.error && <p className="text-red-500 text-sm">{state.error}</p>}

                {/* submit button */}
                <button 
                    type="submit" 
                    disabled={isPending} 
                    className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
                >
                    {isPending ? "Registering..." : "Register"}
                </button>

            </form>
        </div>
    );
};

export default RegisterPage;