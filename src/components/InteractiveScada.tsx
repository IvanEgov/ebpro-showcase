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

              {/* В начало SVG, перед всеми элементами, добавьте блок с градиентами */}
<defs>
  {/* Градиент для металлических баков (вертикальный) */}
  <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#808080"/>
    <stop offset="20%" stopColor="#d0d0d0"/>
    <stop offset="50%" stopColor="#f0f0f0"/>
    <stop offset="80%" stopColor="#d0d0d0"/>
    <stop offset="100%" stopColor="#808080"/>
  </linearGradient>
  
  {/* Градиент для жидкости (голубой) */}
  <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8"/>
    <stop offset="100%" stopColor="#0088aa" stopOpacity="0.9"/>
  </linearGradient>
  
  {/* Градиент для фильтров */}
  <linearGradient id="filterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
    <stop offset="0%" stopColor="#909090"/>
    <stop offset="30%" stopColor="#e0e0e0"/>
    <stop offset="70%" stopColor="#e0e0e0"/>
    <stop offset="100%" stopColor="#909090"/>
  </linearGradient>
  
  {/* Радиальный градиент для крышек */}
  <radialGradient id="capGradient">
    <stop offset="0%" stopColor="#f0f0f0"/>
    <stop offset="100%" stopColor="#a0a0a0"/>
  </radialGradient>
  
  {/* Градиент для септика */}
  <linearGradient id="septicGradient" x1="0%" y1="0%" x2="0%" y2="100%">
    <stop offset="0%" stopColor="#505050"/>
    <stop offset="100%" stopColor="#303030"/>
  </linearGradient>
</defs>

{/* ===== БАК-РЕАКТОР (с темными названиями) ===== */}
<g onClick={() => setReactorLevel(Math.random() * 100)} className="cursor-pointer">
  {/* Ножки бака */}
  <rect x="100" y="320" width="15" height="30" fill="#606060" stroke="#404040" strokeWidth="1"/>
  <rect x="245" y="320" width="15" height="30" fill="#606060" stroke="#404040" strokeWidth="1"/>
  
  {/* Основной корпус */}
  <rect x="80" y="200" width="200" height="120" rx="10" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
  
  {/* Верхний и нижний фланцы */}
  <ellipse cx="180" cy="200" rx="100" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  <ellipse cx="180" cy="320" rx="100" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  
  {/* Жидкость внутри */}
  <rect x="90" y={320 - reactorLevel * 1.2} width="180" height={reactorLevel * 1.2} rx="5" fill="url(#liquidGradient)"/>
  
  {/* Блики на корпусе */}
  <rect x="100" y="210" width="8" height="100" rx="4" fill="#fff" opacity="0.3"/>
  <rect x="252" y="210" width="8" height="100" rx="4" fill="#000" opacity="0.2"/>
  
  {/* Крышки сверху */}
  <ellipse cx="120" cy="200" rx="18" ry="6" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
  <ellipse cx="240" cy="200" rx="18" ry="6" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
  
  {/* Текст - темный */}
  <text x="180" y="245" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>ВУ</text>
  <text x="180" y="275" textAnchor="middle" fontSize="16" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>Бак-реактор</text>
  <text x="180" y="305" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>НУ</text>
  
  {/* Индикаторы */}
  <circle cx="260" cy="235" r="12" fill={reactorLevel > 80 ? '#ff0000' : '#00ff00'} stroke="#fff" strokeWidth="2" className="animate-pulse" style={{ filter: `drop-shadow(0 0 4px ${reactorLevel > 80 ? '#ff0000' : '#00ff00'})` }}/>
  <circle cx="260" cy="285" r="12" fill={reactorLevel < 20 ? '#ff0000' : '#00ff00'} stroke="#fff" strokeWidth="2" className="animate-pulse" style={{ filter: `drop-shadow(0 0 4px ${reactorLevel < 20 ? '#ff0000' : '#ff0000'})` }}/>
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

              {/* ===== МАНОМЕТР на главной трубе (увеличен) ===== */}
<g>
  {/* Корпус манометра */}
  <circle cx="400" cy="60" r="30" fill="#303030" stroke="#606060" strokeWidth="3"/>
  <circle cx="400" cy="60" r="24" fill="#151515" stroke="#404040" strokeWidth="2"/>
  
  {/* Циферблат */}
  <circle cx="400" cy="60" r="20" fill="#0a0a0a"/>
  
  {/* Деления шкалы */}
  <line x1="400" y1="42" x2="400" y2="46" stroke="#fff" strokeWidth="1.5"/>
  <line x1="418" y1="60" x2="414" y2="60" stroke="#fff" strokeWidth="1.5"/>
  <line x1="400" y1="78" x2="400" y2="74" stroke="#fff" strokeWidth="1.5"/>
  <line x1="382" y1="60" x2="386" y2="60" stroke="#fff" strokeWidth="1.5"/>
  
  {/* Стрелка */}
  <line 
    x1="400" 
    y1="60" 
    x2={400 + Math.cos((pressureMain / 2.5) * Math.PI - Math.PI/2) * 15} 
    y2={60 + Math.sin((pressureMain / 2.5) * Math.PI - Math.PI/2) * 15} 
    stroke="#ff4444" 
    strokeWidth="2"
    strokeLinecap="round"
  />
  
  {/* Центральная точка */}
  <circle cx="400" cy="60" r="3" fill="#c0c0c0"/>
  
  {/* Значение давления */}
  <text x="400" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
  <text x="400" y="72" textAnchor="middle" fontSize="9" fill="#fff">Па</text>
</g>

              {/* ===== 4 ФИЛЬТРА (объёмные) ===== */}
{[0, 1, 2, 3].map((i) => {
  const x = 470 + i * 150;
  return (
    <g key={i} onClick={() => toggleFilter(i)} className="cursor-pointer">
      {/* Ножки фильтра */}
      <rect x={x + 10} y="350" width="8" height="20" fill="#606060" stroke="#404040" strokeWidth="1"/>
      <rect x={x + 42} y="350" width="8" height="20" fill="#606060" stroke="#404040" strokeWidth="1"/>
      
      {/* Основной корпус */}
      <rect x={x} y="200" width="60" height="150" rx="8" fill="url(#filterGradient)" stroke="#707070" strokeWidth="2"/>
      
      {/* Верхний фланец (крышка) */}
      <ellipse cx={x + 30} cy="200" rx="30" ry="10" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
      
      {/* Нижний фланец */}
      <ellipse cx={x + 30} cy="350" rx="30" ry="10" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
      
      {/* Блики на корпусе */}
      <rect x={x + 8} y="210" width="4" height="130" rx="2" fill="#fff" opacity="0.4"/>
      <rect x={x + 48} y="210" width="4" height="130" rx="2" fill="#000" opacity="0.2"/>
      
      {/* Индикатор состояния (плашка) */}
      <rect x={x + 5} y="260" width="50" height="25" rx="4" fill={filterStatus[i] ? '#2d5016' : '#8b0000'} stroke="#fff" strokeWidth="1"/>
      <text x={x + 30} y="277" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white" style={{ textShadow: '1px 1px 1px rgba(0,0,0,0.8)' }}>
        {filterStatus[i] ? 'Работа' : 'Авария'}
      </text>
      
      {/* Лампочка индикатора */}
      <circle cx={x + 30} cy="230" r="8" fill={filterStatus[i] ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="2" className="animate-pulse" style={{ filter: `drop-shadow(0 0 6px ${filterStatus[i] ? '#00ff00' : '#ff0000'})` }}/>
      
      {/* Манометр на фильтре - увеличен и поднят */}
<circle cx={x + 30} cy="195" r="12" fill="#202020" stroke="#606060" strokeWidth="2"/>
<circle cx={x + 30} cy="195" r="9" fill="#101010" stroke="#404040" strokeWidth="1"/>
<text x={x + 30} y="199" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#00d4ff">P</text>
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

{/* ===== РЧВ1 (с темным названием и крупным давлением) ===== */}
<g>
  {/* Ножки */}
  <rect x="1060" y="90" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  <rect x="1128" y="90" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  
  {/* Корпус */}
  <rect x="1050" y="30" width="100" height="60" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
  <ellipse cx="1100" cy="30" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  <ellipse cx="1100" cy="90" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  
  {/* Блики */}
  <rect x="1060" y="40" width="6" height="40" rx="3" fill="#fff" opacity="0.4"/>
  <rect x="1134" y="40" width="6" height="40" rx="3" fill="#000" opacity="0.2"/>
  
  {/* Текст РЧВ1 - темный */}
  <text x="1100" y="58" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>РЧВ1</text>
  {/* Давление - крупнее и темнее */}
  <text x="1100" y="78" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>{pressureRCHV1.toFixed(1)} Па</text>
</g>

{/* ===== РЧВ2 (с темным названием и крупным давлением) ===== */}
<g>
  <rect x="1060" y="180" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  <rect x="1128" y="180" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  
  <rect x="1050" y="120" width="100" height="60" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
  <ellipse cx="1100" cy="120" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  <ellipse cx="1100" cy="180" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  
  <rect x="1060" y="130" width="6" height="40" rx="3" fill="#fff" opacity="0.4"/>
  <rect x="1134" y="130" width="6" height="40" rx="3" fill="#000" opacity="0.2"/>
  
  {/* Текст РЧВ2 - темный */}
  <text x="1100" y="148" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>РЧВ2</text>
  {/* Давление - крупнее и темнее */}
  <text x="1100" y="168" textAnchor="middle" fontSize="15" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>{pressureRCHV2.toFixed(1)} Па</text>
</g>

{/* ===== РПВ (поднят на 20px выше) ===== */}
<g>
  {/* Ножки */}
  <rect x="1060" y="360" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  <rect x="1128" y="360" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
  
  {/* Корпус */}
  <rect x="1050" y="300" width="100" height="60" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
  <ellipse cx="1100" cy="300" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  <ellipse cx="1100" cy="360" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
  
  {/* Блики */}
  <rect x="1060" y="310" width="6" height="40" rx="3" fill="#fff" opacity="0.4"/>
  <rect x="1134" y="310" width="6" height="40" rx="3" fill="#000" opacity="0.2"/>
  
  {/* Текст РПВ - темный */}
  <text x="1100" y="328" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>РПВ</text>
  
  {/* Индикаторы насосов */}
  <g>
    <circle cx="1075" cy="345" r="6" fill={pump1Running ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse" style={{ filter: `drop-shadow(0 0 4px ${pump1Running ? '#00ff00' : '#ff0000'})` }}/>
    <circle cx="1095" cy="345" r="6" fill={pump2Running ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse" style={{ filter: `drop-shadow(0 0 4px ${pump2Running ? '#00ff00' : '#ff0000'})` }}/>
    <circle cx="1115" cy="345" r="6" fill={pumpMainRunning ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse" style={{ filter: `drop-shadow(0 0 4px ${pumpMainRunning ? '#00ff00' : '#ff0000'})` }}/>
  </g>
  
  <text x="1100" y="358" textAnchor="middle" fontSize="9" fill="#0a0a0a" style={{ textShadow: '1px 1px 1px rgba(255,255,255,0.5)' }}>ВУ СУ НУ</text>
</g>
  

{/* ===== СЕПТИК (объёмный) ===== */}
<g>
  {/* Ножки */}
  <rect x="900" y="490" width="15" height="20" fill="#404040" stroke="#303030" strokeWidth="1"/>
  <rect x="985" y="490" width="15" height="20" fill="#404040" stroke="#303030" strokeWidth="1"/>
  
  {/* Корпус */}
  <rect x="880" y="450" width="140" height="40" rx="6" fill="url(#septicGradient)" stroke="#505050" strokeWidth="2"/>
  
  {/* Верхняя крышка */}
  <ellipse cx="950" cy="450" rx="70" ry="6" fill="#606060" stroke="#404040" strokeWidth="2"/>
  
  {/* Блики */}
  <rect x="890" y="455" width="8" height="30" rx="4" fill="#fff" opacity="0.2"/>
  <rect x="1002" y="455" width="8" height="30" rx="4" fill="#000" opacity="0.3"/>
  
  {/* Текст */}
  <text x="950" y="478" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.8)' }}>Септик</text>
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