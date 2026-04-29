"use client"
import { useAuth } from '@/app/provider/AuthProvider';
import { User } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';
import { LogOut, UserCircle, Shield } from 'lucide-react';

interface HeaderProps{
    user: User | null;
}

export default function Header({user}: HeaderProps) {

    const pathname = usePathname();
    const {logout} = useAuth();
    const navigation = [
        {name: "Home", href: "/", show: true}, 
        {name: "Dashboard", href: "/dashboard", show: true},
    ].filter((item) => item.show);

    const getNavClass = (href: string) => {
        return pathname === href 
            ? "bg-zinc-800 text-zinc-100 px-3 py-2 rounded-md text-sm font-medium transition-colors" 
            : "text-zinc-400 hover:bg-zinc-800/50 hover:text-zinc-100 px-3 py-2 rounded-md text-sm font-medium transition-colors";
    }

    return (
        <header className="sticky top-0 z-50 w-full border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center">
                        <Link href="/" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-blue-500" />
                            <span className="font-bold text-lg text-zinc-100 tracking-tight">TeamAccess</span>
                        </Link>
                        
                        {/* navigation */}
                        <nav className="ml-8 hidden md:flex space-x-1">
                            {navigation.map((item) => (
                                <Link key={item.name} href={item.href} className={getNavClass(item.href)}>
                                    {item.name}
                                </Link>
                            ))}
                        </nav>
                    </div>

                    {/* user section */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <Link href={`/profile/${user.id}`} className="flex items-center gap-2 text-sm font-medium text-zinc-300 hover:text-zinc-100 transition-colors">
                                    <UserCircle className="h-5 w-5" />
                                    <span className="hidden sm:inline-block">{user.name}</span>
                                </Link>
                                <button 
                                    onClick={logout}
                                    className="flex items-center gap-1.5 text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-400/10 px-3 py-2 rounded-md transition-colors"
                                >
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline-block">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link 
                                href="/login" 
                                className="bg-blue-600 text-white hover:bg-blue-500 px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm shadow-blue-900/20"
                            >
                                Login
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </header>
    )
}
