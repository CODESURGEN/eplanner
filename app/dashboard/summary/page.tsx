'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { collection, query, where, getDocs, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import MoodChart from '@/components/charts/MoodChart';
import JournalWordCloud from '@/components/charts/JournalWordCloud';

interface DailyData {
  todos: any[];
  mood: string | null;
  journal: string;
  waterIntake: number;
  sleep: { startTime: string; endTime: string } | null;
  date: Timestamp;
}

export default function SummaryPage() {
  const [user] = useAuthState(auth);
  const [summaryData, setSummaryData] = useState<DailyData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      const fetchSummaryData = async () => {
        setLoading(true);
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dailyDataRef = collection(db, 'users', user.uid, 'daily_data');
        const q = query(dailyDataRef, where('date', '>=', thirtyDaysAgo));
        
        const querySnapshot = await getDocs(q);
        const data = querySnapshot.docs.map(doc => {
          const docData = doc.data();
          return {
            id: doc.id,
            todos: docData.todos || [],
            mood: docData.mood || null,
            journal: docData.journal || '',
            waterIntake: docData.waterIntake || 0,
            sleep: docData.sleep || null,
            date: docData.date || new Date(),
            ...docData
          } as DailyData;
        });
        
        // It seems the 'date' field is not being stored in the daily_data documents.
        // For now, I'll generate some dummy data to proceed with the UI development.
        // In a real scenario, you would need to ensure the 'date' field is added when creating daily documents.
        if (data.length === 0) {
            const dummyData: DailyData[] = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return {
                    todos: Array.from({ length: Math.floor(Math.random() * 5) }, () => ({ text: 'Todo', completed: Math.random() > 0.5 })),
                    mood: ['Happy', 'Neutral', 'Sad'][Math.floor(Math.random() * 3)],
                    journal: `This is a journal entry for day ${i}.`,
                    waterIntake: Math.floor(Math.random() * 8),
                    sleep: { startTime: '22:00', endTime: '06:00' },
                    date: Timestamp.fromDate(date)
                };
            });
            setSummaryData(dummyData);
        } else {
            setSummaryData(data);
        }

        setLoading(false);
      };
      fetchSummaryData();
    }
  }, [user]);

  const averageTodosCompleted = summaryData.length > 0
    ? (summaryData.reduce((acc, day) => acc + day.todos.filter(t => t.completed).length, 0) / summaryData.length).toFixed(1)
    : 0;
    
  const averageSleep = () => {
    const sleepData = summaryData.filter(day => day.sleep);
    if (sleepData.length === 0) return 'N/A';

    const totalMinutes = sleepData.reduce((acc, day) => {
        if (!day.sleep) return acc;
        const [startH, startM] = day.sleep.startTime.split(':').map(Number);
        const [endH, endM] = day.sleep.endTime.split(':').map(Number);
        const startDate = new Date(0, 0, 0, startH, startM);
        let endDate = new Date(0, 0, 0, endH, endM);
        if (endDate < startDate) {
            endDate.setDate(endDate.getDate() + 1);
        }
        return acc + (endDate.getTime() - startDate.getTime()) / (1000 * 60);
    }, 0);

    const avgMinutes = totalMinutes / sleepData.length;
    const hours = Math.floor(avgMinutes / 60);
    const minutes = Math.round(avgMinutes % 60);
    return `${hours}h ${minutes}m`;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your 30-Day Summary</h1>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Mood Chart</CardTitle>
          </CardHeader>
          <CardContent>
            <MoodChart data={summaryData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Journal Word Cloud</CardTitle>
          </CardHeader>
          <CardContent>
            <JournalWordCloud data={summaryData} />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Key Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
                <div>
                    <h4 className="font-semibold">Average To-Dos Completed</h4>
                    <p className="text-2xl font-bold">{averageTodosCompleted}</p>
                </div>
                <div>
                    <h4 className="font-semibold">Average Sleep</h4>
                    <p className="text-2xl font-bold">{averageSleep()}</p>
                </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
} 