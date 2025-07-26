'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useAuth } from '@/contexts/AuthContext'
import { handleSignOut } from '@/lib/auth'
import { useRouter } from 'next/navigation'
import { ProtectedRoute } from '@/components/ProtectedRoute'

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  const handleLogout = async () => {
    await handleSignOut()
    router.push('/auth')
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <h1 className="text-3xl font-bold text-gray-900">Eplanner Dashboard</h1>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  Welcome, {user?.displayName || user?.email}
                </span>
                <Button onClick={handleLogout} variant="outline">
                  Sign Out
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              
              {/* Welcome Card */}
              <Card className="sm:col-span-2 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Welcome to Eplanner! 🎉</CardTitle>
                  <CardDescription>
                    Your Firebase authentication is working perfectly. You're now ready to start building your event planning features.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <p><strong>User ID:</strong> {user?.uid}</p>
                    <p><strong>Email:</strong> {user?.email}</p>
                    <p><strong>Display Name:</strong> {user?.displayName || 'Not set'}</p>
                    <p><strong>Email Verified:</strong> {user?.emailVerified ? 'Yes' : 'No'}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardHeader>
                  <CardTitle>Create Event</CardTitle>
                  <CardDescription>
                    Start planning a new event
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button className="w-full">New Event</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>My Events</CardTitle>
                  <CardDescription>
                    View and manage your events
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">View Events</Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button variant="outline" className="w-full">Settings</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </ProtectedRoute>
  )
} 