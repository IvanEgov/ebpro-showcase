"use client";
import { useState, useEffect } from 'react';

export default function InteractiveScadaVentilation() {
    const [supplyFanRunning, setSupplyFanRunning] = useState(false);
    const [exhaustFanRunning, setExhaustFanRunning] = useState(false);
    const [heaterValveOpen, setHeaterValveOpen] = useState(false);
    const [acRunning, setAcRunning] = useState(false);
    const [recuperatorRunning, setRecuperatorRunning] = useState(true);
    const [damperOpen, setDamperOpen] = useState(false);
    const [filter1Status, setFilter1Status] = useState<'clean' | 'dirty' | 'alarm'>('clean');
    const [filter2Status, setFilter2Status] = useState<'clean' | 'dirty' | 'alarm'>('clean');

    const [tempOutdoor, setTempOutdoor] = useState(-5.0);
    const [tempSupply, setTempSupply] = useState(18.0);
    const [tempExhaust, setTempExhaust] = useState(22.0);
    const [tempRoom, setTempRoom] = useState(22.0);
    const [pressureDiff, setPressureDiff] = useState(0.0);
    const [airFlow, setAirFlow] = useState(0.0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Автоматическое переключение режимов
            if (Math.random() > 0.94) setSupplyFanRunning(prev => !prev);
            if (Math.random() > 0.94) setExhaustFanRunning(prev => !prev);
            if (Math.random() > 0.95) setAcRunning(prev => !prev);
            if (Math.random() > 0.96) setDamperOpen(prev => !prev);

            // Клапан калорифера открыт, если работает приточка и не работает кондиционер
            setHeaterValveOpen(supplyFanRunning && !acRunning);

            // Состояние фильтров
            if (Math.random() > 0.97) setFilter1Status(prev => prev === 'clean' ? 'dirty' : 'clean');
            if (Math.random() > 0.98) setFilter2Status(prev => prev === 'clean' ? 'dirty' : 'clean');
            if (Math.random() > 0.995) setFilter1Status('alarm');
            if (Math.random() > 0.995) setFilter2Status('alarm');

            // Наружная температура
            setTempOutdoor(prev => prev + (Math.random() - 0.5) * 0.3);

            // Давление и поток воздуха
            if (supplyFanRunning && exhaustFanRunning) {
                setPressureDiff(prev => Math.min(250, prev + 8 + (Math.random() - 0.5) * 3));
                setAirFlow(prev => Math.min(3500, prev + 80 + (Math.random() - 0.5) * 20));
            } else {
                setPressureDiff(prev => Math.max(0, prev - 5));
                setAirFlow(prev => Math.max(0, prev - 40));
            }

            // Температуры
            if (supplyFanRunning) {
                if (heaterValveOpen) {
                    setTempSupply(prev => Math.min(45, prev + 0.4 + (Math.random() - 0.5) * 0.2));
                } else if (acRunning) {
                    setTempSupply(prev => Math.max(14, prev - 0.4 + (Math.random() - 0.5) * 0.2));
                } else {
                    setTempSupply(prev => prev + (tempOutdoor - prev) * 0.05);
                }
                setTempRoom(prev => prev + (tempSupply - prev) * 0.02 + (Math.random() - 0.5) * 0.1);
            } else {
                setTempSupply(prev => prev + (tempOutdoor - prev) * 0.08);
                setTempRoom(prev => prev + (tempOutdoor - prev) * 0.03);
            }
            setTempExhaust(prev => prev + (tempRoom - prev) * 0.1 + (Math.random() - 0.5) * 0.2);

        }, 600);

        return () => clearInterval(interval);
    }, [supplyFanRunning, exhaustFanRunning, heaterValveOpen, acRunning, tempOutdoor, tempRoom]);

    const getStatusColor = (status: string) => {
        if (status === 'clean') return '#00ff00';
        if (status === 'dirty') return '#ffaa00';
        return '#ff0000';
    };

    const getStatusText = (status: string) => {
        if (status === 'clean') return 'Чистый';
        if (status === 'dirty') return 'Загрязнен';
        return 'Авария';
    };

    return (
        <div className="w-full bg-[#0a2540] p-3 rounded-lg font-sans">
            {/* Верхняя панель */}
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
                        <div className="px-3 py-1.5 rounded text-xs font-bold flex-1 text-center bg-cyan-500 text-white shadow-lg cursor-default select-none">Схема</div>
                        <div className="px-3 py-1.5 rounded text-xs font-bold flex-1 text-center bg-gray-700 text-gray-300 cursor-default select-none">Настройка</div>
                        <div className="px-3 py-1.5 rounded text-xs font-bold flex-1 text-center bg-gray-700 text-gray-300 cursor-default select-none">Архив</div>
                    </div>
                </div>
            </div>

            {/* Инфо-панель */}
            <div className="flex justify-between items-center mb-2 bg-gray-800/50 p-2 rounded border border-gray-700">
                <div className="flex items-center gap-4 text-sm">
                    <span className="text-cyan-400 font-bold">Улица: {tempOutdoor.toFixed(1)} °C</span>
                    <span className="text-white">Приток: <span className="text-orange-400 font-bold">{tempSupply.toFixed(1)} °C</span></span>
                    <span className="text-white">Вытяжка: <span className="text-red-400 font-bold">{tempExhaust.toFixed(1)} °C</span></span>
                    <span className="text-white">Зона: <span className="text-green-400 font-bold">{tempRoom.toFixed(1)} °C</span></span>
                </div>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">АВТО</span>
            </div>

            {/* SVG-схема */}
            <div className="relative w-full mb-2" style={{ height: '450px' }}>
                <svg viewBox="0 0 1200 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="ductGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#505050" />
                            <stop offset="50%" stopColor="#808080" />
                            <stop offset="100%" stopColor="#505050" />
                        </linearGradient>
                        <linearGradient id="fanGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#606060" />
                            <stop offset="50%" stopColor="#a0a0a0" />
                            <stop offset="100%" stopColor="#404040" />
                        </linearGradient>
                        <linearGradient id="heaterGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#8b0000" />
                            <stop offset="50%" stopColor="#ff4444" />
                            <stop offset="100%" stopColor="#8b0000" />
                        </linearGradient>
                        <linearGradient id="coolerGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#005577" />
                            <stop offset="50%" stopColor="#00b4d8" />
                            <stop offset="100%" stopColor="#005577" />
                        </linearGradient>
                        <linearGradient id="filterGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#e0e0e0" />
                            <stop offset="100%" stopColor="#909090" />
                        </linearGradient>
                    </defs>

                    {/* ===== ТРУБЫ (рисуем первыми, чтобы оборудование было поверх) ===== */}
                    {/* Приточный воздуховод (верхний, синий) */}
                    <path d="M 50 120 L 1150 120" stroke="#4488ff" strokeWidth="50" fill="none" opacity="0.3" />
                    <path d="M 50 120 L 1150 120" stroke="#4488ff" strokeWidth="46" fill="none" strokeDasharray="20 10" opacity="0.6" />

                    {/* Вытяжной воздуховод (нижний, красный) */}
                    <path d="M 50 330 L 1150 330" stroke="#ff4444" strokeWidth="50" fill="none" opacity="0.3" />
                    <path d="M 50 330 L 1150 330" stroke="#ff4444" strokeWidth="46" fill="none" strokeDasharray="20 10" opacity="0.6" />

                    {/* Вертикальные соединения */}
                    <path d="M 200 120 L 200 330" stroke="#888" strokeWidth="6" fill="none" strokeDasharray="5 5" />
                    <path d="M 1000 120 L 1000 330" stroke="#888" strokeWidth="6" fill="none" strokeDasharray="5 5" />

                    {/* ===== ОБОРУДОВАНИЕ (поверх труб) ===== */}

                    {/* Наружный воздух - вход */}
                    <g>
                        <rect x="30" y="85" width="60" height="70" rx="5" fill="#404040" stroke="#606060" strokeWidth="2" />
                        <text x="60" y="115" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Наружный</text>
                        <text x="60" y="130" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">воздух</text>
                        <text x="60" y="170" textAnchor="middle" fontSize="10" fill="#00d4ff">{tempOutdoor.toFixed(1)}°C</text>
                    </g>

                    {/* Воздушный клапан */}
                    <g>
                        <rect x="130" y="95" width="50" height="50" rx="5" fill="#606060" stroke="#404040" strokeWidth="2" />
                        <g className={`transition-transform duration-500 ${damperOpen ? 'rotate-0' : 'rotate-90'}`} style={{ transformOrigin: '155px 120px' }}>
                            <rect x="140" y="115" width="30" height="10" fill={damperOpen ? '#00d4ff' : '#ff4444'} stroke="#fff" strokeWidth="1" />
                        </g>
                        <text x="155" y="170" textAnchor="middle" fontSize="10" fill="white">Клапан</text>
                        <circle cx="155" cy="85" r="5" fill={damperOpen ? '#00ff00' : '#ff0000'} className="animate-pulse" />
                    </g>

                    {/* Фильтр приточный Ф1 */}
                    <g>
                        <rect x="220" y="85" width="80" height="70" rx="5" fill="url(#filterGradient)" stroke="#606060" strokeWidth="2" />
                        {[235, 250, 265, 280].map((x, i) => (
                            <line key={i} x1={x} y1="90" x2={x} y2="150" stroke="#606060" strokeWidth="1" />
                        ))}
                        <rect x="230" y="160" width="60" height="18" rx="3" fill={getStatusColor(filter1Status)} opacity="0.8" />
                        <text x="260" y="173" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{getStatusText(filter1Status)}</text>
                        <text x="260" y="200" textAnchor="middle" fontSize="10" fill="white">Фильтр Ф1</text>
                        <circle cx="260" cy="75" r="5" fill={getStatusColor(filter1Status)} className="animate-pulse" />
                    </g>

                    {/* Рекуператор */}
                    <g>
                        <rect x="340" y="85" width="100" height="70" rx="5" fill="#505050" stroke="#707070" strokeWidth="2" />
                        <path d="M 350 95 L 430 145 M 350 145 L 430 95" stroke="#888" strokeWidth="2" />
                        <path d="M 360 95 L 430 135 M 360 145 L 430 105" stroke="#aaa" strokeWidth="1" />
                        {recuperatorRunning && (
                            <circle cx="390" cy="120" r="8" fill="#00ff00" className="animate-pulse" />
                        )}
                        <text x="390" y="175" textAnchor="middle" fontSize="10" fill="white">Рекуператор</text>
                    </g>

                    {/* Калорифер водяной */}
                    <g>
                        <rect x="480" y="85" width="100" height="70" rx="5" fill="url(#heaterGradient)" stroke="#600000" strokeWidth="2" />
                        {[495, 510, 525, 540, 555, 570].map((x, i) => (
                            <path key={i} d={`M ${x} 95 Q ${x + 5} 120 ${x} 145`} stroke="#ffaa00" strokeWidth="2" fill="none" />
                        ))}
                        {heaterValveOpen && (
                            <circle cx="530" cy="120" r="8" fill="#ffff00" className="animate-ping" opacity="0.6" />
                        )}
                        <text x="530" y="175" textAnchor="middle" fontSize="10" fill="white">Калорифер</text>
                        <text x="530" y="188" textAnchor="middle" fontSize="9" fill="#ffaa00">водяной</text>
                        {/* Клапан калорифера */}
                        <g>
                            <rect x="515" y="60" width="30" height="20" rx="3" fill={heaterValveOpen ? '#00d4ff' : '#ff4444'} stroke="#fff" strokeWidth="1" />
                            <text x="530" y="74" textAnchor="middle" fontSize="9" fontWeight="bold" fill="white">
                                {heaterValveOpen ? 'ОТКР' : 'ЗАКР'}
                            </text>
                        </g>
                    </g>

                    {/* Кондиционер */}
                    <g>
                        <rect x="620" y="85" width="100" height="70" rx="5" fill="url(#coolerGradient)" stroke="#004466" strokeWidth="2" />
                        <text x="670" y="115" textAnchor="middle" fontSize="24" fill="#fff">❄</text>
                        <text x="670" y="140" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">
                            {acRunning ? 'ОХЛАЖДЕНИЕ' : 'ВЫКЛ'}
                        </text>
                        {acRunning && (
                            <circle cx="670" cy="120" r="10" fill="#00d4ff" opacity="0.3" className="animate-ping" />
                        )}
                        <text x="670" y="175" textAnchor="middle" fontSize="10" fill="white">Кондиционер</text>
                        <circle cx="670" cy="75" r="5" fill={acRunning ? '#00ff00' : '#ff0000'} className="animate-pulse" />
                    </g>

                    {/* Приточный вентилятор */}
                    <g>
                        <circle cx="800" cy="120" r="40" fill="url(#fanGradient)" stroke="#404040" strokeWidth="3" />
                        {supplyFanRunning && (
                            <g className="animate-spin" style={{ transformOrigin: '800px 120px' }}>
                                <path d="M 800 90 L 815 120 L 800 150 L 785 120 Z" fill="#00b4d8" />
                                <path d="M 770 120 L 800 105 L 830 120 L 800 135 Z" fill="#00b4d8" opacity="0.7" />
                            </g>
                        )}
                        <circle cx="800" cy="120" r="10" fill={supplyFanRunning ? '#00d4ff' : '#404040'} stroke="#fff" strokeWidth="2" />
                        <text x="800" y="180" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Приточный</text>
                        <text x="800" y="195" textAnchor="middle" fontSize="10" fill="#00d4ff">вентилятор</text>
                        <circle cx="800" cy="70" r="6" fill={supplyFanRunning ? '#00ff00' : '#ff0000'} className="animate-pulse" />
                    </g>

                    {/* Датчик давления */}
                    <g>
                        <circle cx="920" cy="120" r="22" fill="#202020" stroke="#00d4ff" strokeWidth="2" />
                        <text x="920" y="117" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#00d4ff">{pressureDiff.toFixed(0)}</text>
                        <text x="920" y="130" textAnchor="middle" fontSize="8" fill="white">Па</text>
                        <text x="920" y="160" textAnchor="middle" fontSize="9" fill="white">Перепад</text>
                    </g>

                    {/* Подача в помещение */}
                    <g>
                        <rect x="1050" y="85" width="100" height="70" rx="5" fill="#2d5016" stroke="#4a7c2e" strokeWidth="2" />
                        <text x="1100" y="115" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">ПОМЕЩЕНИЕ</text>
                        <text x="1100" y="135" textAnchor="middle" fontSize="11" fill="#00ff00">{tempRoom.toFixed(1)}°C</text>
                        <text x="1100" y="170" textAnchor="middle" fontSize="9" fill="#aaa">{airFlow.toFixed(0)} м³/ч</text>
                    </g>

                    {/* ===== НИЖНЯЯ ЧАСТЬ: ВЫТЯЖКА ===== */}

                    {/* Вытяжной вентилятор */}
                    <g>
                        <circle cx="400" cy="330" r="40" fill="url(#fanGradient)" stroke="#404040" strokeWidth="3" />
                        {exhaustFanRunning && (
                            <g className="animate-spin" style={{ transformOrigin: '400px 330px' }}>
                                <path d="M 400 300 L 415 330 L 400 360 L 385 330 Z" fill="#ff6666" />
                                <path d="M 370 330 L 400 315 L 430 330 L 400 345 Z" fill="#ff6666" opacity="0.7" />
                            </g>
                        )}
                        <circle cx="400" cy="330" r="10" fill={exhaustFanRunning ? '#ff4444' : '#404040'} stroke="#fff" strokeWidth="2" />
                        <text x="400" y="390" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Вытяжной</text>
                        <text x="400" y="405" textAnchor="middle" fontSize="10" fill="#ff8888">вентилятор</text>
                        <circle cx="400" cy="280" r="6" fill={exhaustFanRunning ? '#00ff00' : '#ff0000'} className="animate-pulse" />
                    </g>

                    {/* Фильтр вытяжной Ф2 */}
                    <g>
                        <rect x="550" y="295" width="80" height="70" rx="5" fill="url(#filterGradient)" stroke="#606060" strokeWidth="2" />
                        {[565, 580, 595, 610].map((x, i) => (
                            <line key={i} x1={x} y1="300" x2={x} y2="360" stroke="#606060" strokeWidth="1" />
                        ))}
                        <rect x="560" y="370" width="60" height="18" rx="3" fill={getStatusColor(filter2Status)} opacity="0.8" />
                        <text x="590" y="383" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">{getStatusText(filter2Status)}</text>
                        <text x="590" y="410" textAnchor="middle" fontSize="10" fill="white">Фильтр Ф2</text>
                        <circle cx="590" cy="285" r="5" fill={getStatusColor(filter2Status)} className="animate-pulse" />
                    </g>

                    {/* Датчик температуры вытяжки */}
                    <g>
                        <circle cx="720" cy="330" r="22" fill="#202020" stroke="#ff4444" strokeWidth="2" />
                        <text x="720" y="327" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ff8888">{tempExhaust.toFixed(1)}</text>
                        <text x="720" y="340" textAnchor="middle" fontSize="8" fill="white">°C</text>
                        <text x="720" y="370" textAnchor="middle" fontSize="9" fill="white">Вытяжка</text>
                    </g>

                    {/* Выброс наружу */}
                    <g>
                        <rect x="1050" y="295" width="100" height="70" rx="5" fill="#404040" stroke="#606060" strokeWidth="2" />
                        <text x="1100" y="325" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">Выброс</text>
                        <text x="1100" y="345" textAnchor="middle" fontSize="10" fill="#aaa">наружу</text>
                        <path d="M 1080 355 L 1090 350 L 1100 355 L 1110 350 L 1120 355" stroke="#888" strokeWidth="2" fill="none" />
                    </g>

                    {/* Датчик температуры притока */}
                    <g>
                        <circle cx="950" cy="120" r="22" fill="#202020" stroke="#ff8800" strokeWidth="2" />
                        <text x="950" y="117" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ffaa44">{tempSupply.toFixed(1)}</text>
                        <text x="950" y="130" textAnchor="middle" fontSize="8" fill="white">°C</text>
                        <text x="950" y="160" textAnchor="middle" fontSize="9" fill="white">Приток</text>
                    </g>
                </svg>
            </div>

            {/* Нижняя панель параметров */}
            <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-1">Оборудование</h3>
                    <div className="space-y-1 text-xs">
                        <div className={`flex justify-between p-1 rounded ${supplyFanRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            <span>Приточный</span><span>{supplyFanRunning ? 'ВКЛ' : 'ВЫКЛ'}</span>
                        </div>
                        <div className={`flex justify-between p-1 rounded ${exhaustFanRunning ? 'bg-green-500/20 text-green-400' : 'bg-gray-700 text-gray-400'}`}>
                            <span>Вытяжной</span><span>{exhaustFanRunning ? 'ВКЛ' : 'ВЫКЛ'}</span>
                        </div>
                        <div className={`flex justify-between p-1 rounded ${heaterValveOpen ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'}`}>
                            <span>Калорифер</span><span>{heaterValveOpen ? 'НАГРЕВ' : 'ВЫКЛ'}</span>
                        </div>
                        <div className={`flex justify-between p-1 rounded ${acRunning ? 'bg-cyan-500/20 text-cyan-400' : 'bg-gray-700 text-gray-400'}`}>
                            <span>Кондиционер</span><span>{acRunning ? 'ОХЛ' : 'ВЫКЛ'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-1">Температуры</h3>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-300">
                            <span>Улица:</span><span className="text-cyan-400 font-mono">{tempOutdoor.toFixed(1)} °C</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Приток:</span><span className="text-orange-400 font-mono">{tempSupply.toFixed(1)} °C</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Вытяжка:</span><span className="text-red-400 font-mono">{tempExhaust.toFixed(1)} °C</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Помещение:</span><span className="text-green-400 font-mono">{tempRoom.toFixed(1)} °C</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-1">Параметры воздуха</h3>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between text-gray-300">
                            <span>Перепад:</span><span className="text-cyan-400 font-mono">{pressureDiff.toFixed(0)} Па</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Расход:</span><span className="text-cyan-400 font-mono">{airFlow.toFixed(0)} м³/ч</span>
                        </div>
                        <div className="flex justify-between text-gray-300">
                            <span>Клапан:</span><span className={damperOpen ? 'text-green-400' : 'text-red-400'}>{damperOpen ? 'ОТКРЫТ' : 'ЗАКРЫТ'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-1">Фильтры</h3>
                    <div className="space-y-1 text-xs">
                        <div className={`flex justify-between p-1 rounded`} style={{ backgroundColor: `${getStatusColor(filter1Status)}20`, color: getStatusColor(filter1Status) }}>
                            <span>Ф1 (приток)</span><span>{getStatusText(filter1Status)}</span>
                        </div>
                        <div className={`flex justify-between p-1 rounded`} style={{ backgroundColor: `${getStatusColor(filter2Status)}20`, color: getStatusColor(filter2Status) }}>
                            <span>Ф2 (вытяжка)</span><span>{getStatusText(filter2Status)}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}