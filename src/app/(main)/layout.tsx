import React from 'react'
import Header from '../components/layout/Header'
import { getCurrentUser } from '../lib/auth'

export default async function MainLayout({children}: {children: React.ReactNode}) {
  const user = await getCurrentUser();
  return (
    <>
      <Header user={user ?? null} />
      <main className='container mx-auto px-4 py-6'>
        {children}
      </main>
    </>
  )
}
