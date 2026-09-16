"use client";
import { useState, useEffect } from 'react';

type Room = {
    id: string;
    name: string;
    type: 'office' | 'meeting' | 'server' | 'kitchen' | 'storage' | 'corridor';
    lightOn: boolean;
    motionDetected: boolean;
    temp: number;
    humidity: number;
    co2: number;
    people: number;
};

export default function InteractiveScadaSmartOffice() {
    const [activeScreen, setActiveScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
    const [isDay, setIsDay] = useState(true);
    const [currentTime, setCurrentTime] = useState('');
    const [currentDate, setCurrentDate] = useState('');

    const [rooms, setRooms] = useState<Room[]>([
        { id: 'corridor', name: 'Коридор', type: 'corridor', lightOn: false, motionDetected: false, temp: 21.0, humidity: 45, co2: 400, people: 0 },
        { id: 'office1', name: 'Кабинет 1', type: 'office', lightOn: false, motionDetected: false, temp: 22.0, humidity: 48, co2: 450, people: 1 },
        { id: 'office2', name: 'Кабинет 2', type: 'office', lightOn: false, motionDetected: false, temp: 22.5, humidity: 47, co2: 460, people: 1 },
        { id: 'office3', name: 'Кабинет 3', type: 'office', lightOn: false, motionDetected: false, temp: 21.5, humidity: 46, co2: 440, people: 0 },
        { id: 'meeting', name: 'Переговорная', type: 'meeting', lightOn: false, motionDetected: false, temp: 22.0, humidity: 45, co2: 500, people: 0 },
        { id: 'server', name: 'Серверная', type: 'server', lightOn: true, motionDetected: false, temp: 18.0, humidity: 40, co2: 400, people: 0 },
        { id: 'kitchen', name: 'Кухня', type: 'kitchen', lightOn: false, motionDetected: false, temp: 23.0, humidity: 50, co2: 420, people: 0 },
        { id: 'storage', name: 'Кладовая/Туалет', type: 'storage', lightOn: false, motionDetected: false, temp: 21.0, humidity: 55, co2: 400, people: 0 },
    ]);

    const [ventilationOn, setVentilationOn] = useState(true);

    // Обновление времени и определение день/ночь (день с 8:00 до 20:00)
    useEffect(() => {
        const updateDateTime = () => {
            const now = new Date();
            const hour = now.getHours();
            setIsDay(hour >= 8 && hour < 20);
            setCurrentTime(now.toLocaleTimeString());
            setCurrentDate(now.toLocaleDateString());
        };
        updateDateTime();
        const timer = setInterval(updateDateTime, 1000);
        return () => clearInterval(timer);
    }, []);

    // Симуляция движения в кладовой/туалете каждые 2 минуты
    useEffect(() => {
        const storageTimer = setInterval(() => {
            // Человек заходит
            setRooms(prev => prev.map(room => {
                if (room.id === 'storage') {
                    return { ...room, motionDetected: true, people: 1, lightOn: true };
                }
                return room;
            }));

            // Через 30 секунд человек выходит
            setTimeout(() => {
                setRooms(prev => prev.map(room => {
                    if (room.id === 'storage') {
                        return { ...room, motionDetected: false, people: 0, lightOn: false };
                    }
                    return room;
                }));
            }, 30000);
        }, 120000); // 120000 мс = 2 минуты

        return () => clearInterval(storageTimer);
    }, []);

    // Общая симуляция среды и случайного движения в других комнатах
    useEffect(() => {
        const envTimer = setInterval(() => {
            setRooms(prev => prev.map(room => {
                if (room.id === 'storage') return room; // Управляется отдельным таймером

                // Случайное движение в офисах
                const motionChance = Math.random() > 0.95;
                const newMotion = motionChance ? !room.motionDetected : room.motionDetected;

                // Свет включается при движении, выключается через время без движения
                let newLight = room.lightOn;
                if (newMotion) {
                    newLight = true;
                } else if (room.lightOn && Math.random() > 0.9) {
                    newLight = false;
                }

                // Ночью свет принудительно выключается, если нет движения
                if (!isDay && !newMotion) {
                    newLight = false;
                }

                // Изменение параметров среды
                const newPeople = newMotion ? (room.people > 0 ? room.people : Math.floor(Math.random() * 2) + 1) : (Math.random() > 0.9 ? 0 : room.people);
                const tempChange = (Math.random() - 0.5) * 0.2;
                const humidityChange = (Math.random() - 0.5) * 0.5;
                const co2Change = newPeople > 0 ? Math.random() * 5 : -Math.random() * 2;

                return {
                    ...room,
                    motionDetected: newMotion,
                    lightOn: newLight,
                    people: Math.max(0, newPeople),
                    temp: Math.max(18, Math.min(28, room.temp + tempChange)),
                    humidity: Math.max(30, Math.min(70, room.humidity + humidityChange)),
                    co2: Math.max(400, Math.min(1000, room.co2 + co2Change)),
                };
            }));
        }, 2000);

        return () => clearInterval(envTimer);
    }, [isDay]);

    return (
        <div className="w-full bg-[#0a2540] p-3 rounded-lg font-sans">
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
                                className={`px-3 py-1.5 rounded text-xs font-bold flex-1 cursor-default select-none text-center ${activeScreen === screen ? 'bg-cyan-500 text-white shadow-lg' : 'bg-gray-700 text-gray-300'
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
                    <div className="flex justify-between items-center mb-2 bg-gray-800/50 p-2 rounded border border-gray-700">
                        <div className="flex items-center gap-4">
                            <span className={`text-sm font-bold ${isDay ? 'text-yellow-400' : 'text-blue-400'}`}>
                                {isDay ? '☀️ День' : '🌙 Ночь'}
                            </span>
                            <span className="text-cyan-400 text-sm font-bold">Вентиляция: {ventilationOn ? 'ВКЛ' : 'ВЫКЛ'}</span>
                        </div>
                        <div className="text-right">
                            <div className="text-white text-sm font-mono">{currentTime}</div>
                            <div className="text-gray-400 text-xs">{currentDate}</div>
                        </div>
                    </div>

                    <div className="relative w-full mb-2" style={{ height: '500px' }}>
                        <svg viewBox="0 0 1000 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                            <defs>
                                <linearGradient id="wallGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                    <stop offset="0%" stopColor="#1e293b" />
                                    <stop offset="100%" stopColor="#334155" />
                                </linearGradient>
                                <filter id="lightGlow">
                                    <feGaussianBlur stdDeviation="15" result="coloredBlur" />
                                    <feMerge>
                                        <feMergeNode in="coloredBlur" />
                                        <feMergeNode in="SourceGraphic" />
                                    </feMerge>
                                </filter>
                            </defs>

                            {/* Фон коридора */}
                            <rect x="400" y="50" width="200" height="400" fill="#0f172a" stroke="#475569" strokeWidth="2" />
                            <text x="500" y="250" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#475569" transform="rotate(-90 500 250)">КОРИДОР</text>

                            {/* Комнаты */}
                            {rooms.filter(r => r.id !== 'corridor').map((room) => {
                                let x = 0, y = 0, width = 0, height = 0;

                                // Левая сторона
                                if (room.id === 'office1') { x = 50; y = 50; width = 300; height = 120; }
                                else if (room.id === 'office2') { x = 50; y = 190; width = 300; height = 120; }
                                else if (room.id === 'office3') { x = 50; y = 330; width = 300; height = 120; }
                                // Правая сторона
                                else if (room.id === 'meeting') { x = 650; y = 50; width = 300; height = 120; }
                                else if (room.id === 'server') { x = 650; y = 190; width = 300; height = 120; }
                                else if (room.id === 'kitchen') { x = 650; y = 330; width = 140; height = 120; }
                                else if (room.id === 'storage') { x = 810; y = 330; width = 140; height = 120; }

                                return (
                                    <g key={room.id}>
                                        {/* Стены комнаты */}
                                        <rect x={x} y={y} width={width} height={height} fill="url(#wallGradient)" stroke={room.motionDetected ? '#fbbf24' : '#475569'} strokeWidth="2" rx="4" />

                                        {/* Свет */}
                                        {room.lightOn && (
                                            <circle cx={x + width / 2} cy={y + height / 2} r={width / 3} fill="#fbbf24" opacity="0.3" filter="url(#lightGlow)" />
                                        )}
                                        <circle cx={x + width / 2} cy={y + 20} r="6" fill={room.lightOn ? '#fbbf24' : '#475569'} stroke="#fff" strokeWidth="1" />

                                        {/* Название */}
                                        <text x={x + width / 2} y={y + 40} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e2e8f0">{room.name}</text>

                                        {/* Иконка движения / людей */}
                                        {room.motionDetected && (
                                            <text x={x + 20} y={y + height - 20} fontSize="20">🚶</text>
                                        )}
                                        {room.people > 0 && (
                                            <text x={x + width - 30} y={y + height - 20} fontSize="14" fill="#94a3b8">👥 {room.people}</text>
                                        )}

                                        {/* Параметры */}
                                        <text x={x + width / 2} y={y + height - 15} textAnchor="middle" fontSize="10" fill="#94a3b8">
                                            {room.temp.toFixed(1)}°C | {room.humidity.toFixed(0)}% | {room.co2.toFixed(0)}ppm
                                        </text>
                                    </g>
                                );
                            })}

                            {/* Вентиляционные каналы (схематично) */}
                            <path d="M 500 50 L 500 450" stroke="#0ea5e9" strokeWidth="4" strokeDasharray="8 4" opacity="0.5" />
                            {ventilationOn && (
                                <path d="M 500 50 L 500 450" stroke="#38bdf8" strokeWidth="2" strokeDasharray="8 4" className="animate-pulse" />
                            )}
                        </svg>
                    </div>

                    {/* Таблица параметров */}
                    <div className="bg-gray-800/80 rounded border border-gray-700 overflow-hidden">
                        <table className="w-full text-xs text-left">
                            <thead className="bg-gray-700/50 text-gray-300">
                                <tr>
                                    <th className="p-2">Помещение</th>
                                    <th className="p-2">Свет</th>
                                    <th className="p-2">Движение</th>
                                    <th className="p-2">Люди</th>
                                    <th className="p-2">Темп.</th>
                                    <th className="p-2">Влаж.</th>
                                    <th className="p-2">CO₂</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-700">
                                {rooms.map(room => (
                                    <tr key={room.id} className="hover:bg-gray-700/30 transition-colors">
                                        <td className="p-2 font-medium text-white">{room.name}</td>
                                        <td className="p-2">
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${room.lightOn ? 'bg-yellow-500/20 text-yellow-400' : 'bg-gray-600/50 text-gray-400'}`}>
                                                {room.lightOn ? 'ВКЛ' : 'ВЫКЛ'}
                                            </span>
                                        </td>
                                        <td className="p-2">
                                            {room.motionDetected ? <span className="text-green-400">● Да</span> : <span className="text-gray-500">○ Нет</span>}
                                        </td>
                                        <td className="p-2 text-gray-300">{room.people}</td>
                                        <td className={`p-2 font-mono ${room.temp > 24 ? 'text-red-400' : 'text-cyan-400'}`}>{room.temp.toFixed(1)}°C</td>
                                        <td className="p-2 font-mono text-cyan-400">{room.humidity.toFixed(0)}%</td>
                                        <td className={`p-2 font-mono ${room.co2 > 800 ? 'text-red-400' : room.co2 > 600 ? 'text-yellow-400' : 'text-green-400'}`}>
                                            {room.co2.toFixed(0)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </>
            )}
        </div>
    );
}