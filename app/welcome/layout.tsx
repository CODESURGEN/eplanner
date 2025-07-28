// /app/welcome/layout.tsx
import { OnboardingProvider } from './OnboardingContext';

export default function WelcomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <OnboardingProvider>{children}</OnboardingProvider>;
} 