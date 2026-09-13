"use client";
import { useState, useEffect, useRef } from 'react';

export default function InteractiveScada() {
  const [pump1Running, setPump1Running] = useState(true);
  const [pump2Running, setPump2Running] = useState(true);
  const [pumpMainRunning, setPumpMainRunning] = useState(true);
  const [pressureMain, setPressureMain] = useState(1.2);
  const [pressureRight, setPressureRight] = useState(0.8);
  const [pressureRCHV1, setPressureRCHV1] = useState(1.5);
  const [pressureRCHV2, setPressureRCHV2] = useState(1.2);
  const [reactorLevel, setReactorLevel] = useState(82);
  const [filterStatus, setFilterStatus] = useState([true, true, true, false]);
  const [phase, setPhase] = useState<'draining' | 'filling'>('draining');
  const phaseRef = useRef<'draining' | 'filling'>('draining');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentPhase = phaseRef.current;
      if (currentPhase === 'draining') {
        setReactorLevel(prev => {
          const next = prev - 0.15;
          if (next <= 18) {
            phaseRef.current = 'filling';
            setPhase('filling');
            setPump1Running(false);
            setPump2Running(false);
            setPumpMainRunning(false);
            setFilterStatus([false, false, false, false]);
            return 18;
          }
          return next;
        });
        setPressureMain(prev => Math.max(0.3, prev - 0.003 + (Math.random() - 0.5) * 0.02));
        setPressureRight(prev => Math.max(0.2, prev - 0.002 + (Math.random() - 0.5) * 0.015));
        setPressureRCHV1(prev => Math.max(0.5, prev - 0.002 + (Math.random() - 0.5) * 0.01));
        setPressureRCHV2(prev => Math.max(0.4, prev - 0.002 + (Math.random() - 0.5) * 0.01));
      } else {
        setReactorLevel(prev => {
          const next = prev + 1.0;
          if (next >= 82) {
            phaseRef.current = 'draining';
            setPhase('draining');
            setPump1Running(true);
            setPump2Running(true);
            setPumpMainRunning(true);
            setFilterStatus([true, true, true, false]);
            return 82;
          }
          return next;
        });
        setPressureMain(prev => Math.min(2.5, prev + 0.02 + (Math.random() - 0.5) * 0.02));
        setPressureRight(prev => Math.min(1.8, prev + 0.015 + (Math.random() - 0.5) * 0.015));
        setPressureRCHV1(prev => Math.min(3.0, prev + 0.01 + (Math.random() - 0.5) * 0.01));
        setPressureRCHV2(prev => Math.min(2.5, prev + 0.01 + (Math.random() - 0.5) * 0.01));
      }
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#0a2540] p-3 rounded-lg">
      <div className="relative w-full mb-2" style={{ height: '360px' }}>
        <svg viewBox="0 0 1200 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
          <defs>
            <linearGradient id="tankGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#808080" /><stop offset="20%" stopColor="#d0d0d0" />
              <stop offset="50%" stopColor="#f0f0f0" /><stop offset="80%" stopColor="#d0d0d0" />
              <stop offset="100%" stopColor="#808080" />
            </linearGradient>
            <linearGradient id="liquidGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#00d4ff" stopOpacity="0.8" /><stop offset="100%" stopColor="#0088aa" stopOpacity="0.9" />
            </linearGradient>
            <linearGradient id="filterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#909090" /><stop offset="30%" stopColor="#e0e0e0" />
              <stop offset="70%" stopColor="#e0e0e0" /><stop offset="100%" stopColor="#909090" />
            </linearGradient>
            <radialGradient id="capGradient">
              <stop offset="0%" stopColor="#f0f0f0" /><stop offset="100%" stopColor="#a0a0a0" />
            </radialGradient>
          </defs>

          {/* ===== СЛОЙ 1: БАК-РЕАКТОР ===== */}
          <g>
            <rect x="100" y="320" width="15" height="30" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="245" y="320" width="15" height="30" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="80" y="200" width="200" height="120" rx="10" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <ellipse cx="180" cy="200" rx="100" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <ellipse cx="180" cy="320" rx="100" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <rect x="90" y={320 - reactorLevel * 1.2} width="180" height={reactorLevel * 1.2} rx="5" fill="url(#liquidGradient)"/>
            <text x="180" y="245" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0a0a0a">ВУ</text>
            <text x="180" y="275" textAnchor="middle" fontSize="16" fill="#0a0a0a">Бак-реактор</text>
            <text x="180" y="305" textAnchor="middle" fontSize="20" fontWeight="bold" fill="#0a0a0a">НУ</text>
            <circle cx="260" cy="235" r="12" fill={reactorLevel > 80 ? '#ff0000' : '#00ff00'} stroke="#fff" strokeWidth="2" className="animate-pulse"/>
            <circle cx="260" cy="285" r="12" fill={reactorLevel < 20 ? '#ff0000' : '#00ff00'} stroke="#fff" strokeWidth="2" className="animate-pulse"/>
          </g>

          {/* ===== СЛОЙ 2: НАСОСЫ ===== */}
          <g>
            <rect x="180" y="380" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
            {pump1Running && <g className="animate-spin" style={{ transformOrigin: '200px 400px' }}><path d="M 200 388 L 208 400 L 200 412 L 192 400 Z" fill="#00b4d8"/></g>}
            <circle cx="200" cy="400" r="8" fill={pump1Running ? '#00b4d8' : '#404040'}/>
            <text x="200" y="440" textAnchor="middle" fontSize="10" fill="white">Насос 1</text>
            <rect x="225" y="385" width="50" height="20" rx="3" fill={pump1Running ? '#2d5016' : '#8b0000'}/>
            <text x="250" y="399" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{pump1Running ? 'Норма' : 'Авария'}</text>
          </g>
          <g>
            <rect x="280" y="380" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
            {pump2Running && <g className="animate-spin" style={{ transformOrigin: '300px 400px' }}><path d="M 300 388 L 308 400 L 300 412 L 292 400 Z" fill="#00b4d8"/></g>}
            <circle cx="300" cy="400" r="8" fill={pump2Running ? '#00b4d8' : '#404040'}/>
            <text x="300" y="440" textAnchor="middle" fontSize="10" fill="white">Насос 2</text>
            <rect x="325" y="385" width="50" height="20" rx="3" fill={pump2Running ? '#2d5016' : '#8b0000'}/>
            <text x="350" y="399" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{pump2Running ? 'Норма' : 'Авария'}</text>
          </g>

          {/* ===== СЛОЙ 3: МАНОМЕТР ===== */}
          <g>
            <circle cx="400" cy="60" r="30" fill="#303030" stroke="#606060" strokeWidth="3"/>
            <circle cx="400" cy="60" r="24" fill="#151515" stroke="#404040" strokeWidth="2"/>
            <circle cx="400" cy="60" r="20" fill="#0a0a0a"/>
            <line x1="400" y1="42" x2="400" y2="46" stroke="#fff" strokeWidth="1.5"/>
            <line x1="418" y1="60" x2="414" y2="60" stroke="#fff" strokeWidth="1.5"/>
            <line x1="400" y1="78" x2="400" y2="74" stroke="#fff" strokeWidth="1.5"/>
            <line x1="382" y1="60" x2="386" y2="60" stroke="#fff" strokeWidth="1.5"/>
            <line x1="400" y1="60" x2={400 + Math.cos((pressureMain / 2.5) * Math.PI - Math.PI/2) * 15} y2={60 + Math.sin((pressureMain / 2.5) * Math.PI - Math.PI/2) * 15} stroke="#ff4444" strokeWidth="2" strokeLinecap="round"/>
            <circle cx="400" cy="60" r="3" fill="#c0c0c0"/>
            <text x="400" y="52" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#00d4ff">{pressureMain.toFixed(1)}</text>
            <text x="400" y="72" textAnchor="middle" fontSize="9" fill="#fff">Па</text>
          </g>

          {/* ===== СЛОЙ 4: 4 ФИЛЬТРА ===== */}
          {[0, 1, 2, 3].map((i) => {
            const x = 470 + i * 150;
            const isWorking = filterStatus[i];
            const isAlwaysBroken = i === 3;
            return (
              <g key={i}>
                <rect x={x + 10} y="350" width="8" height="20" fill="#606060" stroke="#404040" strokeWidth="1"/>
                <rect x={x + 42} y="350" width="8" height="20" fill="#606060" stroke="#404040" strokeWidth="1"/>
                <rect x={x} y="200" width="60" height="150" rx="8" fill="url(#filterGradient)" stroke="#707070" strokeWidth="2"/>
                <ellipse cx={x + 30} cy="200" rx="30" ry="10" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <ellipse cx={x + 30} cy="350" rx="30" ry="10" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
                <rect x={x + 5} y="260" width="50" height="25" rx="4" fill={isAlwaysBroken ? '#8b0000' : isWorking ? '#2d5016' : '#555'} stroke="#fff" strokeWidth="1"/>
                <text x={x + 30} y="277" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">{isAlwaysBroken ? 'Авария' : isWorking ? 'Работа' : 'Останов'}</text>
                <circle cx={x + 30} cy="230" r="8" fill={isAlwaysBroken ? '#ff0000' : isWorking ? '#00ff00' : '#ff8800'} stroke="#fff" strokeWidth="2" className="animate-pulse"/>
              </g>
            );
          })}

          {/* ===== СЛОЙ 5: СЕПТИК ===== */}
          <g>
            <rect x="900" y="490" width="15" height="10" fill="#404040" stroke="#303030" strokeWidth="1"/>
            <rect x="985" y="490" width="15" height="10" fill="#404040" stroke="#303030" strokeWidth="1"/>
            <rect x="880" y="450" width="140" height="40" rx="6" fill="#404040" stroke="#505050" strokeWidth="2"/>
            <ellipse cx="950" cy="450" rx="70" ry="6" fill="#606060" stroke="#404040" strokeWidth="2"/>
            <text x="950" y="478" textAnchor="middle" fontSize="16" fontWeight="bold" fill="white" style={{textShadow: '1px 1px 2px rgba(0,0,0,0.8)'}}>Септик</text>
          </g>

          {/* ===== СЛОЙ 6: ГЛАВНЫЙ НАСОС (НЦ3) ===== */}
          <g>
            <rect x="1030" y="420" width="40" height="40" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
            {pumpMainRunning && <g className="animate-spin" style={{ transformOrigin: '1050px 440px' }}><path d="M 1050 428 L 1058 440 L 1050 452 L 1042 440 Z" fill="#00b4d8"/></g>}
            <circle cx="1050" cy="440" r="8" fill={pumpMainRunning ? '#00b4d8' : '#404040'}/>
            <text x="1050" y="480" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">НЦ3</text>
            <rect x="1075" y="425" width="50" height="20" rx="3" fill={pumpMainRunning ? '#2d5016' : '#8b0000'}/>
            <text x="1100" y="439" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{pumpMainRunning ? 'Норма' : 'Авария'}</text>
          </g>

          {/* ===== СЛОЙ 7: ТРУБЫ ===== */}
          <path d="M 170 320 L 170 380 L 200 380" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 170 320 L 170 380 L 300 380" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 200 420 L 200 460 L 400 460" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 300 420 L 300 460 L 400 460" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 400 460 L 400 100 L 500 100" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 500 100 L 950 100" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 500 100 L 500 200" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 650 100 L 650 200" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 800 100 L 800 200" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 950 100 L 950 200" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 500 350 L 500 420" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 650 350 L 650 420" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 800 350 L 800 420" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 950 350 L 950 420" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 500 420 L 1030 420" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 1050 420 L 1050 90" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 1050 60 L 1100 60" stroke="#00b4d8" strokeWidth="8" fill="none"/>
          <path d="M 1050 150 L 1100 150" stroke="#00b4d8" strokeWidth="8" fill="none"/>

          {/* ===== СЛОЙ 8: РЧВ1 и РЧВ2 (ПОВЕРХ ТРУБ!) ===== */}
          <g>
            <rect x="1060" y="90" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="1128" y="90" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="1050" y="30" width="100" height="60" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <ellipse cx="1100" cy="30" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <ellipse cx="1100" cy="90" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <rect x="1060" y="40" width="6" height="40" rx="3" fill="#fff" opacity="0.4"/>
            <rect x="1134" y="40" width="6" height="40" rx="3" fill="#000" opacity="0.2"/>
            <text x="1100" y="58" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">РЧВ1</text>
            <text x="1100" y="78" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{pressureRCHV1.toFixed(1)} Па</text>
          </g>
          <g>
            <rect x="1060" y="180" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="1128" y="180" width="12" height="25" fill="#606060" stroke="#404040" strokeWidth="1"/>
            <rect x="1050" y="120" width="100" height="60" rx="8" fill="url(#tankGradient)" stroke="#606060" strokeWidth="2"/>
            <ellipse cx="1100" cy="120" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <ellipse cx="1100" cy="180" rx="50" ry="8" fill="url(#capGradient)" stroke="#808080" strokeWidth="2"/>
            <rect x="1060" y="130" width="6" height="40" rx="3" fill="#fff" opacity="0.4"/>
            <rect x="1134" y="130" width="6" height="40" rx="3" fill="#000" opacity="0.2"/>
            <text x="1100" y="148" textAnchor="middle" fontSize="16" fontWeight="bold" fill="#0a0a0a">РЧВ2</text>
            <text x="1100" y="168" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#0a0a0a">{pressureRCHV2.toFixed(1)} Па</text>
          </g>

          {/* ===== СЛОЙ 9: ДАТЧИК ДАВЛЕНИЯ НЦ3 (ПОВЕРХ ВСЕГО!) ===== */}
          <g>
            <circle cx="1050" cy="405" r="16" fill="#202020" stroke="#404040" strokeWidth="2"/>
            <text x="1050" y="402" textAnchor="middle" fontSize="9" fill="#00d4ff">{pressureRight.toFixed(1)}</text>
            <text x="1050" y="413" textAnchor="middle" fontSize="7" fill="white">Па</text>
          </g>
        </svg>
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-gray-800/80 p-2 rounded">
          <h3 className="text-white text-xs font-bold mb-1">Насосы</h3>
          <div className="space-y-1">
            <div className={`w-full py-1 rounded text-xs text-center cursor-default select-none ${pump1Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}>Н1: {pump1Running ? 'ВКЛ' : 'ВЫКЛ'}</div>
            <div className={`w-full py-1 rounded text-xs text-center cursor-default select-none ${pump2Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}>Н2: {pump2Running ? 'ВКЛ' : 'ВЫКЛ'}</div>
            <div className={`w-full py-1 rounded text-xs text-center cursor-default select-none ${pumpMainRunning ? 'bg-green-500' : 'bg-gray-600'} text-white`}>НЦ3: {pumpMainRunning ? 'ВКЛ' : 'ВЫКЛ'}</div>
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
            <div className={`h-2.5 rounded-full transition-all ${phase === 'draining' ? 'bg-orange-500' : 'bg-cyan-500'}`} style={{ width: `${reactorLevel}%` }}/>
          </div>
          <div className="text-[10px] text-gray-400 mt-1">{phase === 'draining' ? '▼ Опорожнение' : '▲ Наполнение'}</div>
        </div>
      </div>
    </div>
  );
}