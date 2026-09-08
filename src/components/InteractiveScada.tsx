"use client";

import { useState, useEffect } from 'react';

export default function InteractiveScada() {
  const [activeScreen, setActiveScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
  const [activeMode, setActiveMode] = useState<'filtration' | 'automatic'>('filtration');
  const [pump1Running, setPump1Running] = useState(false);
  const [pump2Running, setPump2Running] = useState(false);
  const [pumpMainRunning, setPumpMainRunning] = useState(false);
  const [pressureMain, setPressureMain] = useState(0.0);
  const [pressureRight, setPressureRight] = useState(0.0);
  const [pressureRCHV1, setPressureRCHV1] = useState(0.0);
  const [pressureRCHV2, setPressureRCHV2] = useState(0.0);
  const [reactorLevel, setReactorLevel] = useState(45);
  const [filterStatus, setFilterStatus] = useState([false, false, false, false]);

  useEffect(() => {
    if (activeMode === 'automatic' && pumpMainRunning) {
      const interval = setInterval(() => {
        setPressureMain(prev => Math.min(2.5, prev + 0.1));
        setPressureRight(prev => Math.min(1.8, prev + 0.08));
        setPressureRCHV1(prev => Math.min(3.0, prev + 0.05));
        setPressureRCHV2(prev => Math.min(2.5, prev + 0.04));
        setReactorLevel(prev => Math.min(95, prev + 1));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setPressureMain(0);
      setPressureRight(0);
      setPressureRCHV1(0);
      setPressureRCHV2(0);
    }
  }, [activeMode, pumpMainRunning]);

  const togglePump = (pump: number) => {
    if (pump === 1) setPump1Running(!pump1Running);
    if (pump === 2) setPump2Running(!pump2Running);
    if (pump === 3) setPumpMainRunning(!pumpMainRunning);
  };

  const toggleFilter = (index: number) => {
    const newStatus = [...filterStatus];
    newStatus[index] = !newStatus[index];
    setFilterStatus(newStatus);
  };

  return (
    <div className="w-full bg-[#0a2540] p-3 rounded-lg">
      {/* Верхняя панель: Режим и Кнопки */}
      <div className="flex items-start justify-center gap-4 mb-3">
        <div className="bg-gray-600 rounded p-2 min-w-[140px]">
          <div className="text-white text-xs text-center mb-1 font-bold">Режим</div>
          <button
            onClick={() => setActiveMode('filtration')}
            className={`w-full py-1.5 rounded text-xs font-bold mb-1 transition-all ${
              activeMode === 'filtration'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Фильтрация
          </button>
          <button
            onClick={() => setActiveMode('automatic')}
            className={`w-full py-1.5 rounded text-xs font-bold transition-all ${
              activeMode === 'automatic'
                ? 'bg-green-500 text-white shadow-lg shadow-green-500/50'
                : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
            }`}
          >
            Автоматический режим
          </button>
        </div>

        <div className="bg-gray-600 rounded p-2 flex-1 max-w-[400px]">
          <div className="text-white text-xs text-center mb-1 font-bold">Кнопки</div>
          <div className="flex gap-1 justify-center">
            <button
              onClick={() => setActiveScreen('mode')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex-1 transition-all ${
                activeScreen === 'mode' 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Режим
            </button>
            <button
              onClick={() => setActiveScreen('settings')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex-1 transition-all ${
                activeScreen === 'settings' 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Настройка
            </button>
            <button
              onClick={() => setActiveScreen('archive')}
              className={`px-3 py-1.5 rounded text-xs font-bold flex-1 transition-all ${
                activeScreen === 'archive' 
                  ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Архив
            </button>
          </div>
        </div>
      </div>

      {activeScreen === 'mode' && (
        <>
          <div className="relative w-full mb-2" style={{ height: '360px' }}>
            <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              
              {/* ===== ТРУБЫ ===== */}
              {/* От бака-реактора вниз к насосам (обновлено для Насоса 1) */}
              <path d="M 170 320 L 170 380 L 200 380" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 170 320 L 170 380 L 300 380" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От насосов вниз и вправо к нижней горизонтали (обновлено для Насоса 1) */}
              <path d="M 200 420 L 200 460 L 400 460" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 300 420 L 300 460 L 400 460" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От нижней горизонтали вверх к главной */}
              <path d="M 400 460 L 400 100 L 500 100" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 500 100 L 1000 100" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От главной трубы вниз к фильтрам */}
              <path d="M 500 100 L 500 200" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 650 100 L 650 200" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 800 100 L 800 200" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 950 100 L 950 200" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От фильтров вниз к нижней горизонтали */}
              <path d="M 500 350 L 500 420 L 400 420" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 650 350 L 650 420 L 400 420" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 800 350 L 800 420 L 400 420" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 950 350 L 950 420 L 400 420" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              <path d="M 400 420 L 1050 420" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От нижней горизонтали к главному насосу и вверх к РПВ */}
              <path d="M 1050 420 L 1050 380" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              
              {/* От главной трубы к РЧВ1 и РЧВ2 */}
              <path d="M 1000 100 L 1000 60 L 1050 60" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 1000 100 L 1000 150 L 1050 150" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>
              <path d="M 1050 380 L 1050 470 L 950 470" stroke="#00b4d8" strokeWidth="6" fill="none" opacity="0.8"/>

              {/* ===== ЗАДВИЖКИ (Анимированные, красивые) ===== */}

{/* Задвижка под первым фильтром (x=500, y=420) */}
<g className={`transition-transform duration-700 ease-in-out ${pump1Running ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: '500px 420px' }}>
  {/* Тень для объема */}
  <ellipse cx="500" cy="425" rx="18" ry="6" fill="#000" opacity="0.3"/>
  {/* Корпус задвижки (ромб) */}
  <path d="M 500 400 L 520 420 L 500 440 L 480 420 Z" 
        fill={pump1Running ? '#00d4ff' : '#ff4444'} 
        stroke="#fff" strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}/>
  {/* Внутренний контур для объема */}
  <path d="M 500 405 L 515 420 L 500 435 L 485 420 Z" 
        fill="none" stroke="#fff" strokeWidth="1" opacity="0.6"/>
  {/* Штурвал (круг сверху) */}
  <circle cx="500" cy="390" r="10" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
  <circle cx="500" cy="390" r="6" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="1"/>
  {/* Крестовина штурвала */}
  <line x1="500" y1="384" x2="500" y2="396" stroke="#606060" strokeWidth="2"/>
  <line x1="494" y1="390" x2="506" y2="390" stroke="#606060" strokeWidth="2"/>
  {/* Индикатор статуса */}
  <circle cx="500" cy="370" r="6" fill={pump1Running ? '#00ff00' : '#ff0000'} 
          stroke="#fff" strokeWidth="1.5" className="animate-pulse"
          style={{ filter: `drop-shadow(0 0 6px ${pump1Running ? '#00ff00' : '#ff0000'})` }}/>
</g>

{/* Задвижка над вторым фильтром (x=650, y=100) */}
<g className={`transition-transform duration-700 ease-in-out ${pump2Running ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: '650px 100px' }}>
  <ellipse cx="650" cy="105" rx="18" ry="6" fill="#000" opacity="0.3"/>
  <path d="M 650 80 L 670 100 L 650 120 L 630 100 Z" 
        fill={pump2Running ? '#00d4ff' : '#ff4444'} 
        stroke="#fff" strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}/>
  <path d="M 650 85 L 665 100 L 650 115 L 635 100 Z" 
        fill="none" stroke="#fff" strokeWidth="1" opacity="0.6"/>
  <circle cx="650" cy="70" r="10" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
  <circle cx="650" cy="70" r="6" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="1"/>
  <line x1="650" y1="64" x2="650" y2="76" stroke="#606060" strokeWidth="2"/>
  <line x1="644" y1="70" x2="656" y2="70" stroke="#606060" strokeWidth="2"/>
  <circle cx="650" cy="50" r="6" fill={pump2Running ? '#00ff00' : '#ff0000'} 
          stroke="#fff" strokeWidth="1.5" className="animate-pulse"
          style={{ filter: `drop-shadow(0 0 6px ${pump2Running ? '#00ff00' : '#ff0000'})` }}/>
</g>

{/* Главная задвижка под третьим фильтром (x=800, y=420) */}
<g className={`transition-transform duration-700 ease-in-out ${pumpMainRunning ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: '800px 420px' }}>
  <ellipse cx="800" cy="425" rx="18" ry="6" fill="#000" opacity="0.3"/>
  <path d="M 800 400 L 820 420 L 800 440 L 780 420 Z" 
        fill={pumpMainRunning ? '#00d4ff' : '#ff4444'} 
        stroke="#fff" strokeWidth="2"
        style={{ filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.5))' }}/>
  <path d="M 800 405 L 815 420 L 800 435 L 785 420 Z" 
        fill="none" stroke="#fff" strokeWidth="1" opacity="0.6"/>
  <circle cx="800" cy="390" r="10" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
  <circle cx="800" cy="390" r="6" fill="#e0e0e0" stroke="#a0a0a0" strokeWidth="1"/>
  <line x1="800" y1="384" x2="800" y2="396" stroke="#606060" strokeWidth="2"/>
  <line x1="794" y1="390" x2="806" y2="390" stroke="#606060" strokeWidth="2"/>
  <circle cx="800" cy="370" r="6" fill={pumpMainRunning ? '#00ff00' : '#ff0000'} 
          stroke="#fff" strokeWidth="1.5" className="animate-pulse"
          style={{ filter: `drop-shadow(0 0 6px ${pumpMainRunning ? '#00ff00' : '#ff0000'})` }}/>
</g>

              {/* ===== БАК-РЕАКТОР ===== */}
              <g onClick={() => setReactorLevel(Math.random() * 100)} className="cursor-pointer">
                <rect x="80" y="200" width="180" height="120" rx="15" fill="#c0c0c0" stroke="#808080" strokeWidth="3"/>
                <rect x="90" y={320 - reactorLevel * 1} width="160" height={reactorLevel * 1} rx="10" fill="#00b4d8" opacity="0.5"/>
                <ellipse cx="120" cy="200" rx="15" ry="5" fill="#a0a0a0" stroke="#808080" strokeWidth="2"/>
                <ellipse cx="220" cy="200" rx="15" ry="5" fill="#a0a0a0" stroke="#808080" strokeWidth="2"/>
                <text x="170" y="240" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">ВУ</text>
                <text x="170" y="270" textAnchor="middle" fontSize="14" fill="white">Бак-реактор</text>
                <text x="170" y="300" textAnchor="middle" fontSize="18" fontWeight="bold" fill="white">НУ</text>
                <circle cx="240" cy="230" r="10" fill={reactorLevel > 80 ? '#ff0000' : '#00ff00'} className="animate-pulse"/>
                <circle cx="240" cy="280" r="10" fill={reactorLevel < 20 ? '#ff0000' : '#00ff00'} className="animate-pulse"/>
              </g>

              {/* ===== НАСОС 1 (СДВИНУТ НА 20px ВЛЕВО) ===== */}
              <g onClick={() => togglePump(1)} className="cursor-pointer">
                <rect x="180" y="380" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
                {pump1Running && (
                  <g className="animate-spin" style={{ transformOrigin: '200px 400px' }}>
                    <path d="M 200 388 L 208 400 L 200 412 L 192 400 Z" fill="#00b4d8"/>
                  </g>
                )}
                <circle cx="200" cy="400" r="8" fill={pump1Running ? '#00b4d8' : '#404040'}/>
                <text x="200" y="440" textAnchor="middle" fontSize="10" fill="white">Насос 1</text>
                <rect x="225" y="385" width="50" height="20" rx="3" fill={pump1Running ? '#2d5016' : '#8b0000'}/>
                <text x="250" y="399" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {pump1Running ? 'Норма' : 'Авария'}
                </text>
              </g>

              {/* ===== НАСОС 2 ===== */}
              <g onClick={() => togglePump(2)} className="cursor-pointer">
                <rect x="280" y="380" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
                {pump2Running && (
                  <g className="animate-spin" style={{ transformOrigin: '300px 400px' }}>
                    <path d="M 300 388 L 308 400 L 300 412 L 292 400 Z" fill="#00b4d8"/>
                  </g>
                )}
                <circle cx="300" cy="400" r="8" fill={pump2Running ? '#00b4d8' : '#404040'}/>
                <text x="300" y="440" textAnchor="middle" fontSize="10" fill="white">Насос 2</text>
                <rect x="325" y="385" width="50" height="20" rx="3" fill={pump2Running ? '#2d5016' : '#8b0000'}/>
                <text x="350" y="399" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {pump2Running ? 'Норма' : 'Авария'}
                </text>
              </g>

              {/* ===== МАНОМЕТР ===== */}
              <g>
                <circle cx="400" cy="80" r="20" fill="#202020" stroke="#404040" strokeWidth="2"/>
                <text x="400" y="77" textAnchor="middle" fontSize="11" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
                <text x="400" y="90" textAnchor="middle" fontSize="9" fill="white">Па</text>
              </g>

              {/* ===== 4 ФИЛЬТРА ===== */}
              {[0, 1, 2, 3].map((i) => {
                const x = 470 + i * 150;
                return (
                  <g key={i} onClick={() => toggleFilter(i)} className="cursor-pointer">
                    <rect x={x} y="200" width="60" height="150" rx="8" fill="#d0d0d0" stroke="#808080" strokeWidth="2"/>
                    <ellipse cx={x + 30} cy="200" rx="30" ry="8" fill="#b0b0b0" stroke="#808080" strokeWidth="2"/>
                    <ellipse cx={x + 30} cy="350" rx="30" ry="8" fill="#b0b0b0" stroke="#808080" strokeWidth="2"/>
                    <rect x={x + 5} y="260" width="50" height="22" rx="3" fill={filterStatus[i] ? '#2d5016' : '#8b0000'}/>
                    <text x={x + 30} y="275" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                      {filterStatus[i] ? 'Работа' : 'Авария'}
                    </text>
                    <circle cx={x + 30} cy="220" r="6" fill={filterStatus[i] ? '#00ff00' : '#ff0000'} className="animate-pulse"/>
                  </g>
                );
              })}

              {/* ===== ГЛАВНЫЙ НАСОС ===== */}
              <g onClick={() => togglePump(3)} className="cursor-pointer">
                <rect x="1030" y="420" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
                {pumpMainRunning && (
                  <g className="animate-spin" style={{ transformOrigin: '1050px 440px' }}>
                    <path d="M 1050 428 L 1058 440 L 1050 452 L 1042 440 Z" fill="#00b4d8"/>
                  </g>
                )}
                <circle cx="1050" cy="440" r="8" fill={pumpMainRunning ? '#00b4d8' : '#404040'}/>
                <rect x="1075" y="425" width="50" height="20" rx="3" fill={pumpMainRunning ? '#2d5016' : '#8b0000'}/>
                <text x="1100" y="439" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                  {pumpMainRunning ? 'Норма' : 'Авария'}
                </text>
                <circle cx="1050" cy="400" r="18" fill="#202020" stroke="#404040" strokeWidth="2"/>
                <text x="1050" y="397" textAnchor="middle" fontSize="10" fill="#00d4ff">{pressureRight.toFixed(1)}</text>
                <text x="1050" y="410" textAnchor="middle" fontSize="8" fill="white">Па</text>
              </g>

              {/* ===== РЧВ1 ===== */}
              <g>
                <rect x="1050" y="30" width="100" height="60" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1100" y="55" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">РЧВ1</text>
                <text x="1100" y="75" textAnchor="middle" fontSize="11" fill="#00d4ff">{pressureRCHV1.toFixed(1)} Па</text>
              </g>

              {/* ===== РЧВ2 ===== */}
              <g>
                <rect x="1050" y="120" width="100" height="60" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1100" y="145" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">РЧВ2</text>
                <text x="1100" y="165" textAnchor="middle" fontSize="11" fill="#00d4ff">{pressureRCHV2.toFixed(1)} Па</text>
              </g>

              {/* ===== РПВ ===== */}
              <g>
                <rect x="1050" y="320" width="100" height="60" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1100" y="345" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">РПВ</text>
                <g>
                  <circle cx="1075" cy="360" r="5" fill={pump1Running ? '#00ff00' : '#ff0000'} className="animate-pulse"/>
                  <circle cx="1095" cy="360" r="5" fill={pump2Running ? '#00ff00' : '#ff0000'} className="animate-pulse"/>
                  <circle cx="1115" cy="360" r="5" fill={pumpMainRunning ? '#00ff00' : '#ff0000'} className="animate-pulse"/>
                </g>
                <text x="1100" y="378" textAnchor="middle" fontSize="9" fill="white">ВУ СУ НУ</text>
              </g>

              {/* ===== СЕПТИК ===== */}
              <g>
                <rect x="880" y="450" width="140" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
                <text x="950" y="475" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">Септик</text>
              </g>
            </svg>
          </div>

          {/* Нижняя панель управления */}
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Насосы</h3>
              <div className="space-y-1">
                <button onClick={() => togglePump(1)} className={`w-full py-1 rounded text-xs ${pump1Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                  Н1: {pump1Running ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <button onClick={() => togglePump(2)} className={`w-full py-1 rounded text-xs ${pump2Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                  Н2: {pump2Running ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <button onClick={() => togglePump(3)} className={`w-full py-1 rounded text-xs ${pumpMainRunning ? 'bg-green-500' : 'bg-gray-600'} text-white`}>
                  Н3 (главный): {pumpMainRunning ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Давление</h3>
              <div className="space-y-1 text-cyan-400 text-xs">
                <div>Главная: {pressureMain.toFixed(2)} Па</div>
                <div>Правая: {pressureRight.toFixed(2)} Па</div>
                <div>РЧВ1: {pressureRCHV1.toFixed(2)} Па</div>
                <div>РЧВ2: {pressureRCHV2.toFixed(2)} Па</div>
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Бак-реактор</h3>
              <div className="text-lg font-bold text-cyan-400">{reactorLevel.toFixed(0)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-2.5 mt-1">
                <div className="bg-cyan-500 h-2.5 rounded-full transition-all" style={{ width: `${reactorLevel}%` }}/>
              </div>
              <div className="text-[10px] text-gray-400 mt-1">Клик по баку = случайный уровень</div>
            </div>
          </div>
        </>
      )}

      {activeScreen === 'settings' && (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-lg font-bold mb-3">Настройки системы</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Порог давления (Па):</label>
              <input type="range" min="0" max="5" step="0.1" defaultValue="2.5" className="w-full"/>
            </div>
            <div>
              <label className="block text-xs mb-1">Уровень реактора (%):</label>
              <input type="range" min="0" max="100" defaultValue="80" className="w-full"/>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" defaultChecked/> Автоматический режим
              </label>
            </div>
          </div>
        </div>
      )}

      {activeScreen === 'archive' && (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-lg font-bold mb-3">Архив данных</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-1">Время</th>
                <th className="text-left py-1">Давление</th>
                <th className="text-left py-1">РЧВ1</th>
                <th className="text-left py-1">Уровень</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-1">{new Date().toLocaleTimeString()}</td>
                  <td className="py-1">{(Math.random() * 2).toFixed(2)} Па</td>
                  <td className="py-1">{(Math.random() * 1.5).toFixed(2)} Па</td>
                  <td className="py-1">{Math.floor(Math.random() * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}