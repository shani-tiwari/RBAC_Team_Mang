import type { Metadata } from "next";
import AuthProvider from "./provider/AuthProvider";
import "./globals.css";


export const metadata: Metadata = {
  title: "Team Access Control",
  description: "Role based Access Control System",
  keywords: ["nextjs", "react", "typescript", "prisma", "shadcn-ui", "authentication", "authorization", "role based access control", "team", "access control", "rbac", "acl", "team access control", "team management", "team roles", "team members", "user roles", "user management", "user access control", "user management", "user access control"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen w-full bg-zinc-950 text-zinc-300 antialiased">
        {/* auth provider  */}
        <AuthProvider>
            {/* ui provider  */}
            {children}
        </AuthProvider>
      </body>
    </html>
  );
}
