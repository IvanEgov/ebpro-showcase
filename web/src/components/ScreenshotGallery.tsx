'use client';

import { useState, useEffect, useCallback } from 'react';

interface ScreenshotGalleryProps {
  screenshots: string[];
  projectTitle: string;
}

export default function ScreenshotGallery({
  screenshots,
  projectTitle,
}: ScreenshotGalleryProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const openModal = () => {
    setCurrentIndex(0);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  const goToPrevious = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === 0 ? screenshots.length - 1 : prev - 1
    );
  }, [screenshots.length]);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) =>
      prev === screenshots.length - 1 ? 0 : prev + 1
    );
  }, [screenshots.length]);

  // Обработка клавиатуры
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
      if (e.key === 'ArrowLeft') goToPrevious();
      if (e.key === 'ArrowRight') goToNext();
    };

    // Блокируем прокрутку страницы, когда модалка открыта
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, goToPrevious, goToNext]);

  if (screenshots.length === 0) return null;

  return (
    <>
      {/* Кнопка открытия галереи */}
      <button
        onClick={openModal}
        className="w-full mt-5 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-medium rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
        Смотреть скриншоты ({screenshots.length})
      </button>

      {/* Модальное окно */}
      {isOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label={`Галерея скриншотов: ${projectTitle}`}
        >
          <div
            className="relative max-w-6xl w-full flex flex-col items-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Заголовок */}
            <div className="w-full flex items-center justify-between mb-4">
              <div>
                <h3 className="text-white text-lg md:text-xl font-semibold">
                  {projectTitle}
                </h3>
                <p className="text-gray-400 text-sm">
                  Скриншот {currentIndex + 1} из {screenshots.length}
                </p>
              </div>

              {/* Кнопка закрытия */}
              <button
                onClick={closeModal}
                className="text-white hover:text-gray-300 transition-colors p-2 hover:bg-white/10 rounded-lg"
                aria-label="Закрыть"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-7 w-7"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Контейнер изображения */}
            <div className="relative w-full bg-gray-900 rounded-lg overflow-hidden flex items-center justify-center min-h-[300px]">
              <img
                key={currentIndex}
                src={screenshots[currentIndex]}
                alt={`${projectTitle} — скриншот ${currentIndex + 1}`}
                className="max-w-full max-h-[75vh] object-contain animate-in fade-in duration-200"
              />

              {/* Кнопка "Назад" */}
              {screenshots.length > 1 && (
                <button
                  onClick={goToPrevious}
                  className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Предыдущий скриншот"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
              )}

              {/* Кнопка "Вперёд" */}
              {screenshots.length > 1 && (
                <button
                  onClick={goToNext}
                  className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-white p-3 rounded-full transition-colors backdrop-blur-sm"
                  aria-label="Следующий скриншот"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              )}
            </div>

            {/* Индикаторы (точки) */}
            {screenshots.length > 1 && (
              <div className="flex justify-center gap-2 mt-4">
                {screenshots.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`h-2 rounded-full transition-all duration-200 ${
                      index === currentIndex
                        ? 'bg-blue-500 w-8'
                        : 'bg-gray-600 hover:bg-gray-500 w-2'
                    }`}
                    aria-label={`Перейти к скриншоту ${index + 1}`}
                  />
                ))}
              </div>
            )}

            {/* Подсказка по клавишам */}
            <p className="text-gray-500 text-xs mt-3 text-center">
              ← → для навигации • Esc для закрытия
            </p>
          </div>
        </div>
      )}
    </>
  );
}