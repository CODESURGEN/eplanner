// /app/welcome/OnboardingContext.tsx
'use client';

import { createContext, useState, useContext, ReactNode } from 'react';

// Define the shape of the data we'll collect
interface OnboardingData {
  username?: string;
  joyfulThings?: string[];
  deprivingThings?: string[];
  mindsetPrompts?: { when: string; need: string }[];
}

// Define the context shape
interface OnboardingContextType {
  data: OnboardingData;
  updateData: (newData: Partial<OnboardingData>) => void;
}

// Create the context with a default value
const OnboardingContext = createContext<OnboardingContextType | undefined>(undefined);

// Create the Provider component
export const OnboardingProvider = ({ children }: { children: ReactNode }) => {
  const [data, setData] = useState<OnboardingData>({});

  const updateData = (newData: Partial<OnboardingData>) => {
    setData((prevData) => ({ ...prevData, ...newData }));
  };

  return (
    <OnboardingContext.Provider value={{ data, updateData }}>
      {children}
    </OnboardingContext.Provider>
  );
};

// Create a custom hook for easy access to the context
export const useOnboarding = () => {
  const context = useContext(OnboardingContext);
  if (!context) {
    throw new Error('useOnboarding must be used within an OnboardingProvider');
  }
  return context;
}; 