'use client';
import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { projects } from '@/data/projects';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get('project') || 'water-treatment';
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const project = projects.find(p => p.id === projectId) || projects[0];

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    setTimeout(() => {
      if (username === 'admin' && password === 'admin') {
        localStorage.setItem(`auth_${projectId}`, 'true');
        router.push(`/projects/${projectId}`);
      } else {
        setError('Неверный логин или пароль. Используйте: admin / admin');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2540] via-[#1a3a5c] to-[#0f2840] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-2xl shadow-lg mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {project.id === 'water-treatment' ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 2 0 00-3.86.517l-.318.158a6 2 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.77 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
              )}
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">{project.title}</h1>
          <p className="text-cyan-300 text-sm">{project.category}</p>
        </div>

        <div className="bg-gray-800/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-8 shadow-2xl">
          <h2 className="text-xl font-bold text-white mb-6 text-center">Вход в систему</h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Логин</label>
              <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" placeholder="Введите логин" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">Пароль</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent" placeholder="Введите пароль" required />
            </div>
            {error && (
              <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-3">
                <p className="text-red-400 text-sm">{error}</p>
              </div>
            )}
            <button type="submit" disabled={isLoading} className="w-full py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed">
              {isLoading ? 'Вход...' : 'Войти'}
            </button>
          </form>
          <div className="mt-6 pt-6 border-t border-gray-700">
            <p className="text-xs text-gray-400 text-center">Тестовый доступ: <span className="text-cyan-400">admin</span> / <span className="text-cyan-400">admin</span></p>
          </div>
        </div>
        <div className="mt-6 text-center">
          <button onClick={() => router.push('/')} className="text-gray-400 hover:text-white text-sm transition-colors">← Вернуться к списку проектов</button>
        </div>
      </div>
    </div>
  );
}