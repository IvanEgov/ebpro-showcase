"use client";
import { useState, useEffect } from 'react';

export default function InteractiveScadaKotel() {
  const [pump1Running, setPump1Running] = useState(true);
  const [pump2Running, setPump2Running] = useState(false);
  const [pump3Running, setPump3Running] = useState(false);
  const [pumpGas1Running, setPumpGas1Running] = useState(true);
  const [pumpGas2Running, setPumpGas2Running] = useState(false);
  const [pumpVentRunning, setPumpVentRunning] = useState(true);
  const [pumpHeatRunning, setPumpHeatRunning] = useState(true);
  const [pumpVTZRunning, setPumpVTZRunning] = useState(false);
  const [pumpGVSRunning, setPumpGVSRunning] = useState(false);
  const [valve1Open, setValve1Open] = useState(true);
  const [valve2Open, setValve2Open] = useState(false);
  const [valve3Open, setValve3Open] = useState(false);
  const [dieselLevel, setDieselLevel] = useState(75);
  const [rchvLevel, setRchvLevel] = useState(60);
  const [supplyTemp, setSupplyTemp] = useState(65.0);
  const [pressureMain, setPressureMain] = useState(1.5);
  const [currentTime, setCurrentTime] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [cycleSeconds, setCycleSeconds] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
      setCurrentDate(now.toLocaleDateString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCycleSeconds(prev => {
        const next = (prev + 1) % 960;
        setPump1Running(true);
        setValve1Open(true);
        setPumpGas1Running(true);
        if (next >= 60) {
          setPump2Running(true);
          setValve2Open(true);
          setPumpGas2Running(true);
        } else {
          setPump2Running(false);
          setValve2Open(false);
          setPumpGas2Running(false);
        }
        if (next >= 360 && next < 660) {
          setPump3Running(true);
          setValve3Open(true);
        } else {
          setPump3Running(false);
          setValve3Open(false);
        }
        return next;
      });
      if (Math.random() > 0.98) setPumpVentRunning(prev => !prev);
      if (Math.random() > 0.98) setPumpHeatRunning(prev => !prev);
      if (Math.random() > 0.97) setPumpVTZRunning(prev => !prev);
      if (Math.random() > 0.97) setPumpGVSRunning(prev => !prev);
      setPressureMain(prev => {
        const active = [pump1Running, pump2Running, pump3Running].filter(Boolean).length;
        const target = 0.5 + active * 0.6;
        return prev + (target - prev) * 0.05 + (Math.random() - 0.5) * 0.05;
      });
      setSupplyTemp(prev => {
        const active = [pump1Running, pump2Running, pump3Running].filter(Boolean).length;
        const target = 40 + active * 12;
        return prev + (target - prev) * 0.03 + (Math.random() - 0.5) * 0.5;
      });
      setDieselLevel(prev => Math.max(10, Math.min(95, prev + (Math.random() - 0.5) * 0.3)));
      setRchvLevel(prev => Math.max(20, Math.min(90, prev + (Math.random() - 0.5) * 0.5)));
    }, 1000);
    return () => clearInterval(interval);
  }, [pump1Running, pump2Running, pump3Running]);

  const formatCycleTime = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="w-full bg-[#0a2540] p-2 rounded-lg font-sans">
      <div className="flex justify-between items-center mb-1 bg-gray-800/50 p-1 rounded">
        <div className="flex items-center gap-4">
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">Автоматический режим</span>
          <span className="text-gray-400 text-xs">Цикл: {formatCycleTime(cycleSeconds)} / 16:00</span>
        </div>
        <div className="text-white text-xs font-mono">{currentTime} {currentDate}</div>
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
            <radialGradient id="capGradient"><stop offset="0%" stopColor="#f0f0f0" /><stop offset="100%" stopColor="#a0a0a0" /></radialGradient>
            <linearGradient id="pumpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#606060" /><stop offset="50%" stopColor="#909090" /><stop offset="100%" stopColor="#404040" />
            </linearGradient>
            <linearGradient id="gasPumpGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f0e68c" /><stop offset="50%" stopColor="#ffd700" /><stop offset="100%" stopColor="#daa520" />
            </linearGradient>
            <linearGradient id="boilerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#505050" /><stop offset="30%" stopColor="#a0a0a0" />
              <stop offset="50%" stopColor="#d0d0d0" /><stop offset="70%" stopColor="#a0a0a0" /><stop offset="100%" stopColor="#505050" />
            </linearGradient>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ff4400" /><stop offset="50%" stopColor="#ffaa00" /><stop offset="100%" stopColor="#ffff00" />
            </linearGradient>
          </defs>

          {/* ===== СЛОЙ 1: КОТЛЫ ===== */}
          {[
            { x: 60, y: -40, running: pump1Running, label: 'Котел 1' },
            { x: 60, y: 150, running: pump2Running, label: 'Котел 2' },
            { x: 60, y: 340, running: pump3Running, label: 'Котел 3' }
          ].map((boiler, i) => (
            <g key={i}>
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
                  <path d={`M ${boiler.x + 40} ${boiler.y + 55} Q ${boiler.x + 45} ${boiler.y + 40} ${boiler.x + 50} ${boiler.y + 55} Q ${boiler.x + 55} ${boiler.y + 40} ${boiler.x + 60} ${boiler.y + 55}`} fill="url(#flameGradient)" className="animate-pulse"/>
                  <circle cx={boiler.x + 50} cy={boiler.y + 50} r="4" fill="#ffff00" className="animate-ping" opacity="0.6"/>
                </>
              )}
              <rect x={boiler.x + 35} y={boiler.y + 90} width="30" height="10" rx="2" fill="#404040" stroke="#303030" strokeWidth="1"/>
              {boiler.running && <path d={`M ${boiler.x + 45} ${boiler.y + 100} L ${boiler.x + 50} ${boiler.y + 110} L ${boiler.x + 55} ${boiler.y + 100}`} fill="#ff6600" className="animate-pulse"/>}
              <rect x={boiler.x + 40} y={boiler.y - 15} width="20" height="15" fill="#808080" stroke="#606060" strokeWidth="1"/>
              <circle cx={boiler.x + 85} cy={boiler.y + 15} r="6" fill={boiler.running ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse"/>
              <text x={boiler.x + 50} y={boiler.y + 130} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{boiler.label}</text>
              <text x={boiler.x + 50} y={boiler.y + 145} textAnchor="middle" fontSize="10" fill={boiler.running ? '#00ff00' : '#ff4444'} fontWeight="bold">{boiler.running ? '● РАБОТА' : '○ ОСТАНОВ'}</text>
            </g>
          ))}

          {/* ===== СЛОЙ 2: ТЕПЛООБМЕННИКИ ===== */}
          {[
            { y: 0, label: 'Вентиляция' },
            { y: 100, label: 'Отопление' },
            { y: 200, label: 'ВТЗ' },
            { y: 300, label: 'ГВС' }
          ].map((hex, i) => (
            <g key={i}>
              <rect x="480" y={hex.y - 20} width="120" height="40" rx="4" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
              {[500, 520, 540, 560, 580].map((lx, idx) => (
                <line key={idx} x1={lx} y1={hex.y - 15} x2={lx} y2={hex.y + 15} stroke="#808080" strokeWidth="2"/>
              ))}
              <text x="540" y={hex.y + 6} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{hex.label}</text>
            </g>
          ))}

          {/* ===== СЛОЙ 3: НАСОСЫ КОНТУРОВ ===== */}
          {[
            { y: 0, label: 'Вент', running: pumpVentRunning },
            { y: 100, label: 'Отопл', running: pumpHeatRunning },
            { y: 200, label: 'ВТЗ', running: pumpVTZRunning },
            { y: 300, label: 'ГВС', running: pumpGVSRunning }
          ].map((circuit, i) => (
            <g key={i}>
              <rect x="630" y={circuit.y - 20} width="70" height="40" rx="5" fill="url(#pumpGradient)" stroke="#404040" strokeWidth="2"/>
              {circuit.running && <g className="animate-spin" style={{ transformOrigin: `665px ${circuit.y}px` }}><path d={`M 665 ${circuit.y - 10} L 675 ${circuit.y} L 665 ${circuit.y + 10} L 655 ${circuit.y} Z`} fill="#00b4d8"/></g>}
              <circle cx="665" cy={circuit.y} r="8" fill={circuit.running ? '#00b4d8' : '#404040'}/>
              <text x="665" y={circuit.y + 35} textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">{circuit.label}</text>
            </g>
          ))}

          {/* ===== СЛОЙ 4: ГАЗОВЫЕ НАСОСЫ ===== */}
          {[
            { x: 280, y: 460, running: pumpGas1Running, label: 'ГН-1' },
            { x: 450, y: 460, running: pumpGas2Running, label: 'ГН-2' }
          ].map((pump, i) => (
            <g key={i}>
              <rect x={pump.x} y={pump.y} width="100" height="60" rx="8" fill="url(#gasPumpGradient)" stroke="#cc9900" strokeWidth="2"/>
              {pump.running && <g className="animate-spin" style={{ transformOrigin: `${pump.x + 50}px ${pump.y + 30}px` }}><path d={`M ${pump.x + 50} ${pump.y + 15} L ${pump.x + 65} ${pump.y + 30} L ${pump.x + 50} ${pump.y + 45} L ${pump.x + 35} ${pump.y + 30} Z`} fill="#8b4513"/></g>}
              <circle cx={pump.x + 50} cy={pump.y + 30} r="10" fill={pump.running ? '#fff' : '#daa520'} stroke="#8b4513" strokeWidth="2"/>
              <text x={pump.x + 50} y={pump.y + 80} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffd700">{pump.label}</text>
            </g>
          ))}

          {/* ===== СЛОЙ 5: ТРУБЫ ===== */}
          <path d="M 380 490 L 450 490" stroke="#ffcc00" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 415 490 L 415 35" stroke="#ffcc00" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 415 35 L 160 35" stroke="#ffcc00" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 160 35 L 160 65" stroke="#ffcc00" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 160 240 L 160 255" stroke="#ffcc00" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 160 430 L 160 445" stroke="#ffcc00" strokeWidth="8" fill="none" strokeLinecap="round"/>
          <path d="M 100 -55 L 330 -55" stroke="#ff4444" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 100 135 L 330 135" stroke="#ff4444" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 100 325 L 330 325" stroke="#ff4444" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 330 -55 L 330 325" stroke="#ff4444" strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M 330 -55 L 330 0 L 480 0" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M 330 100 L 480 100" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 330 200 L 480 200" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 330 300 L 480 300" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 600 0 L 630 0" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 600 100 L 630 100" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 600 200 L 630 200" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 600 300 L 630 300" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 700 0 L 790 0" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 700 100 L 790 100" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 700 200 L 790 200" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 700 300 L 790 300" stroke="#4488ff" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 790 0 L 790 300" stroke="#4488ff" strokeWidth="14" fill="none" strokeLinecap="round"/>
          <path d="M 790 0 L 795 0" stroke="#4488ff" strokeWidth="12" fill="none" strokeLinecap="round"/>
          <path d="M 790 300 L 790 250 L 795 250" stroke="#4488ff" strokeWidth="12" fill="none" strokeLinecap="round" strokeLinejoin="round"/>

          {/* ===== СЛОЙ 6: МАНометр (ПОВЕРХ ТРУБ!) ===== */}
          <g>
            <path d="M 330 135 L 330 155" stroke="#ff4444" strokeWidth="6" fill="none"/>
            <circle cx="330" cy="180" r="28" fill="#303030" stroke="#606060" strokeWidth="3"/>
            <circle cx="330" cy="180" r="22" fill="#151515" stroke="#404040" strokeWidth="2"/>
            <circle cx="330" cy="180" r="18" fill="#0a0a0a"/>
            <line x1="330" y1="164" x2="330" y2="168" stroke="#fff" strokeWidth="2"/>
            <line x1="348" y1="180" x2="344" y2="180" stroke="#fff" strokeWidth="2"/>
            <line x1="330" y1="196" x2="330" y2="192" stroke="#fff" strokeWidth="2"/>
            <line x1="312" y1="180" x2="316" y2="180" stroke="#fff" strokeWidth="2"/>
            <line x1="330" y1="180" x2={330 + Math.cos((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} y2={180 + Math.sin((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} stroke="#ff4444" strokeWidth="3" strokeLinecap="round"/>
            <circle cx="330" cy="180" r="3" fill="#c0c0c0"/>
            <text x="330" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
            <text x="330" y="190" textAnchor="middle" fontSize="10" fill="#fff">Па</text>
          </g>

          {/* ===== СЛОЙ 7: ЗАДВИЖКИ (ПОВЕРХ ТРУБ!) ===== */}
          {[
            { x: 215, y: -55, open: valve1Open },
            { x: 215, y: 135, open: valve2Open },
            { x: 215, y: 325, open: valve3Open }
          ].map((valve, i) => (
            <g key={i}>
              <g className={`transition-transform duration-700 ${valve.open ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: `${valve.x}px ${valve.y}px` }}>
                <path d={`M ${valve.x} ${valve.y - 14} L ${valve.x + 14} ${valve.y} L ${valve.x} ${valve.y + 14} L ${valve.x - 14} ${valve.y} Z`} fill={valve.open ? '#00d4ff' : '#ff4444'} stroke="#fff" strokeWidth="2"/>
                <circle cx={valve.x} cy={valve.y - 22} r="8" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
              </g>
            </g>
          ))}

          {/* ===== СЛОЙ 8: РЕЗЕРВУАРЫ (ПОВЕРХ ВСЕГО!) ===== */}
          <g>
            <rect x="800" y="-50" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <ellipse cx="850" cy="-50" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <ellipse cx="850" cy="50" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <rect x="805" y={50 - dieselLevel} width="90" height={dieselLevel} rx="4" fill="url(#dieselGradient)"/>
            <text x="850" y="-5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">Дизель</text>
            <text x="850" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{dieselLevel.toFixed(0)}%</text>
          </g>
          <g>
            <rect x="800" y="200" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <ellipse cx="850" cy="200" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <ellipse cx="850" cy="300" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <rect x="805" y={300 - rchvLevel} width="90" height={rchvLevel} rx="4" fill="url(#waterGradient)"/>
            <text x="850" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">РЧВ</text>
            <text x="850" y="270" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{rchvLevel.toFixed(0)}%</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/80 p-2 rounded">
          <h3 className="text-white text-xs font-bold mb-1">Котлы</h3>
          <div className="space-y-1">
            {[{ label: 'Котел 1', status: pump1Running }, { label: 'Котел 2', status: pump2Running }, { label: 'Котел 3', status: pump3Running }].map((item, i) => (
              <div key={i} className={`flex justify-between items-center px-2 py-1.5 rounded text-xs font-bold cursor-default select-none ${item.status ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-gray-700/50 text-gray-400'}`}>
                <span>{item.label}</span>
                <span>{item.status ? 'РАБОТА' : 'ОСТАНОВ'}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-gray-800/80 p-2 rounded">
          <h3 className="text-white text-xs font-bold mb-1">Параметры</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span className="text-gray-400">Давление:</span><span className="text-cyan-400 font-mono font-bold">{pressureMain.toFixed(2)} Па</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Темп. подачи:</span><span className="text-orange-400 font-mono font-bold">{supplyTemp.toFixed(1)} °C</span></div>
            <div className="flex justify-between"><span className="text-gray-400">Ур. РЧВ:</span><span className="text-blue-400 font-mono font-bold">{rchvLevel.toFixed(0)}%</span></div>
          </div>
        </div>
        <div className="bg-gray-800/80 p-2 rounded">
          <h3 className="text-white text-xs font-bold mb-1">Топливо</h3>
          <div className="flex justify-between text-xs mb-1"><span className="text-gray-400">Дизель</span><span className="text-yellow-400 font-bold">{dieselLevel.toFixed(0)}%</span></div>
          <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-yellow-500 h-2 rounded-full transition-all duration-1000" style={{ width: `${dieselLevel}%` }}/></div>
        </div>
      </div>

      <div className="flex justify-between items-center mt-1 bg-gray-800/50 p-1.5 rounded text-xs">
        <div className="flex items-center gap-4">
          <div className="text-cyan-400"><span className="text-gray-400">Уставка:</span> {supplyTemp.toFixed(1)}</div>
          <div className="text-cyan-400"><span className="text-gray-400">Время:</span> {currentTime}</div>
        </div>
        <div className="text-gray-400 text-[10px]">ООО «ЮЛИТ» | Томск</div>
      </div>
    </div>
  );
}