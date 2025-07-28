'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';

interface DailyJoyReminderProps {
  joyfulThings: string[];
}

const DailyJoyReminder: React.FC<DailyJoyReminderProps> = ({ joyfulThings }) => {
  const [randomJoy, setRandomJoy] = useState('');

  useEffect(() => {
    if (joyfulThings.length > 0) {
      const randomIndex = Math.floor(Math.random() * joyfulThings.length);
      setRandomJoy(joyfulThings[randomIndex]);
    }
  }, [joyfulThings]);

  if (!randomJoy) {
    return null;
  }

  return (
    <Card className="bg-yellow-100 border-yellow-300">
      <CardContent className="p-4 flex items-center gap-4">
        <Sparkles className="h-6 w-6 text-yellow-600" />
        <div>
          <h4 className="font-semibold text-yellow-800">A little joy for today:</h4>
          <p className="text-yellow-700">{randomJoy}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyJoyReminder; 