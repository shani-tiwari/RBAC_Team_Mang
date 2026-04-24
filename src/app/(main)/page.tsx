import Link from "next/link";

export default function Home() {
  const user = false;
  return (
    <>
      <div className='h-full max-w-4xl mx-auto'>
        <h1 className='text-3xl font-bold mb-6'>Team Access Control Demo</h1>
        <p className='text-gray-600 mb-6'>Implement and deploy a role-based access control (RBAC) system for a multi-tenant application using Next.js, TypeScript, Prisma, and SQLite</p>
        {/* two table */}
        <div className="parent-container grid md:grid-cols-2 grid-cols-1 gap-6 mb-8">
          <div className="first bg-red-300 p-4 rounded-xl">
            <h2 className="font-bold text-xl ">Features Demontration</h2>
            <ul className="list-disc list-inside pl-4 mt-4 space-y-2">
              <li>Role bases access control (RBAC)</li>
              <li className='pl-8'> Route Protection with middleware</li>
              <li>server side permission checks </li>
              <li>client side permission hooks </li>
              <li>Dynamic route access </li>
            </ul>
          </div>
          <div className="second bg-blue-300 p-4 rounded-xl">
            <h2 className="font-bold text-xl ">USER Roles </h2>
            <ul className=" pl-4 mt-4 space-y-2">
              <li><strong>super admin</strong>full system access</li>
              <li><strong>admin</strong> user & team management</li>
              <li><strong>manager</strong> team specific  management</li>
              <li><strong>user</strong> tasks & projects view only / dashboard </li>
            </ul>
          </div>  
        </div>
      </div>
      {
        user ? (
          <div className='p-4 bg-green-300 w-1/3 mt-5 text-center rounded-md mx-auto'>
            <p>
              welcome, back,  <strong>shani</strong> u r logged in as <strong className="text-green-500 text-xl">USER</strong>
            </p>
            {/* dashboard route */}
            <Link href="/dashboard" className="mt-2 px-4 py-2 bg-green-500 text-white rounded-md">
              Dashboard
            </Link>
          </div>
        ) : (
          <div className='p-4 bg-red-300 w-1/3 mt-5 text-center rounded-md mx-auto'>
            <p className="text-red-500 font-bold">
              You are not logged in
            </p>
            {/* login button */}
            <Link href="/login" className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">
              Login
            </Link>
            {/* sign up button */}
            <Link href="/register" className="mt-2 px-4 py-2 bg-red-500 text-white rounded-md">
              Register 
            </Link>
          </div>
        )
      }
    </>
  ) 
}
