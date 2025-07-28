'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '../OnboardingContext'
import { doc, updateDoc } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../../../lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export default function MindsetPage() {
  const { data, updateData } = useOnboarding()
  const [user] = useAuthState(auth)
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)

  const [needForGivingUp, setNeedForGivingUp] = useState('')

  const handleFinalize = async () => {
    if (!user) return
    setIsLoading(true)

    const finalMindsetPrompts = [{ when: 'Like giving up', need: needForGivingUp }]
    updateData({ mindsetPrompts: finalMindsetPrompts })

    const finalData = {
      ...data,
      mindsetPrompts: finalMindsetPrompts,
      onboardingComplete: true,
    }

    try {
      const userDocRef = doc(db, 'users', user.uid)
      await updateDoc(userDocRef, finalData)
      router.push('/dashboard')
    } catch (error) {
      console.error('Failed to finalize onboarding:', error)
      setIsLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Final Step: Prime Your Mindset</CardTitle>
          <CardDescription>
            Prepare for challenges by deciding how you'll respond.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label htmlFor="mindset-prompt">
                When I feel 'Like giving up', I need...
              </Label>
              <Input
                id="mindset-prompt"
                value={needForGivingUp}
                onChange={(e) => setNeedForGivingUp(e.target.value)}
                placeholder="e.g., to look at my progress"
              />
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleFinalize} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Finish & Open Planner'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
} 