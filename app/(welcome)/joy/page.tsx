'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useOnboarding } from '../OnboardingContext'
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

export default function JoyPage() {
  const [joyfulThings, setJoyfulThings] = useState(Array(5).fill(''))
  const [deprivingThings, setDeprivingThings] = useState(Array(5).fill(''))
  const { updateData } = useOnboarding()
  const router = useRouter()

  const handleNext = () => {
    const joyful = joyfulThings.map((item) => item.trim()).filter(Boolean)
    const depriving = deprivingThings.map((item) => item.trim()).filter(Boolean)
    if (joyful.length > 0 && depriving.length > 0) {
      updateData({
        joyfulThings: joyful,
        deprivingThings: depriving,
      })
      router.push('/mindset') // Navigate to the next step
    }
  }

  const handleJoyfulChange = (index: number, value: string) => {
    const newJoyfulThings = [...joyfulThings]
    newJoyfulThings[index] = value
    setJoyfulThings(newJoyfulThings)
  }

  const handleDeprivingChange = (index: number, value: string) => {
    const newDeprivingThings = [...deprivingThings]
    newDeprivingThings[index] = value
    setDeprivingThings(newDeprivingThings)
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Card className="w-[450px]">
        <CardHeader>
          <CardTitle>Personalize Your Planner</CardTitle>
          <CardDescription>
            Understanding what drives you is key to a balanced life.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="flex flex-col space-y-1.5">
              <Label>What are 5 things that bring you joy?</Label>
              {joyfulThings.map((thing, index) => (
                <Input
                  key={`joyful-${index}`}
                  type="text"
                  value={thing}
                  onChange={(e) => handleJoyfulChange(index, e.target.value)}
                  placeholder={`Joyful thing #${index + 1}`}
                  className="mt-2"
                />
              ))}
            </div>
            <div className="flex flex-col space-y-1.5 mt-4">
              <Label>What are 5 things that deprive you of joy?</Label>
              {deprivingThings.map((thing, index) => (
                <Input
                  key={`depriving-${index}`}
                  type="text"
                  value={thing}
                  onChange={(e) => handleDeprivingChange(index, e.target.value)}
                  placeholder={`Depriving thing #${index + 1}`}
                  className="mt-2"
                />
              ))}
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button onClick={handleNext}>Next</Button>
        </CardFooter>
      </Card>
    </div>
  )
} 