"use client";
import { useState, useEffect } from 'react';

export default function InteractiveScadaVentilation() {
  const [activeScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
  
  // Состояния системы
  const [outdoorTemp, setOutdoorTemp] = useState(0.0);
  const [roomTemp, setRoomTemp] = useState(22.5);
  const [supplyTemp, setSupplyTemp] = useState(20.0);
  const [pressure, setPressure] = useState(150.0);
  const [isWinter, setIsWinter] = useState(false);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  
  // Статические состояния (всегда активны по ТЗ)
  const fanRunning = true;
  const damperOpen = true;

  // Базовые температуры для Томска по месяцам (0 = Январь, 11 = Декабрь)
  const getTomskBaseTemp = (month: number) => {
    if (month === 0 || month === 1 || month === 11) return -22.0; // Дек, Янв, Фев
    if (month === 2 || month === 10) return -8.0;  // Мар, Ноя
    if (month === 3 || month === 9) return 4.0;    // Апр, Окт
    if (month === 4 || month === 8) return 11.0;   // Май, Сен
    if (month === 5 || month === 7) return 19.0;   // Июн, Авг
    if (month === 6) return 21.0;                  // Июл
    return 10.0;
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());

      const month = now.getMonth();
      const baseTemp = getTomskBaseTemp(month);
      
      // Определяем сезон (для Томска зима = ноябрь, декабрь, январь, февраль, март)
      const win = month === 11 || month === 0 || month === 1 || month === 2 || month === 10;
      setIsWinter(win);

      // 1. Температура наружного воздуха: база + колебания до 1 градуса
      setOutdoorTemp(prev => {
        const target = baseTemp + (Math.random() - 0.5) * 2.0; // ±1°C
        return prev + (target - prev) * 0.2; // Плавное приближение
      });

      // 2. Температура в помещении: СТРОГО 22.0 - 23.0 °C
      setRoomTemp(prev => {
        let next = prev + (Math.random() - 0.5) * 0.15; // Естественный дрейф
        if (next < 22.0) next = 22.0 + Math.random() * 0.1; // Калорифер греет
        if (next > 23.0) next = 23.0 - Math.random() * 0.1; // Кондиционер холодит
        return Number(next.toFixed(1));
      });

      // 3. Температура приточного воздуха (зависит от сезона)
      setSupplyTemp(prev => {
        const target = isWinter ? 42.0 : 16.0; // Зимой греем до 42, летом холодим до 16
        return prev + (target - prev) * 0.05 + (Math.random() - 0.5) * 0.3;
      });

      // 4. Давление в канале: номинал 150 Па, небольшие колебания
      setPressure(prev => 150.0 + (Math.random() - 0.5) * 4.0);

    }, 1000);

    return () => clearInterval(interval);
  }, [isWinter]);

  return (
    <div className="w-full bg-[#0a2540] p-3 rounded-lg font-sans">
      {/* Верхняя панель управления (только визуал) */}
      <div className="flex items-start justify-center gap-4 mb-3">
        <div className="bg-gray-600 rounded p-2 min-w-[140px]">
          <div className="text-white text-xs text-center mb-1 font-bold">Режим</div>
          <div className="w-full py-1.5 rounded text-xs font-bold bg-green-500 text-white text-center shadow-lg cursor-default select-none">
            Автоматический
          </div>
        </div>
        <div className="bg-gray-600 rounded p-2 flex-1 max-w-[400px]">
          <div className="text-white text-xs text-center mb-1 font-bold">Экраны</div>
          <div className="flex gap-1 justify-center">
            {(['mode', 'settings', 'archive'] as const).map((screen) => (
              <div
                key={screen}
                className={`px-3 py-1.5 rounded text-xs font-bold flex-1 text-center cursor-default select-none ${
                  activeScreen === screen ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300'
                }`}
              >
                {screen === 'mode' ? 'Схема' : screen === 'settings' ? 'Настройка' : 'Архив'}
              </div>
            ))}
          </div>
        </div>
      </div>

      {activeScreen === 'mode' && (
        <>
          {/* Информационная панель */}
          <div className="flex justify-between items-center mb-2 bg-gray-800/50 p-2 rounded border border-gray-700">
            <div className="flex items-center gap-6 text-sm">
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider">Наружный воздух</span>
                <span className={`text-lg font-bold ${outdoorTemp < 0 ? 'text-cyan-400' : 'text-orange-400'}`}>
                  {outdoorTemp.toFixed(1)} °C
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider">Сезон</span>
                <span className="text-lg font-bold text-white">
                  {isWinter ? 'Зима ❄️' : 'Лето ☀️'}
                </span>
              </div>
              <div className="flex flex-col">
                <span className="text-gray-400 text-[10px] uppercase tracking-wider">Помещение</span>
                <span className={`text-lg font-bold ${roomTemp >= 22.0 && roomTemp <= 23.0 ? 'text-green-400' : 'text-red-400'}`}>
                  {roomTemp.toFixed(1)} °C
                </span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-white text-xs font-mono">{currentTime}</div>
              <div className="text-gray-400 text-[10px]">{currentDate}</div>
            </div>
          </div>

          {/* SVG Схема */}
          <div className="relative w-full mb-2" style={{ height: '400px' }}>
            <svg viewBox="0 0 1000 400" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="ductGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#4a5568" />
                  <stop offset="50%" stopColor="#718096" />
                  <stop offset="100%" stopColor="#4a5568" />
                </linearGradient>
                <linearGradient id="heaterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#742a2a" />
                  <stop offset="50%" stopColor="#e53e3e" />
                  <stop offset="100%" stopColor="#742a2a" />
                </linearGradient>
                <linearGradient id="acGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#2a4365" />
                  <stop offset="50%" stopColor="#3182ce" />
                  <stop offset="100%" stopColor="#2a4365" />
                </linearGradient>
              </defs>

              {/* ===== ВОЗДУХОВОДЫ ===== */}
              {/* Основной канал */}
              <path d="M 50 150 L 950 150" stroke="url(#ductGradient)" strokeWidth="60" fill="none" />
              <path d="M 50 150 L 950 150" stroke="#2d3748" strokeWidth="2" fill="none" strokeDasharray="4 4" />

              {/* ===== ОБОРУДОВАНИЕ ===== */}
              
              {/* 1. Воздушная заслонка (Всегда открыта) */}
              <g transform="translate(120, 120)">
                <rect x="0" y="0" width="60" height="60" fill="#2d3748" stroke="#4a5568" strokeWidth="2" rx="4"/>
                {/* Открытая заслонка (параллельна потоку) */}
                <line x1="30" y1="10" x2="30" y2="50" stroke="#48bb78" strokeWidth="6" strokeLinecap="round" />
                <text x="30" y="80" textAnchor="middle" fontSize="11" fill="#48bb78" fontWeight="bold">ЗАСЛОНКА</text>
                <text x="30" y="95" textAnchor="middle" fontSize="10" fill="#a0aec0">ОТКРЫТА</text>
                <circle cx="50" cy="10" r="5" fill="#48bb78" className="animate-pulse"/>
              </g>

              {/* 2. Вентилятор (Всегда включен) */}
              <g transform="translate(250, 120)">
                <circle cx="30" cy="30" r="35" fill="#2d3748" stroke="#4a5568" strokeWidth="3"/>
                <g className="animate-spin" style={{ transformOrigin: '30px 30px', animationDuration: '0.8s' }}>
                  <path d="M 30 10 L 38 30 L 30 50 L 22 30 Z" fill="#48bb78"/>
                  <path d="M 10 30 L 30 22 L 50 30 L 30 38 Z" fill="#48bb78" opacity="0.7"/>
                </g>
                <circle cx="30" cy="30" r="8" fill="#1a202c" stroke="#48bb78" strokeWidth="2"/>
                <text x="30" y="85" textAnchor="middle" fontSize="11" fill="#48bb78" fontWeight="bold">ВЕНТИЛЯТОР</text>
                <text x="30" y="100" textAnchor="middle" fontSize="10" fill="#a0aec0">РАБОТА</text>
              </g>

              {/* 3. Водяной калорифер (Работает только зимой) */}
              <g transform="translate(400, 110)">
                <rect x="0" y="0" width="80" height="80" rx="6" fill={isWinter ? "url(#heaterGradient)" : "#2d3748"} stroke={isWinter ? "#fc8181" : "#4a5568"} strokeWidth="2"/>
                {isWinter && (
                  <>
                    <path d="M 15 20 Q 25 40 15 60" stroke="#fff" strokeWidth="2" fill="none" className="animate-pulse"/>
                    <path d="M 35 20 Q 45 40 35 60" stroke="#fff" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.2s'}}/>
                    <path d="M 55 20 Q 65 40 55 60" stroke="#fff" strokeWidth="2" fill="none" className="animate-pulse" style={{animationDelay: '0.4s'}}/>
                  </>
                )}
                {!isWinter && (
                  <text x="40" y="45" textAnchor="middle" fontSize="24" fill="#4a5568">💧</text>
                )}
                <text x="40" y="105" textAnchor="middle" fontSize="11" fill={isWinter ? "#fc8181" : "#a0aec0"} fontWeight="bold">КАЛОРИФЕР</text>
                <text x="40" y="120" textAnchor="middle" fontSize="10" fill="#a0aec0">{isWinter ? 'НАГРЕВ' : 'ОЖИДАНИЕ'}</text>
                <circle cx="70" cy="10" r="5" fill={isWinter ? "#f56565" : "#4a5568"} className="animate-pulse"/>
              </g>

              {/* 4. Кондиционер (Работает только летом) */}
              <g transform="translate(550, 110)">
                <rect x="0" y="0" width="80" height="80" rx="6" fill={!isWinter ? "url(#acGradient)" : "#2d3748"} stroke={!isWinter ? "#63b3ed" : "#4a5568"} strokeWidth="2"/>
                {!isWinter && (
                  <>
                    <path d="M 20 30 L 30 50 L 40 30 L 50 50 L 60 30" stroke="#fff" strokeWidth="2" fill="none" className="animate-pulse"/>
                    <text x="40" y="70" textAnchor="middle" fontSize="16" fill="#fff" className="animate-pulse">❄️</text>
                  </>
                )}
                {isWinter && (
                  <text x="40" y="45" textAnchor="middle" fontSize="24" fill="#4a5568">❄️</text>
                )}
                <text x="40" y="105" textAnchor="middle" fontSize="11" fill={!isWinter ? "#63b3ed" : "#a0aec0"} fontWeight="bold">КОНДИЦИОНЕР</text>
                <text x="40" y="120" textAnchor="middle" fontSize="10" fill="#a0aec0">{!isWinter ? 'ОХЛАЖД.' : 'ОЖИДАНИЕ'}</text>
                <circle cx="70" cy="10" r="5" fill={!isWinter ? "#4299e1" : "#4a5568"} className="animate-pulse"/>
              </g>

              {/* 5. Фильтр */}
              <g transform="translate(720, 120)">
                <rect x="0" y="0" width="60" height="60" fill="#2d3748" stroke="#4a5568" strokeWidth="2" rx="4"/>
                <line x1="15" y1="10" x2="15" y2="50" stroke="#a0aec0" strokeWidth="3"/>
                <line x1="30" y1="10" x2="30" y2="50" stroke="#a0aec0" strokeWidth="3"/>
                <line x1="45" y1="10" x2="45" y2="50" stroke="#a0aec0" strokeWidth="3"/>
                <text x="30" y="80" textAnchor="middle" fontSize="11" fill="#a0aec0" fontWeight="bold">ФИЛЬТР</text>
                <text x="30" y="95" textAnchor="middle" fontSize="10" fill="#48bb78">ЧИСТЫЙ</text>
                <circle cx="50" cy="10" r="5" fill="#48bb78" className="animate-pulse"/>
              </g>

              {/* ===== ДАТЧИКИ ===== */}
              
              {/* Датчик наружного воздуха */}
              <g transform="translate(80, 80)">
                <circle cx="0" cy="0" r="18" fill="#1a202c" stroke="#4299e1" strokeWidth="2"/>
                <text x="0" y="-4" textAnchor="middle" fontSize="10" fill="#a0aec0">Tнар</text>
                <text x="0" y="8" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#4299e1">{outdoorTemp.toFixed(1)}°</text>
              </g>

              {/* Датчик приточного воздуха */}
              <g transform="translate(650, 80)">
                <circle cx="0" cy="0" r="18" fill="#1a202c" stroke={isWinter ? "#f56565" : "#4299e1"} strokeWidth="2"/>
                <text x="0" y="-4" textAnchor="middle" fontSize="10" fill="#a0aec0">Tприт</text>
                <text x="0" y="8" textAnchor="middle" fontSize="12" fontWeight="bold" fill={isWinter ? "#f56565" : "#4299e1"}>{supplyTemp.toFixed(1)}°</text>
              </g>

              {/* Датчик давления */}
              <g transform="translate(440, 240)">
                <circle cx="0" cy="0" r="22" fill="#1a202c" stroke="#ed8936" strokeWidth="2"/>
                <text x="0" y="-6" textAnchor="middle" fontSize="9" fill="#a0aec0">ΔP</text>
                <text x="0" y="8" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#ed8936">{pressure.toFixed(0)}</text>
                <text x="0" y="18" textAnchor="middle" fontSize="8" fill="#a0aec0">Па</text>
              </g>

              {/* Датчик температуры в помещении */}
              <g transform="translate(900, 150)">
                <rect x="-40" y="-30" width="80" height="60" rx="8" fill="#1a202c" stroke="#48bb78" strokeWidth="2"/>
                <text x="0" y="-12" textAnchor="middle" fontSize="10" fill="#a0aec0">ПОМЕЩЕНИЕ</text>
                <text x="0" y="10" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#48bb78">{roomTemp.toFixed(1)} °C</text>
                <rect x="-30" y="18" width="60" height="4" rx="2" fill="#2d3748"/>
                <rect 
                  x="-30" 
                  y="18" 
                  width={`${((roomTemp - 20) / 5) * 60}`} 
                  height="4" 
                  rx="2" 
                  fill={roomTemp >= 22.0 && roomTemp <= 23.0 ? "#48bb78" : "#f56565"}
                  className="transition-all duration-500"
                />
              </g>

              {/* Поток воздуха (анимация) */}
              <path d="M 90 150 L 900 150" stroke="#48bb78" strokeWidth="2" fill="none" strokeDasharray="8 8" className="animate-pulse" opacity="0.6"/>
            </svg>
          </div>

          {/* Нижняя панель параметров */}
          <div className="grid grid-cols-4 gap-2">
            <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
              <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Воздух</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Наружный:</span>
                  <span className={outdoorTemp < 0 ? 'text-cyan-400 font-mono' : 'text-orange-400 font-mono'}>{outdoorTemp.toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Приточный:</span>
                  <span className={isWinter ? 'text-red-400 font-mono' : 'text-blue-400 font-mono'}>{supplyTemp.toFixed(1)} °C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">В комнате:</span>
                  <span className="text-green-400 font-mono font-bold">{roomTemp.toFixed(1)} °C</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
              <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Оборудование</h3>
              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between p-1.5 rounded bg-green-500/10 border border-green-500/30">
                  <span className="text-green-400">Вентилятор</span>
                  <span className="text-green-400 font-bold">● ВКЛ</span>
                </div>
                <div className="flex items-center justify-between p-1.5 rounded bg-green-500/10 border border-green-500/30">
                  <span className="text-green-400">Воздушная заслонка</span>
                  <span className="text-green-400 font-bold">● ОТКРЫТА</span>
                </div>
                <div className={`flex items-center justify-between p-1.5 rounded border ${isWinter ? 'bg-red-500/10 border-red-500/30' : 'bg-gray-700/50 border-gray-600'}`}>
                  <span className={isWinter ? 'text-red-400' : 'text-gray-400'}>Водяной калорифер</span>
                  <span className={isWinter ? 'text-red-400 font-bold' : 'text-gray-500'}>{isWinter ? '● НАГРЕВ' : '○ ВЫКЛ'}</span>
                </div>
                <div className={`flex items-center justify-between p-1.5 rounded border ${!isWinter ? 'bg-blue-500/10 border-blue-500/30' : 'bg-gray-700/50 border-gray-600'}`}>
                  <span className={!isWinter ? 'text-blue-400' : 'text-gray-400'}>Кондиционер</span>
                  <span className={!isWinter ? 'text-blue-400 font-bold' : 'text-gray-500'}>{!isWinter ? '● ОХЛАЖД.' : '○ ВЫКЛ'}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
              <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Давление</h3>
              <div className="flex flex-col items-center justify-center py-2">
                <div className="text-3xl font-bold text-orange-400 font-mono">{pressure.toFixed(0)}</div>
                <div className="text-xs text-gray-400 mt-1">Паскаль (Па)</div>
                <div className="w-full bg-gray-700 rounded-full h-1.5 mt-3">
                  <div className="bg-orange-400 h-1.5 rounded-full transition-all duration-300" style={{ width: `${(pressure / 200) * 100}%` }}/>
                </div>
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
              <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Состояние системы</h3>
              <div className="flex flex-col items-center justify-center py-2 space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${isWinter ? 'bg-red-500 animate-pulse' : 'bg-blue-500 animate-pulse'}`}></div>
                  <span className="text-sm font-bold text-white">{isWinter ? 'ЗИМНИЙ РЕЖИМ' : 'ЛЕТНИЙ РЕЖИМ'}</span>
                </div>
                <div className="text-xs text-gray-400 text-center px-2">
                  Температура в помещении стабилизирована в диапазоне 22.0 – 23.0 °C
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}