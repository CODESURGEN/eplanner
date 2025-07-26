'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/contexts/AuthContext'

export default function Home() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/dashboard')
    }
  }, [user, router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="z-10 max-w-5xl w-full items-center justify-center text-center">
        <h1 className="text-6xl font-bold text-gray-900 mb-4">
          Welcome to Eplanner
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Your comprehensive event planning solution with secure Firebase authentication. 
          Plan, organize, and manage events with ease.
        </p>
        
        <div className="flex gap-4 justify-center">
          <Link href="/auth">
            <Button size="lg">Sign In</Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="outline" size="lg">Create Account</Button>
          </Link>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">🔐 Secure Authentication</h3>
            <p className="text-gray-600">Firebase-powered authentication with email and Google sign-in options.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">📱 Modern UI</h3>
            <p className="text-gray-600">Beautiful, responsive interface built with Next.js and Shadcn/ui components.</p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-lg font-semibold mb-3">⚡ Fast & Reliable</h3>
            <p className="text-gray-600">Optimized for performance with real-time data and instant deployments.</p>
          </div>
        </div>
      </div>
    </main>
  )
} 