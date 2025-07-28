'use client';

import { useState, useEffect } from 'react';
import { useDebouncedCallback } from 'use-debounce';
import { Textarea } from '@/components/ui/textarea';

interface DailyJournalProps {
  initialContent: string;
  onSave: (content: string) => void;
}

const DailyJournal: React.FC<DailyJournalProps> = ({ initialContent, onSave }) => {
  const [content, setContent] = useState(initialContent);

  const debouncedSave = useDebouncedCallback((value: string) => {
    onSave(value);
  }, 1000);

  useEffect(() => {
    setContent(initialContent);
  }, [initialContent]);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    debouncedSave(e.target.value);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h3 className="text-2xl font-bold mb-4">Daily Journal</h3>
      <Textarea
        value={content}
        onChange={handleChange}
        placeholder="Write your thoughts for the day..."
        className="min-h-[200px]"
      />
    </div>
  );
};

export default DailyJournal; 