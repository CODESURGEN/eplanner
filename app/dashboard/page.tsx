'use client';

import { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { doc, getDoc, setDoc, updateDoc, arrayUnion, arrayRemove, Timestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import TodoList from '@/components/TodoList';
import { v4 as uuidv4 } from 'uuid';
import DateNavigator from '@/components/DateNavigator';
import DailyJournal from '@/components/DailyJournal';
import DailyTrackers from '@/components/DailyTrackers';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import DailyJoyReminder from '@/components/DailyJoyReminder';
import { Card, CardContent } from '@/components/ui/card';
import { Lightbulb } from 'lucide-react';

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

interface DailyData {
  todos: Todo[];
  mood: string | null;
  journal: string;
  waterIntake: number;
  sleep: {
    startTime: string;
    endTime: string;
  } | null;
  date: Timestamp;
}

export default function DashboardPage() {
  const [user] = useAuthState(auth);
  const [username, setUsername] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyData, setDailyData] = useState<DailyData | null>(null);
  const [onboardingData, setOnboardingData] = useState<{ joyfulThings: string[], mindsetPrompts: { when: string; need: string }[] } | null>(null);

  const fetchOrCreateDailyData = async (user: any, date: Date) => {
    const dateId = date.toISOString().split('T')[0];
    const dailyDocRef = doc(db, 'users', user.uid, 'daily_data', dateId);
    const dailyDoc = await getDoc(dailyDocRef);

    if (dailyDoc.exists()) {
      setDailyData(dailyDoc.data() as DailyData);
    } else {
      const defaultData: DailyData = {
        todos: [],
        mood: null,
        journal: '',
        waterIntake: 0,
        sleep: null,
        date: Timestamp.fromDate(date),
      };
      await setDoc(dailyDocRef, defaultData);
      setDailyData(defaultData);
    }
  };

  useEffect(() => {
    if (user) {
      const fetchUserData = async () => {
        const userDocRef = doc(db, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUsername(userData.username);
          setOnboardingData({
            joyfulThings: userData.joyfulThings || [],
            mindsetPrompts: userData.mindsetPrompts || [],
          });
        }
      };
      fetchUserData();
      fetchOrCreateDailyData(user, selectedDate);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      fetchOrCreateDailyData(user, selectedDate);
    }
  }, [selectedDate]);
  
    const getDailyDocRef = () => {
    if (!user) return null;
    const dateId = selectedDate.toISOString().split('T')[0];
    return doc(db, 'users', user.uid, 'daily_data', dateId);
  };

  const handleAddTodo = async (text: string) => {
    const dailyDocRef = getDailyDocRef();
    if (!dailyDocRef || !dailyData) return;

    const newTodo: Todo = { id: uuidv4(), text, completed: false };
    await updateDoc(dailyDocRef, {
      todos: arrayUnion(newTodo),
    });
    setDailyData({ ...dailyData, todos: [...dailyData.todos, newTodo] });
  };

  const handleToggleTodo = async (id: string) => {
    const dailyDocRef = getDailyDocRef();
    if (!dailyDocRef || !dailyData) return;

    const updatedTodos = dailyData.todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    await updateDoc(dailyDocRef, { todos: updatedTodos });
    setDailyData({ ...dailyData, todos: updatedTodos });
  };

  const handleDeleteTodo = async (id: string) => {
    const dailyDocRef = getDailyDocRef();
    if (!dailyDocRef || !dailyData) return;
    
    const todoToDelete = dailyData.todos.find(todo => todo.id === id);
    if (!todoToDelete) return;

    await updateDoc(dailyDocRef, {
      todos: arrayRemove(todoToDelete),
    });
    setDailyData({ ...dailyData, todos: dailyData.todos.filter(todo => todo.id !== id) });
  };

  const handleSaveJournal = async (content: string) => {
    const dailyDocRef = getDailyDocRef();
    if (!dailyDocRef) return;
    await updateDoc(dailyDocRef, { journal: content });
  };

  const handleSaveTrackerData = async (data: any) => {
    const dailyDocRef = getDailyDocRef();
    if (!dailyDocRef) return;
    await updateDoc(dailyDocRef, data);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Hello, {username}!</h1>
        <div className="flex items-center gap-4">
          <h2 className="text-xl hidden md:block">{selectedDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</h2>
          <Link href="/dashboard/summary">
            <Button variant="outline">View Summary</Button>
          </Link>
        </div>
      </div>
      
      {onboardingData && onboardingData.joyfulThings.length > 0 && (
        <div className="mb-8">
            <DailyJoyReminder joyfulThings={onboardingData.joyfulThings} />
        </div>
      )}

      <DateNavigator selectedDate={selectedDate} onDateChange={setSelectedDate} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
        <div className="md:col-span-2 space-y-8">
          {dailyData && dailyData.mood === 'Sad' && onboardingData && onboardingData.mindsetPrompts.length > 0 && (
            <Card className="bg-blue-100 border-blue-300">
                <CardContent className="p-4 flex items-center gap-4">
                    <Lightbulb className="h-6 w-6 text-blue-600" />
                    <div>
                        <h4 className="font-semibold text-blue-800">A little reminder for you:</h4>
                        <p className="text-blue-700">
                          When you feel {onboardingData.mindsetPrompts[0].when?.toLowerCase()}, remember: {onboardingData.mindsetPrompts[0].need}
                        </p>
                    </div>
                </CardContent>
            </Card>
          )}
          {dailyData && (
            <>
              <TodoList
                todos={dailyData.todos}
                onAddTodo={handleAddTodo}
                onToggleTodo={handleToggleTodo}
                onDeleteTodo={handleDeleteTodo}
              />
              <DailyJournal
                initialContent={dailyData.journal}
                onSave={handleSaveJournal}
              />
            </>
          )}
        </div>
        <div>
          {dailyData && (
            <DailyTrackers
              initialData={{
                mood: dailyData.mood,
                waterIntake: dailyData.waterIntake,
                sleep: dailyData.sleep,
              }}
              onSave={handleSaveTrackerData}
            />
          )}
        </div>
      </div>
    </div>
  );
} 