"use client";
import { useState, useEffect } from 'react';

type Room = {
    name: string;
    light: boolean;
    temp: number;
    humidity: number;
    motion: boolean;
};

export default function InteractiveScadaSmartHome() {
    const [rooms, setRooms] = useState<Room[]>([
        { name: 'Гостиная', light: false, temp: 22.5, humidity: 45, motion: false },
        { name: 'Спальня', light: false, temp: 21.0, humidity: 48, motion: false },
        { name: 'Кухня', light: false, temp: 23.0, humidity: 55, motion: false },
    ]);

    const [mainWaterValveOpen, setMainWaterValveOpen] = useState(true);
    const [leakDetected, setLeakDetected] = useState(false);
    const [waterPressure, setWaterPressure] = useState(3.5);
    const [alarmActive, setAlarmActive] = useState(false);
    const [doorLocked, setDoorLocked] = useState(true);
    const [outdoorTemp, setOutdoorTemp] = useState(-2.0);

    useEffect(() => {
        const interval = setInterval(() => {
            // Автоматическое управление светом по датчикам движения
            setRooms(prev => prev.map(room => {
                // Случайное появление движения
                const motion = Math.random() > 0.85;
                // Свет включается при движении, выключается через время
                const light = motion ? true : (room.light && Math.random() > 0.7 ? false : room.light);
                return {
                    ...room,
                    motion,
                    light,
                    temp: room.temp + (Math.random() - 0.5) * 0.3,
                    humidity: Math.max(30, Math.min(70, room.humidity + (Math.random() - 0.5) * 1.0)),
                };
            }));

            // Симуляция протечки (редкое событие)
            if (!leakDetected && Math.random() > 0.992) {
                setLeakDetected(true);
                setMainWaterValveOpen(false);
                setWaterPressure(0.0);
                setAlarmActive(true);
            }

            // Сброс протечки через некоторое время
            if (leakDetected && Math.random() > 0.96) {
                setLeakDetected(false);
                setMainWaterValveOpen(true);
                setAlarmActive(false);
            }

            // Давление воды
            if (mainWaterValveOpen) {
                setWaterPressure(prev => 3.5 + (Math.random() - 0.5) * 0.3);
            }

            // Наружная температура
            setOutdoorTemp(prev => prev + (Math.random() - 0.5) * 0.2);

            // Случайная блокировка двери
            if (Math.random() > 0.95) setDoorLocked(prev => !prev);

        }, 700);

        return () => clearInterval(interval);
    }, [leakDetected, mainWaterValveOpen]);

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

            {/* Аварийная панель */}
            <div className={`flex justify-between items-center mb-2 p-2 rounded border ${alarmActive ? 'bg-red-900/50 border-red-500 animate-pulse' : 'bg-gray-800/50 border-gray-700'}`}>
                <div className="flex items-center gap-4 text-sm">
                    <span className={`font-bold ${alarmActive ? 'text-red-400' : 'text-green-400'}`}>
                        {alarmActive ? '🚨 ТРЕВОГА: ПРОТЕЧКА!' : '✓ Система в норме'}
                    </span>
                    <span className="text-cyan-400 font-bold">Улица: {outdoorTemp.toFixed(1)} °C</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-white text-xs">Вода:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${mainWaterValveOpen ? 'bg-green-500' : 'bg-red-600 animate-pulse'}`}>
                        {mainWaterValveOpen ? 'ОТКРЫТ' : 'ПЕРЕКРЫТ'}
                    </span>
                    <span className="text-white text-xs ml-2">Дверь:</span>
                    <span className={`px-2 py-0.5 rounded text-xs font-bold ${doorLocked ? 'bg-blue-500' : 'bg-yellow-600'}`}>
                        {doorLocked ? '🔒' : '🔓'}
                    </span>
                </div>
            </div>

            {/* SVG-схема квартиры */}
            <div className="relative w-full mb-2" style={{ height: '450px' }}>
                <svg viewBox="0 0 1000 450" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <radialGradient id="lightGlow">
                            <stop offset="0%" stopColor="#ffdd00" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#ffdd00" stopOpacity="0" />
                        </radialGradient>
                        <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2a3f5f" />
                            <stop offset="100%" stopColor="#1a2940" />
                        </linearGradient>
                        <linearGradient id="waterPipeGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#0088aa" />
                            <stop offset="100%" stopColor="#004466" />
                        </linearGradient>
                    </defs>

                    {/* Фон квартиры */}
                    <rect x="50" y="30" width="900" height="390" fill="url(#wallGradient)" stroke="#4a6fa5" strokeWidth="3" rx="5" />

                    {/* ===== Водопровод (синие трубы) ===== */}
                    <path d="M 100 420 L 900 420" stroke="url(#waterPipeGradient)" strokeWidth="8" fill="none" />
                    <path d="M 200 420 L 200 380" stroke="#0088aa" strokeWidth="6" fill="none" />
                    <path d="M 500 420 L 500 380" stroke="#0088aa" strokeWidth="6" fill="none" />
                    <path d="M 800 420 L 800 380" stroke="#0088aa" strokeWidth="6" fill="none" />

                    {/* Главный водяной клапан */}
                    <g>
                        <rect x="60" y="405" width="60" height="30" rx="5" fill="#404040" stroke="#606060" strokeWidth="2" />
                        <circle cx="90" cy="420" r="10" fill={mainWaterValveOpen ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="2" className="animate-pulse" />
                        <text x="90" y="455" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">Главный</text>
                        <text x="90" y="468" textAnchor="middle" fontSize="9" fill="#00d4ff">{waterPressure.toFixed(1)} бар</text>
                    </g>

                    {/* Датчик протечки */}
                    <g>
                        <circle cx="500" cy="420" r="12" fill={leakDetected ? '#ff0000' : '#00d4ff'} stroke="#fff" strokeWidth="2" className="animate-pulse" />
                        <text x="500" y="424" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">💧</text>
                        <text x="500" y="455" textAnchor="middle" fontSize="9" fill={leakDetected ? '#ff4444' : 'white'}>
                            {leakDetected ? 'ПРОТЕЧКА!' : 'Датчик протечки'}
                        </text>
                    </g>

                    {/* ===== КОМНАТЫ ===== */}
                    {rooms.map((room, i) => {
                        const x = 80 + i * 290;
                        const y = 50;
                        const width = 260;
                        const height = 310;
                        return (
                            <g key={i}>
                                {/* Стены комнаты */}
                                <rect x={x} y={y} width={width} height={height} fill="#1a2940" stroke="#4a6fa5" strokeWidth="2" rx="3" />

                                {/* Название комнаты */}
                                <text x={x + width / 2} y={y + 25} textAnchor="middle" fontSize="16" fontWeight="bold" fill="#4a6fa5">
                                    {room.name}
                                </text>

                                {/* Светильник */}
                                <g>
                                    {room.light && (
                                        <circle cx={x + width / 2} cy={y + 70} r="50" fill="url(#lightGlow)" className="animate-pulse" />
                                    )}
                                    <path d={`M ${x + width / 2 - 15} ${y + 55} L ${x + width / 2} ${y + 45} L ${x + width / 2 + 15} ${y + 55} Z`}
                                        fill={room.light ? '#ffdd00' : '#404040'} stroke="#fff" strokeWidth="1" />
                                    <circle cx={x + width / 2} cy={y + 50} r="4" fill={room.light ? '#ffdd00' : '#404040'} />
                                    <text x={x + width / 2} y={y + 95} textAnchor="middle" fontSize="10" fill={room.light ? '#ffdd00' : '#666'}>
                                        {room.light ? '💡 СВЕТ ВКЛ' : 'Свет выкл'}
                                    </text>
                                </g>

                                {/* Датчик движения */}
                                <g>
                                    <circle cx={x + 40} cy={y + 140} r="12" fill={room.motion ? '#ff8800' : '#404040'} stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
                                    <text x={x + 40} y={y + 144} textAnchor="middle" fontSize="10" fill="white">👤</text>
                                    <text x={x + 40} y={y + 165} textAnchor="middle" fontSize="9" fill={room.motion ? '#ff8800' : '#666'}>
                                        {room.motion ? 'ДВИЖЕНИЕ' : 'Покой'}
                                    </text>
                                </g>

                                {/* Датчик температуры и влажности */}
                                <g>
                                    <rect x={x + width - 90} y={y + 120} width="70" height="50" rx="5" fill="#202020" stroke="#00d4ff" strokeWidth="1.5" />
                                    <text x={x + width - 55} y={y + 138} textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ff8844">
                                        {room.temp.toFixed(1)}°
                                    </text>
                                    <text x={x + width - 55} y={y + 155} textAnchor="middle" fontSize="10" fill="#00d4ff">
                                        {room.humidity.toFixed(0)}%
                                    </text>
                                    <text x={x + width - 55} y={y + 185} textAnchor="middle" fontSize="9" fill="#888">Климат</text>
                                </g>

                                {/* Индикатор подключения к воде */}
                                <g>
                                    <circle cx={x + width / 2} cy={y + height - 20} r="8" fill="#0088aa" stroke="#fff" strokeWidth="1" />
                                    <text x={x + width / 2} y={y + height - 17} textAnchor="middle" fontSize="8" fill="white">💧</text>
                                </g>
                            </g>
                        );
                    })}

                    {/* Входная дверь */}
                    <g>
                        <rect x="430" y="380" width="140" height="30" fill="#4a3520" stroke="#8b6f47" strokeWidth="2" rx="3" />
                        <circle cx="555" cy="395" r="4" fill={doorLocked ? '#00ff00' : '#ff8800'} className="animate-pulse" />
                        <text x="500" y="400" textAnchor="middle" fontSize="11" fontWeight="bold" fill="white">
                            {doorLocked ? '🔒 Закрыто' : '🔓 Открыто'}
                        </text>
                    </g>
                </svg>
            </div>

            {/* Нижняя панель параметров по комнатам */}
            <div className="grid grid-cols-3 gap-2">
                {rooms.map((room, i) => (
                    <div key={i} className="bg-gray-800/80 p-2 rounded border border-gray-700">
                        <h3 className="text-white text-xs font-bold mb-1">{room.name}</h3>
                        <div className="space-y-1 text-xs">
                            <div className={`flex justify-between p-1 rounded ${room.light ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-700 text-gray-400'}`}>
                                <span>💡 Свет</span><span>{room.light ? 'ВКЛ' : 'ВЫКЛ'}</span>
                            </div>
                            <div className={`flex justify-between p-1 rounded ${room.motion ? 'bg-orange-500/20 text-orange-400' : 'bg-gray-700 text-gray-400'}`}>
                                <span>👤 Движение</span><span>{room.motion ? 'ДА' : 'НЕТ'}</span>
                            </div>
                            <div className="flex justify-between text-gray-300 p-1 rounded bg-gray-700">
                                <span>🌡️ Темп:</span><span className="text-orange-400 font-mono">{room.temp.toFixed(1)}°C</span>
                            </div>
                            <div className="flex justify-between text-gray-300 p-1 rounded bg-gray-700">
                                <span>💧 Влаж:</span><span className="text-cyan-400 font-mono">{room.humidity.toFixed(0)}%</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Общая информация */}
            <div className="mt-2 bg-gray-800/50 p-2 rounded border border-gray-700 flex justify-between items-center text-xs">
                <div className="flex items-center gap-4">
                    <span className="text-cyan-400">Давление воды: <span className="font-mono font-bold">{waterPressure.toFixed(1)} бар</span></span>
                    <span className={alarmActive ? 'text-red-400 font-bold animate-pulse' : 'text-green-400'}>
                        {alarmActive ? '🚨 АВАРИЯ АКТИВНА' : '✓ Все системы в норме'}
                    </span>
                </div>
                <div className="text-gray-400">ООО «ЮЛИТ» | Умный дом</div>
            </div>
        </div>
    );
}