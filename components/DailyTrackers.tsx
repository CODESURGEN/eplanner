'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Smile, Meh, Frown, GlassWater, Bed } from 'lucide-react';

const MOODS = [
  { icon: Frown, label: 'Sad' },
  { icon: Meh, label: 'Neutral' },
  { icon: Smile, label: 'Happy' },
];

interface DailyTrackersProps {
  initialData: {
    mood: string | null;
    waterIntake: number;
    sleep: { startTime: string; endTime: string } | null;
  };
  onSave: (data: any) => void;
}

const DailyTrackers: React.FC<DailyTrackersProps> = ({ initialData, onSave }) => {
  const [mood, setMood] = useState(initialData.mood);
  const [waterIntake, setWaterIntake] = useState(initialData.waterIntake);
  const [sleep, setSleep] = useState(initialData.sleep || { startTime: '', endTime: '' });

  useEffect(() => {
    setMood(initialData.mood);
    setWaterIntake(initialData.waterIntake);
    setSleep(initialData.sleep || { startTime: '', endTime: '' });
  }, [initialData]);

  const handleSave = (field: string, value: any) => {
    onSave({ [field]: value });
  };

  const handleWaterIntakeChange = (increment: boolean) => {
    const newValue = increment ? waterIntake + 1 : Math.max(0, waterIntake - 1);
    setWaterIntake(newValue);
    handleSave('waterIntake', newValue);
  };
  
  const handleSleepChange = (field: 'startTime' | 'endTime', value: string) => {
    const newSleep = { ...sleep, [field]: value };
    setSleep(newSleep);
    if (newSleep.startTime && newSleep.endTime) {
      handleSave('sleep', newSleep);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Trackers</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Mood Tracker */}
        <div>
          <h4 className="font-semibold mb-2">Mood</h4>
          <div className="flex justify-around">
            {MOODS.map(({ icon: Icon, label }) => (
              <Button
                key={label}
                variant={mood === label ? 'default' : 'outline'}
                size="icon"
                onClick={() => {
                  setMood(label);
                  handleSave('mood', label);
                }}
              >
                <Icon className="h-6 w-6" />
              </Button>
            ))}
          </div>
        </div>

        {/* Water Intake */}
        <div>
          <h4 className="font-semibold mb-2">Water Intake</h4>
          <div className="flex items-center justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => handleWaterIntakeChange(false)}>-</Button>
            <div className="flex items-center gap-1">
              {[...Array(8)].map((_, i) => (
                <GlassWater
                  key={i}
                  className={`h-8 w-8 ${i < waterIntake ? 'text-blue-500' : 'text-gray-300'}`}
                />
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => handleWaterIntakeChange(true)}>+</Button>
          </div>
        </div>

        {/* Sleep Tracker */}
        <div>
          <h4 className="font-semibold mb-2">Sleep</h4>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm">Start Time</label>
              <Input
                type="time"
                value={sleep.startTime}
                onChange={(e) => handleSleepChange('startTime', e.target.value)}
              />
            </div>
            <div className="flex-1">
              <label className="text-sm">End Time</label>
              <Input
                type="time"
                value={sleep.endTime}
                onChange={(e) => handleSleepChange('endTime', e.target.value)}
              />
            </div>
            <Bed className="h-8 w-8 text-purple-500" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DailyTrackers; 