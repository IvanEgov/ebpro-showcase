// app/login/page.tsx
import { Suspense } from 'react';
import LoginClient from './LoginClient';

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0a2540] flex items-center justify-center">
        <div className="text-white animate-pulse">Загрузка...</div>
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}