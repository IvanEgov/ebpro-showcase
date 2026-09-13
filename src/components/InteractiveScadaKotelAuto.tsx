// src/components/InteractiveScadaKotelAuto.tsx
'use client';
import { useState, useEffect } from 'react';

export default function InteractiveScadaKotelAuto() {
  const [pump1Running, setPump1Running] = useState(false);
  const [pump2Running, setPump2Running] = useState(false);
  const [pump3Running, setPump3Running] = useState(false);
  const [pumpGas1Running, setPumpGas1Running] = useState(false);
  const [pumpGas2Running, setPumpGas2Running] = useState(false);
  const [dieselLevel, setDieselLevel] = useState(75);
  const [rchvLevel, setRchvLevel] = useState(60);
  const [outdoorTemp, setOutdoorTemp] = useState(-5.0);
  const [supplyTemp, setSupplyTemp] = useState(60.0);
  const [pressureMain, setPressureMain] = useState(1.5);
  const [valve1Open, setValve1Open] = useState(false);
  const [valve2Open, setValve2Open] = useState(false);
  const [valve3Open, setValve3Open] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      // Автоматическая симуляция
      if (Math.random() > 0.95) setPump1Running(prev => !prev);
      if (Math.random() > 0.95) setPump2Running(prev => !prev);
      if (Math.random() > 0.95) setPump3Running(prev => !prev);
      if (Math.random() > 0.97) setPumpGas1Running(prev => !prev);
      if (Math.random() > 0.97) setPumpGas2Running(prev => !prev);

      setValve1Open(pump1Running);
      setValve2Open(pump2Running);
      setValve3Open(pump3Running);

      setPressureMain(prev => {
        const change = (Math.random() - 0.5) * 0.1;
        return Math.max(0.5, Math.min(2.5, prev + change));
      });

      setSupplyTemp(prev => {
        const change = (Math.random() - 0.5) * 2;
        return Math.max(40, Math.min(85, prev + change));
      });

      setOutdoorTemp(prev => {
        const change = (Math.random() - 0.5) * 0.5;
        return Math.max(-20, Math.min(10, prev + change));
      });

      setDieselLevel(prev => {
        const change = (Math.random() - 0.5) * 1;
        return Math.max(20, Math.min(95, prev + change));
      });

      setRchvLevel(prev => {
        const change = (Math.random() - 0.5) * 1.5;
        return Math.max(30, Math.min(90, prev + change));
      });
    }, 500);

    return () => clearInterval(interval);
  }, [pump1Running, pump2Running, pump3Running]);

  return (
    <div className="w-full bg-[#0a2540] p-2 rounded-lg font-sans">
      <div className="flex justify-between items-center mb-1 bg-gray-800/50 p-1 rounded">
        <div className="flex items-center gap-4">
          <div className="text-cyan-400 text-sm font-bold">{outdoorTemp.toFixed(1)} °C</div>
          <div className="text-white text-sm">Температура наружного воздуха</div>
        </div>
        <div className="flex items-center gap-2">
          <span className="bg-green-500 text-white text-xs px-2 py-0.5 rounded font-bold animate-pulse">
            Автоматический режим
          </span>
        </div>
      </div>

      <div className="relative w-full mb-1" style={{ height: '650px' }}>
        <svg viewBox="-100 -60 1100 620" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#808080" />
              <stop offset="20%" stopColor="#d0d0d0" />
              <stop offset="50%" stopColor="#f0f0f0" />
              <stop offset="80%" stopColor="#d0d0d0" />
              <stop offset="100%" stopColor="#808080" />
            </linearGradient>
            <linearGradient id="dieselGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#8B4513" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#654321" stopOpacity="0.95" />
            </linearGradient>
            <linearGradient id="waterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#0088aa" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="boilerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#505050" />
              <stop offset="50%" stopColor="#d0d0d0" />
              <stop offset="100%" stopColor="#505050" />
            </linearGradient>
            <linearGradient id="flameGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#ff4400" />
              <stop offset="50%" stopColor="#ffaa00" />
              <stop offset="100%" stopColor="#ffff00" />
            </linearGradient>
          </defs>

          {/* Котлы */}
          {[
            { x: 60, y: -40, running: pump1Running, label: 'Котел 1' },
            { x: 60, y: 150, running: pump2Running, label: 'Котел 2' },
            { x: 60, y: 340, running: pump3Running, label: 'Котел 3' }
          ].map((boiler, i) => (
            <g key={i}>
              <rect x={boiler.x} y={boiler.y} width="100" height="90" rx="8" fill="url(#boilerGradient)" stroke="#404040" strokeWidth="2"/>
              <rect x={boiler.x + 30} y={boiler.y + 30} width="40" height="30" rx="4" fill="#1a1a1a" stroke="#606060" strokeWidth="2"/>
              {boiler.running && (
                <path d={`M ${boiler.x + 40} ${boiler.y + 55} Q ${boiler.x + 45} ${boiler.y + 40} ${boiler.x + 50} ${boiler.y + 55} Q ${boiler.x + 55} ${boiler.y + 40} ${boiler.x + 60} ${boiler.y + 55}`} 
                      fill="url(#flameGradient)" className="animate-pulse"/>
              )}
              <circle cx={boiler.x + 85} cy={boiler.y + 15} r="6" fill={boiler.running ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse"/>
              <text x={boiler.x + 50} y={boiler.y + 130} textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">{boiler.label}</text>
              <text x={boiler.x + 50} y={boiler.y + 145} textAnchor="middle" fontSize="10" fill="#00d4ff">
                {boiler.running ? 'РАБОТА' : 'ОСТАНОВ'}
              </text>
            </g>
          ))}

          {/* Газовые насосы */}
          {[
            { x: 280, y: 460, running: pumpGas1Running, label: 'ГН-1' },
            { x: 450, y: 460, running: pumpGas2Running, label: 'ГН-2' }
          ].map((pump, i) => (
            <g key={i}>
              <rect x={pump.x} y={pump.y} width="100" height="60" rx="8" fill="#ffd700" stroke="#cc9900" strokeWidth="2"/>
              {pump.running && (
                <g className="animate-spin" style={{ transformOrigin: `${pump.x+50}px ${pump.y+30}px` }}>
                  <path d={`M ${pump.x+50} ${pump.y+15} L ${pump.x+65} ${pump.y+30} L ${pump.x+50} ${pump.y+45} L ${pump.x+35} ${pump.y+30} Z`} fill="#8b4513"/>
                </g>
              )}
              <circle cx={pump.x+50} cy={pump.y+30} r="10" fill={pump.running ? '#fff' : '#daa520'} stroke="#8b4513" strokeWidth="2"/>
              <text x={pump.x+50} y={pump.y+80} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#ffd700">{pump.label}</text>
            </g>
          ))}

          {/* Трубы */}
          <path d="M 100 -55 L 330 -55" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 100 135 L 330 135" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 100 325 L 330 325" stroke="#ff4444" strokeWidth="10" fill="none" strokeLinecap="round"/>
          <path d="M 380 490 L 450 490" stroke="#ffcc00" strokeWidth="10" fill="none" strokeLinecap="round"/>

          {/* Задвижки */}
          {[
            { x: 215, y: -55, open: valve1Open },
            { x: 215, y: 135, open: valve2Open },
            { x: 215, y: 325, open: valve3Open }
          ].map((valve, i) => (
            <g key={i}>
              <g className={`transition-transform duration-500 ${valve.open ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: `${valve.x}px ${valve.y}px` }}>
                <path d={`M ${valve.x} ${valve.y-14} L ${valve.x+14} ${valve.y} L ${valve.x} ${valve.y+14} L ${valve.x-14} ${valve.y} Z`}
                      fill={valve.open ? '#00d4ff' : '#ff4444'} stroke="#fff" strokeWidth="2"/>
              </g>
            </g>
          ))}

          {/* Манометр */}
          <g>
            <circle cx="330" cy="180" r="28" fill="#303030" stroke="#606060" strokeWidth="3"/>
            <circle cx="330" cy="180" r="18" fill="#0a0a0a"/>
            <line x1="330" y1="180" x2={330 + Math.cos((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} 
                  y2={180 + Math.sin((pressureMain / 2.5) * Math.PI - Math.PI/2) * 14} 
                  stroke="#ff4444" strokeWidth="3" strokeLinecap="round"/>
            <text x="330" y="175" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
            <text x="330" y="190" textAnchor="middle" fontSize="10" fill="#fff">Па</text>
          </g>

          {/* Резервуары */}
          <g>
            <rect x="800" y="-50" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <rect x="805" y={50 - dieselLevel} width="90" height={dieselLevel} rx="4" fill="url(#dieselGradient)"/>
            <text x="850" y="-5" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">Дизель</text>
            <text x="850" y="20" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{dieselLevel.toFixed(0)}%</text>
          </g>

          <g>
            <rect x="800" y="200" width="100" height="100" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <rect x="805" y={300 - rchvLevel} width="90" height={rchvLevel} rx="4" fill="url(#waterGradient)"/>
            <text x="850" y="245" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">РЧВ</text>
            <text x="850" y="270" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{rchvLevel.toFixed(0)}%</text>
          </g>
        </svg>
      </div>

      <div className="flex justify-between items-center mt-1 bg-gray-800/50 p-1.5 rounded text-xs">
        <div className="flex items-center gap-4">
          <div className="text-cyan-400"><span className="text-gray-400">Темп. подачи:</span> {supplyTemp.toFixed(1)} °C</div>
          <div className="text-cyan-400"><span className="text-gray-400">Давление:</span> {pressureMain.toFixed(2)} Па</div>
        </div>
        <div className="text-gray-400 text-[10px]">ООО «ЮЛИТ» | Томск</div>
      </div>
    </div>
  );
}