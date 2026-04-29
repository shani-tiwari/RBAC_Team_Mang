import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";

export default function Home() {
    return (
        <main className="flex flex-col min-h-[calc(100vh-4rem)] items-center justify-center p-4 sm:p-8 bg-zinc-950 text-center">
            <div className="max-w-3xl space-y-8">
                <div className="inline-flex items-center justify-center p-3 bg-zinc-900 border border-zinc-800 rounded-full mb-4 shadow-lg">
                    <ShieldCheck className="w-10 h-10 text-blue-500" />
                </div>
                
                <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-zinc-100">
                    Secure Team <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-blue-600">Access Control</span>
                </h1>
                
                <p className="text-lg sm:text-xl text-zinc-400 max-w-2xl mx-auto leading-relaxed">
                    Manage roles, assign teams, and control access permissions with a beautiful, minimal, and secure dashboard.
                </p>
                
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                    <Link 
                        href="/login" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-500 transition-colors shadow-lg shadow-blue-900/20"
                    >
                        Get Started <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link 
                        href="/dashboard" 
                        className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-3.5 rounded-lg bg-zinc-900 text-zinc-300 font-medium border border-zinc-800 hover:bg-zinc-800 transition-colors"
                    >
                        View Dashboard
                    </Link>
                </div>
            </div>
            
            {/* Minimal Decorative Element */}
            <div className="absolute inset-0 -z-10 h-full w-full bg-zinc-950 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(37,99,235,0.15),rgba(255,255,255,0))]"></div>
        </main>
    )
}
