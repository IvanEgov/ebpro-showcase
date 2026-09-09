"use client";
import { useState, useEffect, useCallback } from 'react';

export default function InteractiveScadaKotel() {
  const [activeScreen, setActiveScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
  const [activeMode, setActiveMode] = useState<'manual' | 'cascade'>('manual');
  
  const [pump1Running, setPump1Running] = useState(false);
  const [pump2Running, setPump2Running] = useState(false);
  const [pump3Running, setPump3Running] = useState(false);
  const [pumpGas1Running, setPumpGas1Running] = useState(false);
  const [pumpGas2Running, setPumpGas2Running] = useState(false);
  const [pumpVentRunning, setPumpVentRunning] = useState(false);
  const [pumpHeatRunning, setPumpHeatRunning] = useState(false);
  const [pumpVTZRunning, setPumpVTZRunning] = useState(false);
  const [pumpGVSRunning, setPumpGVSRunning] = useState(false);
  
  const [valve1Open, setValve1Open] = useState(false);
  const [valve2Open, setValve2Open] = useState(false);
  const [valve3Open, setValve3Open] = useState(false);
  
  const [dieselLevel, setDieselLevel] = useState(75);
  const [rchvLevel, setRchvLevel] = useState(60);
  const [outdoorTemp, setOutdoorTemp] = useState(0.0);
  const [supplyTemp, setSupplyTemp] = useState(6.0);
  const [pressureMain, setPressureMain] = useState(0.0);
  const [rchvVolume, setRchvVolume] = useState(0);
  const [season, setSeason] = useState<'summer' | 'winter'>('summer');
  const [cascadeMode, setCascadeMode] = useState(true);

  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    const updateDateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    };
    updateDateTime();
    const interval = setInterval(updateDateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (activeMode === 'cascade') {
      setPump1Running(false); setPump2Running(false); setPump3Running(false);
      setPumpGas1Running(false); setPumpGas2Running(false);
      setPumpGas1Running(true);
      setPumpGas2Running(true);
      const timer1 = setTimeout(() => {
        setPump1Running(true);
        const timer2 = setTimeout(() => {
          setPump2Running(true);
          const timer3 = setTimeout(() => {
            setPump3Running(true);
          }, 30000);
          return () => clearTimeout(timer3);
        }, 30000);
        return () => clearTimeout(timer2);
      }, 0);
      return () => clearTimeout(timer1);
    } else {
      setPump1Running(false); setPump2Running(false); setPump3Running(false);
      setPumpGas1Running(false); setPumpGas2Running(false);
    }
  }, [activeMode]);

  useEffect(() => { setValve1Open(pump1Running); }, [pump1Running]);
  useEffect(() => { setValve2Open(pump2Running); }, [pump2Running]);
  useEffect(() => { setValve3Open(pump3Running); }, [pump3Running]);

  useEffect(() => {
    const isAnyPumpRunning = pump1Running || pump2Running || pump3Running;
    if ((activeMode === 'manual' || activeMode === 'cascade') && isAnyPumpRunning) {
      const interval = setInterval(() => {
        setPressureMain(prev => Math.min(2.5, prev + 0.1));
        setRchvLevel(prev => Math.min(95, prev + 1));
        setRchvVolume(prev => Math.min(100, prev + 0.5));
        setSupplyTemp(prev => Math.min(85, prev + 1.5));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setPressureMain(0); setSupplyTemp(6);
    }
  }, [activeMode, pump1Running, pump2Running, pump3Running]);

  const togglePump = useCallback((pump: string) => {
    if (activeMode === 'cascade') return;
    if (pump === '1') setPump1Running(!pump1Running);
    if (pump === '2') setPump2Running(!pump2Running);
    if (pump === '3') setPump3Running(!pump3Running);
    if (pump === 'g1') setPumpGas1Running(!pumpGas1Running);
    if (pump === 'g2') setPumpGas2Running(!pumpGas2Running);
    if (pump === '6') setPumpVentRunning(!pumpVentRunning);
    if (pump === '7') setPumpHeatRunning(!pumpHeatRunning);
    if (pump === '8') setPumpVTZRunning(!pumpVTZRunning);
    if (pump === '9') setPumpGVSRunning(!pumpGVSRunning);
  }, [activeMode, pump1Running, pump2Running, pump3Running, pumpGas1Running, pumpGas2Running, 
      pumpVentRunning, pumpHeatRunning, pumpVTZRunning, pumpGVSRunning]);

  const toggleValve = useCallback((valve: number) => {
    if (activeMode === 'cascade') return;
    if (valve === 1) setValve1Open(!valve1Open);
    if (valve === 2) setValve2Open(!valve2Open);
    if (valve === 3) setValve3Open(!valve3Open);
  }, [activeMode, valve1Open, valve2Open, valve3Open]);

  return (
    <div className="w-full bg-[#0a2540] p-2 rounded-lg font-sans">
      <div className="flex items-start justify-center gap-2 mb-1">
        <div className="bg-gray-600 rounded p-1.5 min-w-[140px]">
          <div className="text-white text-xs text-center mb-0.5 font-bold">Режим</div>
          <button onClick={() => setActiveMode('manual')}
            className={`w-full py-0.5 rounded text-xs font-bold mb-0.5 transition-all ${activeMode === 'manual' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            Ручной
          </button>
          <button onClick={() => setActiveMode('cascade')}
            className={`w-full py-0.5 rounded text-xs font-bold transition-all ${activeMode === 'cascade' ? 'bg-green-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
            Каскадный
          </button>
        </div>
        <div className="bg-gray-600 rounded p-1.5 flex-1 max-w-[400px]">
          <div className="text-white text-xs text-center mb-0.5 font-bold">Экраны</div>
          <div className="flex gap-1 justify-center">
            {(['mode', 'settings', 'archive'] as const).map((screen) => (
              <button key={screen} onClick={() => setActiveScreen(screen)}
                className={`px-2 py-0.5 rounded text-xs font-bold flex-1 transition-all ${activeScreen === screen ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'}`}>
                {screen === 'mode' ? 'Схема' : screen === 'settings' ? 'Настройка' : 'Архив'}
              </button>
            ))}
          </div>
        </div>
      </div>

      {activeScreen === 'mode' && (
        <>
          <div className="flex justify-between items-center mb-1 bg-gray-800/50 p-1 rounded">
            <div className="flex items-center gap-4">
              <div className="text-cyan-400 text-sm font-bold">{outdoorTemp.toFixed(1)} °C</div>
              <div className="text-white text-sm">Температура наружного воздуха</div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-white text-xs">{season === 'summer' ? 'Лето' : 'Зима'}</span>
              {activeMode === 'cascade' && (
                <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">
                  Каскад активен
                </span>
              )}
            </div>
          </div>

          <div className="relative w-full mb-1" style={{ height: '650px' }}>
            <svg viewBox="-100 -60 1100 620" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#808080" /><stop offset="20%" stopColor="#d0d0d0" />
                  <stop offset="50%" stopColor="#f0f0f0" /><stop offset="80%" stopColor="#d0d0d0" />
                  <stop offset="100%" stopColor="#808080" />
                </linearGradient>
                <linearGradient id="dieselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#8B4513" stopOpacity="0.9" /><stop offset="100%" stopColor="#654321" stopOpacity="0.95" />
                </linearGradient>
                <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" /><stop offset="100%" stopColor="#0088aa" stopOpacity="0.9" />
                </linearGradient>
                <radialGradient id="capGradient">
                  <stop offset="0%" stopColor="#f0f0f0" /><stop offset="100%" stopColor="#a0a0a0" />
                </radialGradient>
                <linearGradient id="pumpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#606060" /><stop offset="50%" stopColor="#909090" /><stop offset="100%" stopColor="#404040" />
                </linearGradient>
                <linearGradient id="gasPumpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#f0e68c" /><stop offset="50%" stopColor="#ffd700" /><stop offset="100%" stopColor="#daa520" />
                </linearGradient>
                <linearGradient id="boilerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#505050" />
                  <stop offset="30%" stopColor="#a0a0a0" />
                  <stop offset="50%" stopColor="#d0d0d0" />
                  <stop offset="70%" stopColor="#a0a0a0" />
                  <stop offset="100%" stopColor="#505050" />
                </linearGradient>
                <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
                  <stop offset="0%" stopColor="#ff4400" />
                  <stop offset="50%" stopColor="#ffaa00" />
                  <stop offset="100%" stopColor="#ffff00" />
                </linearGradient>
              </defs>

              {/* ===== СЛОЙ 1: ОБОРУДОВАНИЕ (кроме резервуаров) ===== */}
              
              {/* Котлы */}
              {[
                { x: 60, y: -40, running: pump1Running, label: 'Котел 1', onClick: () => togglePump('1') },
                { x: 60, y: 150, running: pump2Running, label: 'Котел 2', onClick: () => togglePump('2') },
                { x: 60, y: 340, running: pump3Running, label: 'Котел 3', onClick: () => togglePump('3') }
              ].map((boiler, i) => (
                <g key={i} onClick={boiler.onClick} className={`cursor-pointer ${activeMode === 'cascade' ? 'opacity-70' : ''}`}>
                  <rect x={boiler.x + 15} y={boiler.y + 90} width="10" height="15" fill="#404040" stroke="#303030" strokeWidth="1"/>
                  <rect x={boiler.x + 75} y={boiler.y + 90} width="10" height="15" fill="#404040" stroke="#303030" strokeWidth="1"/>
                  <rect x={boiler.x} y={boiler.y} width="100" height="90" rx="8" fill="url(#boilerGradient)" stroke="#404040" strokeWidth="2"/>
                  <ellipse cx={boiler.x + 50} cy={boiler.y} rx="50" ry="8" fill="url(#capGradient)" stroke="#606060" strokeWidth="2"/>
                  <ellipse cx={boiler.x + 50} cy={boiler.y + 90} rx="50" ry="8" fill="url(#capGradient)" stroke="#606060" strokeWidth="2"/>
                  <rect x={boiler.x + 10} y={boiler.y + 10} width="6" height="70" rx="3" fill="#fff" opacity="0.4"/>
                  <rect x={boiler.x + 84} y={boiler.y + 10} width="6" height="70" rx="3" fill="#000" opacity="0.2"/>
                  <rect x={boiler.x + 30} y={boiler.y + 30} width="40" height="30" rx="4" fill="#1a1a1a" stroke="#606060" strokeWidth="2"/>
                  {boiler.running && (
                    <>
                      <path d={`M ${boiler.x + 40} ${boiler.y + 55} Q ${boiler.x + 45} ${boiler.y + 40} ${boiler.x + 50} ${boiler.y + 55} Q ${boiler.x + 55} ${boiler.y + 40} ${boiler.x + 60} ${boiler.y + 55}`} 
                            fill="url(#flameGradient)" className="animate-pulse"/>
                      <circle cx={boiler.x + 50} cy={boiler.y + 50} r="4" fill="#ffff00" className="animate-ping" opacity="0.6"/>
                    </>
                  )}
                  <rect x={boiler.x + 35} y={boiler.y + 90} width="30" height="10" rx="2" fill="#404040" stroke="#303030" strokeWidth="1"/>
                  {boiler.running && (
                    <path d={`M ${boiler.x + 45} ${boiler.y + 100} L ${boiler.x + 50} ${boiler.y + 110} L ${boiler.x + 55} ${boiler.y + 100}`} 
                          fill="#ff6600" className="animate-pulse"/>
                  )}
                  <rect x={boiler.x + 40} y={boiler.y - 15} width="20" height="15" fill="#808080" stroke="#606060" strokeWidth="1"/>
                  <rect x={boiler.x + 40} y={boiler.y + 100} width="20" height="10" fill="#808080" stroke="#606060" strokeWidth="1"/>
                  <circle cx={boiler.x + 85} cy={boiler.y + 15} r="6" fill={boiler.running ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse"/>
                  <text x={boiler.x + 50} y={boiler.y + 130} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white" style={{textShadow: '2px 2px 4px rgba(0,0,0,0.8)'}}>
                    {boiler.label}
                  </text>
                  <text x={boiler.x + 50} y={boiler.y + 145} textAnchor="middle" fontSize="10" fill="#00d4ff">
                    {boiler.running ? 'РАБОТА' : 'ОСТАНОВ'}
                  </text>
                </g>
              ))}

              {/* Теплообменники */}
              {[
                { y: 0, label: 'Вентиляция' },
                { y: 100, label: 'Отопление' },
                { y: 200, label: 'ВТЗ' },
                { y: 300, label: 'ГВС' }
              ].map((hex, i) => (
                <g key={i}>
                  <rect x="480" y={hex.y-20} width="120" height="40" rx="4" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                  {[500, 520, 540, 560, 580].map((lx, idx) => (
                    <line key={idx} x1={lx} y1={hex.y-15} x2={lx} y2={hex.y+15} stroke="#808080" strokeWidth="2"/>
                  ))}
                  <text x="540" y={hex.y+6} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a" style={{textShadow: '1px 1px 1px rgba(255,255,255,0.5)'}}>{hex.label}</text>
                </g>
              ))}

              {/* Насосы контуров */}
              {[
                { y: 0, label: 'Вент', running: pumpVentRunning, onClick: () => togglePump('6') },
                { y: 100, label: 'Отопл', running: pumpHeatRunning, onClick: () => togglePump('7') },
                { y: 200, label: 'ВТЗ', running: pumpVTZRunning, onClick: () => togglePump('8') },
                { y: 300, label: 'ГВС', running: pumpGVSRunning, onClick: () => togglePump('9') }
              ].map((circuit, i) => (
                <g key={i} onClick={circuit.onClick} className={`cursor-pointer ${activeMode === 'cascade' ? 'opacity-50' : ''}`}>
                  <rect x="630" y={circuit.y-20} width="70" height="40" rx="5" fill="url(#pumpGradient)" stroke="#404040" strokeWidth="2"/>
                  {circuit.running && (
                    <g className="animate-spin" style={{ transformOrigin: `665px ${circuit.y}px` }}>
                      <path d={`M 665 ${circuit.y-10} L 675 ${circuit.y} L 665 ${circuit.y+10} L 655 ${circuit.y} Z`} fill="#00b4d8"/>
                    </g>
                  )}
                  <circle cx="665" cy={circuit.y} r="8" fill={circuit.running ? '#00b4d8' : '#404040'}/>
                  <text x="665" y={circuit.y+35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{circuit.label}</text>
                </g>
              ))}

              {/* Газовые насосы */}
              {[
                { x: 280, y: 460, running: pumpGas1Running, label: 'ГН-1', onClick: () => togglePump('g1') },
                { x: 450, y: 460, running: pumpGas2Running, label: 'ГН-2', onClick: () => togglePump('g2') }
              ].map((pump, i) => (
                <g key={i} onClick={pump.onClick} className={`cursor-pointer ${activeMode === 'cascade' ? 'opacity-50' : ''}`}>
                  <rect x={pump.x} y={pump.y} width="100" height="60" rx="8" fill="url(#gasPumpGradient)" stroke="#cc9900" strokeWidth="2"/>
                  {pump.running && (
                    <g className="animate-spin" style={{ transformOrigin: `${pump.x+50}px ${pump.y+30}px` }}>
                      <path d={`M ${pump.x+50} ${pump.y+15} L ${pump.x+65} ${pump.y+30} L ${pump.x+50} ${pump.y+45} L ${pump.x+35} ${pump.y+30} Z`} fill="#8b4513"/>
                      <circle cx={pump.x+50} cy={pump.y+30} r="5" fill="#ffd700"/>
                    </g>
                  )}
                  <circle cx={pump.x+50} cy={pump.y+30} r="10" fill={pump.running ? '#fff' : '#daa520'} stroke="#8b4513" strokeWidth="2"/>
                  <path d={`M ${pump.x+50} ${pump.y+24} Q ${pump.x+55} ${pump.y+28} ${pump.x+50} ${pump.y+36} Q ${pump.x+45} ${pump.y+28} ${pump.x+50} ${pump.y+24}`} 
                        fill={pump.running ? '#ff4444' : '#888'} className="transition-colors duration-300"/>
                  <rect x={pump.x+110} y={pump.y+15} width="50" height="16" rx="3" fill={pump.running ? '#2d5016' : '#8b0000'} stroke="#fff" strokeWidth="1"/>
                  <text x={pump.x+135} y={pump.y+27} textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{pump.running ? 'Давл.' : 'Стоп'}</text>
                  <text x={pump.x+50} y={pump.y+80} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffd700" style={{textShadow: '0 0 4px rgba(0,0,0,0.8)'}}>{pump.label}</text>
                </g>
              ))}

              {/* ===== СЛОЙ 2: ТРУБЫ ===== */}
              
              {/* ЖЕЛТЫЕ ТРУБЫ (газ) */}
              <path d="M 380 490 L 450 490" stroke="#ffcc00" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 415 490 L 415 35" stroke="#ffcc00" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 415 35 L 160 35" stroke="#ffcc00" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 160 35 L 160 65" stroke="#ffcc00" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M 160 240 L 160 255" stroke="#ffcc00" strokeWidth="6" fill="none" strokeLinecap="round"/>
              <path d="M 160 430 L 160 445" stroke="#ffcc00" strokeWidth="6" fill="none" strokeLinecap="round"/>

              {/* КРАСНЫЕ ТРУБЫ (подача) */}
              <path d="M 100 -55 L 330 -55" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 100 135 L 330 135" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 100 325 L 330 325" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 330 -55 L 330 325" stroke="#ff4444" strokeWidth="12" fill="none" strokeLinecap="round"/>
              <path d="M 330 -55 L 330 0 L 480 0" stroke="#ff4444" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M 330 100 L 480 100" stroke="#ff4444" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 330 200 L 480 200" stroke="#ff4444" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 330 300 L 480 300" stroke="#ff4444" strokeWidth="8" fill="none" strokeLinecap="round"/>

              {/* ГОЛУБЫЕ ТРУБЫ (обратка) — заканчиваются у x=790, НЕ заходят на резервуары */}
              <path d="M 600 0 L 630 0" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 600 100 L 630 100" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 600 200 L 630 200" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 600 300 L 630 300" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 700 0 L 790 0" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 700 100 L 790 100" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 700 200 L 790 200" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              <path d="M 700 300 L 790 300" stroke="#4488ff" strokeWidth="8" fill="none" strokeLinecap="round"/>
              {/* Вертикальный коллектор обратки на x=790 */}
              <path d="M 790 0 L 790 300" stroke="#4488ff" strokeWidth="12" fill="none" strokeLinecap="round"/>
              {/* Короткие отводы к резервуарам (заканчиваются у края x=795) */}
              <path d="M 790 0 L 795 0" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
              <path d="M 790 300 L 790 250 L 795 250" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

              {/* ===== СЛОЙ 3: МАНометр ===== */}
              <g>
                <path d="M 330 135 L 330 155" stroke="#ff4444" strokeWidth="6" fill="none"/>
                <circle cx="330" cy="180" r="28" fill="#303030" stroke="#606060" strokeWidth="3"/>
                <circle cx="330" cy="180" r="22" fill="#151515" stroke="#404040" strokeWidth="2"/>
                <circle cx="330" cy="180" r="18" fill="#0a0a0a"/>
                <line x1="330" y1="164" x2="330" y2="168" stroke="#fff" strokeWidth="2"/>
                <line x1="348" y1="180" x2="344" y2="180" stroke="#fff" strokeWidth="2"/>
                <line x1="330" y1="196" x2="330" y2="192" stroke="#fff" strokeWidth="2"/>
                <line x1="312" y1="180" x2="316" y2="180" stroke="#fff" strokeWidth="2"/>
                <line x1="330" y1="180" x2={330 + Math.cos((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} 
                      y2={180 + Math.sin((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} 
                      stroke="#ff4444" strokeWidth="3" strokeLinecap="round"/>
                <circle cx="330" cy="180" r="3" fill="#c0c0c0"/>
                <text x="330" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
                <text x="330" y="190" textAnchor="middle" fontSize="10" fill="#fff">Па</text>
                <text x="330" y="220" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#00d4ff">Манометр</text>
              </g>

              {/* ===== СЛОЙ 4: ЗАДВИЖКИ ===== */}
              {[
                { x: 215, y: -55, open: valve1Open, onClick: () => toggleValve(1) },
                { x: 215, y: 135, open: valve2Open, onClick: () => toggleValve(2) },
                { x: 215, y: 325, open: valve3Open, onClick: () => toggleValve(3) }
              ].map((valve, i) => (
                <g key={i} onClick={valve.onClick} className="cursor-pointer">
                  <g className={`transition-transform duration-500 ${valve.open ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: `${valve.x}px ${valve.y}px` }}>
                    <path d={`M ${valve.x} ${valve.y-14} L ${valve.x+14} ${valve.y} L ${valve.x} ${valve.y+14} L ${valve.x-14} ${valve.y} Z`}
                          fill={valve.open ? '#00d4ff' : '#ff4444'} stroke="#fff" strokeWidth="2"/>
                    <circle cx={valve.x} cy={valve.y-22} r="8" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                  </g>
                </g>
              ))}

              {/* ===== СЛОЙ 5: РЕЗЕРВУАРЫ (в самом конце — поверх труб!) ===== */}
              
              {/* Дизель (сверху) */}
              <g onClick={() => activeMode === 'manual' && setDieselLevel(Math.random() * 100)} className={activeMode === 'manual' ? 'cursor-pointer' : ''}>
                <rect x="800" y="-50" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
                <ellipse cx="850" cy="-50" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <ellipse cx="850" cy="50" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <rect x="805" y={50 - dieselLevel} width="90" height={dieselLevel} rx="4" fill="url(#dieselGradient)"/>
                <text x="850" y="-5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a" style={{textShadow: '1px 1px 1px rgba(255,255,255,0.5)'}}>Дизель</text>
                <text x="850" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{dieselLevel.toFixed(0)}%</text>
              </g>
              
              {/* РЧВ (снизу) */}
              <g onClick={() => activeMode === 'manual' && setRchvLevel(Math.random() * 100)} className={activeMode === 'manual' ? 'cursor-pointer' : ''}>
                <rect x="800" y="200" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
                <ellipse cx="850" cy="200" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <ellipse cx="850" cy="300" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <rect x="805" y={300 - rchvLevel} width="90" height={rchvLevel} rx="4" fill="url(#waterGradient)"/>
                <text x="850" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a" style={{textShadow: '1px 1px 1px rgba(255,255,255,0.5)'}}>РЧВ</text>
                <text x="850" y="270" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{rchvLevel.toFixed(0)}%</text>
              </g>
            </svg>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Котлы</h3>
              <div className="space-y-1">
                {['1', '2', '3'].map((p) => {
                  const isRunning = p === '1' ? pump1Running : p === '2' ? pump2Running : pump3Running;
                  return (
                    <button key={p} onClick={() => togglePump(p)} disabled={activeMode === 'cascade'}
                      className={`w-full py-1 rounded text-xs ${isRunning ? 'bg-green-500' : 'bg-gray-600'} text-white ${activeMode === 'cascade' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      Котел {p}: {isRunning ? 'ВКЛ' : 'ВЫКЛ'}
                    </button>
                  );
                })}
              </div>
            </div>
            
            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Газовые насосы</h3>
              <div className="space-y-1">
                {['g1', 'g2'].map((p) => {
                  const isRunning = p === 'g1' ? pumpGas1Running : pumpGas2Running;
                  return (
                    <button key={p} onClick={() => togglePump(p)} disabled={activeMode === 'cascade'}
                      className={`w-full py-1 rounded text-xs ${isRunning ? 'bg-yellow-600' : 'bg-gray-600'} text-white ${activeMode === 'cascade' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      ГН-{p === 'g1' ? '1' : '2'}: {isRunning ? 'ВКЛ' : 'ВЫКЛ'}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="bg-gray-800/80 p-2 rounded">
              <h3 className="text-white text-xs font-bold mb-1">Контурные насосы</h3>
              <div className="space-y-1">
                {[
                  { id: '6', label: 'Вент', running: pumpVentRunning },
                  { id: '7', label: 'Отопл', running: pumpHeatRunning },
                  { id: '8', label: 'ВТЗ', running: pumpVTZRunning },
                  { id: '9', label: 'ГВС', running: pumpGVSRunning }
                ].map((item) => (
                  <button key={item.id} onClick={() => togglePump(item.id)} disabled={activeMode === 'cascade'}
                    className={`w-full py-1 rounded text-xs ${item.running ? 'bg-green-500' : 'bg-gray-600'} text-white ${activeMode === 'cascade' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    {item.label}: {item.running ? 'ВКЛ' : 'ВЫКЛ'}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex justify-between items-center mt-1 bg-gray-800/50 p-1.5 rounded text-xs">
            <div className="flex items-center gap-4">
              <div className="text-cyan-400"><span className="text-gray-400">Уставка:</span> {supplyTemp.toFixed(2)}</div>
              <div className="text-cyan-400"><span className="text-gray-400">Время:</span> {currentTime}</div>
              <div className="text-cyan-400"><span className="text-gray-400">Дата:</span> {currentDate}</div>
            </div>
            <div className="text-gray-400 text-[10px]">ООО «ЮЛИТ» ИНН 7017466811 | Томск, Иркутский тракт дом 17, офис 264</div>
          </div>
        </>
      )}

      {activeScreen === 'settings' && (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-lg font-bold mb-3">Настройки котельной</h2>
          <div className="space-y-3">
            <div>
              <label className="block text-xs mb-1">Уставка температуры подачи (°C):</label>
              <input type="range" min="40" max="95" step="1" defaultValue="80" className="w-full"/>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={cascadeMode} onChange={(e) => setCascadeMode(e.target.checked)}/> Каскадный режим
              </label>
            </div>
            <div>
              <label className="flex items-center gap-2 text-xs">
                <input type="checkbox" checked={season === 'winter'} onChange={(e) => setSeason(e.target.checked ? 'winter' : 'summer')}/> Зимний режим
              </label>
            </div>
          </div>
        </div>
      )}

      {activeScreen === 'archive' && (
        <div className="bg-gray-800 p-4 rounded-lg text-white">
          <h2 className="text-lg font-bold mb-3">Архив данных котельной</h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-1">Время</th>
                <th className="text-left py-1">Давление</th>
                <th className="text-left py-1">Темп. подачи</th>
                <th className="text-left py-1">РЧВ уровень</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-1">{currentTime || '--:--:--'}</td>
                  <td className="py-1">{(Math.random() * 2).toFixed(2)} Па</td>
                  <td className="py-1">{(60 + Math.random() * 20).toFixed(1)} °C</td>
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