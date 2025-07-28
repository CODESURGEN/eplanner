// /app/dashboard/layout.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthState } from 'react-firebase-hooks/auth'; // A helpful library for auth state
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from '../../lib/firebase'; // Adjust this path to your Firebase config file

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, loadingAuth] = useAuthState(auth);
  const router = useRouter();
  const [isAllowed, setIsAllowed] = useState(false); // State to control rendering

  useEffect(() => {
    // Don't do anything while auth state is loading
    if (loadingAuth) {
      return;
    }

    // If no user, redirect to login
    if (!user) {
      router.replace('/auth');
      return;
    }

    // If we have a user, check their Firestore document
    const checkOnboarding = async () => {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists() && userDoc.data().onboardingComplete === false) {
        // User is new, redirect to onboarding
        router.replace('/username');
      } else if (userDoc.exists() && userDoc.data().onboardingComplete === true) {
        // User is fully onboarded, allow access
        setIsAllowed(true);
      } else {
        // Fallback: if doc doesn't exist or field is missing, send to login
        router.replace('/auth');
      }
    };

    checkOnboarding();
  }, [user, loadingAuth, router]);

  // Render a loading state while we check, and only render children if allowed
  if (!isAllowed) {
    return <div>Loading...</div>; // Or a nice spinner component
  }

  return <>{children}</>;
} 