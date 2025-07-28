'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

const moodToValue = (mood: string | null) => {
  switch (mood) {
    case 'Happy': return 3;
    case 'Neutral': return 2;
    case 'Sad': return 1;
    default: return 0;
  }
};

const valueToMood = (value: number) => {
    switch (value) {
        case 3: return 'Happy';
        case 2: return 'Neutral';
        case 1: return 'Sad';
        default: return 'N/A';
    }
}

const MoodChart = ({ data }: { data: any[] }) => {
  const chartData = data
    .map(item => ({
      date: item.date.toDate(),
      mood: moodToValue(item.mood),
    }))
    .sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
            dataKey="date" 
            tickFormatter={(date) => format(date, 'MMM d')} 
        />
        <YAxis 
            ticks={[1, 2, 3]}
            tickFormatter={valueToMood}
        />
        <Tooltip
          labelFormatter={(label) => format(label, 'PPP')}
          formatter={(value: number) => [valueToMood(value), 'Mood']}
        />
        <Legend />
        <Line type="monotone" dataKey="mood" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default MoodChart; 