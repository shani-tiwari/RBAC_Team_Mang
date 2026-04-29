
const AuthLayout = ({ children }: { children: React.ReactNode; }) => {
    return <>
        <main className="flex min-h-screen items-center justify-center p-4 sm:p-8 bg-zinc-950">
            <div className="w-full max-w-md">
                {children}
            </div>
        </main>
    </>;
};

export default AuthLayout;