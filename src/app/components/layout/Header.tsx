"use client"
import { useAuth } from '@/app/provider/AuthProvider';
import { User } from '@prisma/client'
import Link from 'next/link'
import { usePathname } from 'next/navigation';

interface HeaderProps{
    user: User | null;
}

export default function Header({user}: HeaderProps) {

    const pathname = usePathname();
    const {logout} = useAuth();
    const navigation = [
        {name: "home", href: "/", show: true}, 
        {name: "dashboard", href: "/dashboard", show: true},
    ].filter((item) => item.show);

    const getNavClass = (href: string) => {
        return pathname === href ? "text-blue-500" : "text-gray-500";
    }

    return (
        <header>
            <nav className='container mx-auto px-4 py-6'>
                <ul className='flex justify-between'>
                    <li key={"home"}>
                        <Link href={"/"}>Team Access Control</Link>
                    </li>
                    {/* navigation */}
                    {navigation.map((item) => (
                        <li key={item.name}>
                            <Link href={item.href} className={getNavClass(item.href)}>{item.name}</Link>
                        </li>
                    ))}
                    {/* user */}
                    {user ? (
                        <>   
                            <li>
                                <Link onClick={logout}
                                 href="/logout">Logout</Link>
                            </li>
                            <li key={user?.role}>
                                <Link href={`/profile/${user?.id}`}>{user?.name}</Link>
                            </li>
                        </>
                    ) : (
                        <li> 
                            <Link href="/login">Login</Link>
                        </li>
                    )}
                </ul> 
            </nav>
        </header>
    )
}
