// app/projects/[id]/ProjectClient.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import InteractiveScada from '@/components/InteractiveScada';
import InteractiveScadaKotel from '@/components/InteractiveScadaKotel';

export default function ProjectClient({ projectId }: { projectId: string }) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const auth = localStorage.getItem(`auth_${projectId}`);
    if (!auth) {
      router.push(`/login?project=${projectId}`);
    } else {
      setIsAuthorized(true);
    }
    setIsLoading(false);
  }, [projectId, router]);

  const handleLogout = () => {
    localStorage.removeItem(`auth_${projectId}`);
    router.push('/');
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#0a2540] flex items-center justify-center">
        <div className="text-white animate-pulse">Проверка авторизации...</div>
      </div>
    );
  }

  if (!isAuthorized) {
    return null; // Компонент перенаправит пользователя, пока здесь null
  }

  return (
    <div className="min-h-screen bg-[#0a2540] p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => router.push('/')}
            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
          >
            ← На главную
          </button>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
          >
            Выйти
          </button>
        </div>

        {projectId === 'water-treatment' && <InteractiveScada />}
        {projectId === 'boiler-house' && <InteractiveScadaKotel />}
      </div>
    </div>
  );
}