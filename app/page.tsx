'use client';
import { useRouter } from 'next/navigation';
import { projects } from '@/data/projects';

export default function Home() {
  const router = useRouter();

  const handleProjectClick = (projectId: string) => {
    router.push(`/login?project=${projectId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a2540] via-[#1a3a5c] to-[#0f2840] p-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">Мониторинг объектов</h1>
          <p className="text-xl text-cyan-300">SCADA-системы управления</p>
          <div className="mt-4 text-sm text-gray-400">ООО «ЮЛИТ» | Разработка и внедрение систем автоматизации</div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              onClick={() => handleProjectClick(project.id)}
              className="group relative bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm border border-gray-700 rounded-2xl p-6 cursor-pointer transition-all duration-300 hover:scale-105 hover:border-cyan-500 hover:shadow-2xl hover:shadow-cyan-500/20"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="flex-shrink-0 w-20 h-20 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-cyan-500/50 transition-shadow">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    {project.id === 'water-treatment' ? (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 2 0 00-3.86.517l-.318.158a6 2 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                    ) : (
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.77 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                    )}
                  </svg>
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-color">{project.title}</h3>
                  <p className="text-sm text-gray-400 mt-1">{project.description}</p>
                </div>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between text-gray-400">
                  <span>Категория:</span>
                  <span className="text-cyan-400 font-medium">{project.category}</span>
                </div>
                <div className="flex items-center justify-between text-gray-400">
                  <span>Контроллер:</span>
                  <span className="text-cyan-400 font-medium">{project.plc_connection.controller}</span>
                </div>
              </div>

              {project.isInteractive && (
                <div className="absolute top-4 right-4">
                  <div className="flex items-center gap-1 bg-green-500/20 border border-green-500/50 rounded-full px-2 py-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-400 font-medium">Online</span>
                  </div>
                </div>
              )}

              <div className="mt-6 pt-4 border-t border-gray-700">
                <button className="w-full py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium rounded-lg transition-all duration-200 flex items-center justify-center gap-2">
                  <span>Войти в систему</span>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center text-gray-500 text-sm">
          <p>© 2024 ООО «ЮЛИТ». Все права защищены.</p>
          <p className="mt-2">Томск, Иркутский тракт дом 17, офис 264 | ИНН 7017466811</p>
        </div>
      </div>
    </div>
  );
}