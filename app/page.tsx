import { projects } from "@/data/projects";
import ScreenshotGallery from "@/components/ScreenshotGallery";
import InteractiveScada from "@/components/InteractiveScada"; // <-- 1. Добавляем импорт компонента

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                EasyBuilder Pro Showcase
              </h1>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                Облачная витрина демо-проектов HMI-панелей Weintek
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Автор портфолио</p>
              <p className="text-lg font-bold text-gray-700 dark:text-gray-300">Иван Ежов</p>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h2 className="text-2xl font-semibold mb-8 flex items-center gap-2">
          <span className="w-2 h-8 bg-blue-600 rounded-full"></span>
          Проекты ({projects.length})
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {projects.map((project) => (
            <article
              key={project.id}
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-gray-100 dark:border-gray-700 flex flex-col"
            >
              {/* === 2. УСЛОВНЫЙ РЕНДЕРИНГ: SCADA или Картинка === */}
              <div className="relative bg-gray-100 dark:bg-gray-700 overflow-hidden">
                {project.isInteractive ? (
                  <div className="w-full">
                    <InteractiveScada />
                  </div>
                ) : (
                  <div className="aspect-video group">
                    <img
                      src={project.previewImage}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                )}
                
                {/* Бейдж сложности (показываем поверх всего с z-10) */}
                <div className="absolute top-4 right-4 z-10">
                  <span className={`px-3 py-1 text-xs font-semibold rounded-full shadow-sm backdrop-blur-sm ${
                    project.complexity === 'advanced'
                      ? 'bg-purple-100/90 text-purple-800 dark:bg-purple-900/90 dark:text-purple-200'
                      : 'bg-green-100/90 text-green-800 dark:bg-green-900/90 dark:text-green-200'
                  }`}>
                    {project.complexity === 'advanced' ? 'Advanced' : 'Medium'}
                  </span>
                </div>
              </div>
              {/* ============================================== */}

              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-medium text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    {project.category}
                  </span>
                </div>

                <h3 className="text-xl font-bold mb-3 text-gray-900 dark:text-white">
                  {project.title}
                </h3>

                <p className="text-gray-600 dark:text-gray-300 text-sm mb-5 leading-relaxed flex-1">
                  {project.description}
                </p>

                <div className="grid grid-cols-2 gap-4 mb-5 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-xl">
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Контроллер</p>
                    <p className="font-semibold text-sm">{project.plc_connection.controller}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Протокол</p>
                    <p className="font-semibold text-sm">{project.plc_connection.protocol}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Экранов</p>
                    <p className="font-semibold text-sm">{project.features.screens_count}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mb-1">Макросов</p>
                    <p className="font-semibold text-sm">{project.features.macros_count}</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mb-5">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 text-xs font-medium bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md border border-gray-200 dark:border-gray-600"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* ГАЛЕРЕЯ СКРИНШОТОВ */}
                <ScreenshotGallery
                  screenshots={project.screenshots}
                  projectTitle={project.title}
                />
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}