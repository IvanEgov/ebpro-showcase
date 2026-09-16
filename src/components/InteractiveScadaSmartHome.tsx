"use client";
import { useState, useEffect } from 'react';

type Room = {
    id: string;
    name: string;
    type: 'office' | 'meeting' | 'server' | 'closet' | 'ventilation' | 'corridor';
    lightOn: boolean;
    motionDetected: boolean;
    temp: number;
    co2: number;
    people: number;
};

export default function InteractiveScadaSmartHome() {
    const [activeScreen, setActiveScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
    const [isDay, setIsDay] = useState(true);
    const [currentTime, setCurrentTime] = useState('');

    const [rooms, setRooms] = useState<Room[]>([
        { id: 'corridor', name: 'Коридор', type: 'corridor', lightOn: true, motionDetected: false, temp: 21.0, co2: 400, people: 0 },
        { id: 'office1', name: 'Кабинет 1', type: 'office', lightOn: false, motionDetected: false, temp: 22.0, co2: 450, people: 0 },
        { id: 'office2', name: 'Кабинет 2', type: 'office', lightOn: false, motionDetected: false, temp: 22.5, co2: 460, people: 0 },
        { id: 'office3', name: 'Кабинет 3', type: 'office', lightOn: false, motionDetected: false, temp: 21.5, co2: 440, people: 0 },
        { id: 'office4', name: 'Кабинет 4', type: 'office', lightOn: false, motionDetected: false, temp: 22.0, co2: 450, people: 0 },
        { id: 'meeting', name: 'Переговорная', type: 'meeting', lightOn: false, motionDetected: false, temp: 22.0, co2: 500, people: 0 },
        { id: 'closet', name: 'Кладовая / Туалет', type: 'closet', lightOn: false, motionDetected: false, temp: 21.0, co2: 450, people: 0 },
        { id: 'server', name: 'Серверная', type: 'server', lightOn: true, motionDetected: false, temp: 18.0, co2: 400, people: 0 },
        { id: 'ventilation', name: 'Вентиляция', type: 'ventilation', lightOn: false, motionDetected: false, temp: 20.0, co2: 400, people: 0 },
    ]);

    // 1. Привязка к времени (День/Ночь)
    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString());
            const hour = now.getHours();
            // День с 8:00 до 20:00
            setIsDay(hour >= 8 && hour < 20);
        };
        updateTime();
        const interval = setInterval(updateTime, 1000);
        return () => clearInterval(interval);
    }, []);

    // Обновление света при смене дня/ночи
    useEffect(() => {
        setRooms(prev => prev.map(room => {
            if (room.id === 'server') return room; // В серверной свет всегда включен
            return { ...room, lightOn: isDay ? (room.people > 0) : false };
        }));
    }, [isDay]);

    // 2. Кладовая/Туалет: каждые 2 минуты заходит человек и включает свет
    useEffect(() => {
        const closetInterval = setInterval(() => {
            setRooms(prev => prev.map(room => {
                if (room.id === 'closet') {
                    return { ...room, motionDetected: true, lightOn: true, people: 1 };
                }
                return room;
            }));

            // Через 30 секунд человек выходит, свет гаснет
            setTimeout(() => {
                setRooms(prev => prev.map(room => {
                    if (room.id === 'closet') {
                        return { ...room, motionDetected: false, lightOn: false, people: 0 };
                    }
                    return room;
                }));
            }, 30000);
        }, 120000); // 120 000 мс = 2 минуты

        return () => clearInterval(closetInterval);
    }, []);

    // 3. Случайное движение в остальных комнатах (очень редкое)
    useEffect(() => {
        const randomMotionInterval = setInterval(() => {
            setRooms(prev => prev.map(room => {
                if (room.id === 'closet' || room.id === 'corridor' || room.id === 'server') return room;

                // 0.5% шанс каждые 5 секунд (в среднем 1 событие раз в 16 минут на комнату)
                if (Math.random() < 0.005) {
                    const hasPeople = room.people > 0;
                    const newPeople = hasPeople ? 0 : Math.floor(Math.random() * 2) + 1;
                    const newLightState = isDay ? (newPeople > 0) : false;

                    return {
                        ...room,
                        motionDetected: true,
                        lightOn: newLightState,
                        people: newPeople
                    };
                }

                // Сброс датчика движения, если никого нет
                if (room.motionDetected && room.people === 0) {
                    return { ...room, motionDetected: false };
                }

                return room;
            }));
        }, 5000);

        return () => clearInterval(randomMotionInterval);
    }, [isDay]);

    // 4. Плавное изменение температуры и CO2
    useEffect(() => {
        const envInterval = setInterval(() => {
            setRooms(prev => prev.map(room => {
                let tempChange = (Math.random() - 0.5) * 0.1;
                let co2Change = room.people > 0 ? Math.floor(Math.random() * 5) + 1 : -Math.floor(Math.random() * 2);

                return {
                    ...room,
                    temp: Math.max(16, Math.min(28, room.temp + tempChange)),
                    co2: Math.max(400, Math.min(1000, room.co2 + co2Change))
                };
            }));
        }, 3000);
        return () => clearInterval(envInterval);
    }, []);

    return (
        <div className="w-full bg-[#0a2540] p-3 rounded-lg font-sans">
            <div className="flex items-start justify-center gap-4 mb-3">
                <div className="bg-gray-600 rounded p-2 min-w-[140px]">
                    <div className="text-white text-xs text-center mb-1 font-bold">Режим</div>
                    <div className="w-full py-1.5 rounded text-xs font-bold bg-green-500 text-white text-center shadow-lg cursor-default select-none">
                        Умный Офис
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
                                {screen === 'mode' ? 'План' : screen === 'settings' ? 'Настройка' : 'Архив'}
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
                            <span className="text-cyan-400 font-mono">{currentTime}</span>
                        </div>
                        <div className="text-xs text-gray-400">
                            Автоматическое управление освещением и климатом
                        </div>
                    </div>

                    <div className="relative w-full mb-2" style={{ height: '500px' }}>
                        <svg viewBox="0 0 800 500" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                            {/* Фон */}
                            <rect x="0" y="0" width="800" height="500" fill="#0f172a" />

                            {/* Коридор */}
                            <rect x="40" y="190" width="720" height="100" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                            <text x="400" y="245" textAnchor="middle" fontSize="18" fontWeight="bold" fill="#64748b" letterSpacing="4">КОРИДОР</text>

                            {/* Комнаты */}
                            {rooms.filter(r => r.id !== 'corridor').map((room) => {
                                let x = 40, y = 40;
                                if (room.id === 'office1') { x = 40; y = 40; }
                                if (room.id === 'office2') { x = 220; y = 40; }
                                if (room.id === 'meeting') { x = 400; y = 40; }
                                if (room.id === 'server') { x = 580; y = 40; }

                                if (room.id === 'office3') { x = 40; y = 310; }
                                if (room.id === 'office4') { x = 220; y = 310; }
                                if (room.id === 'closet') { x = 400; y = 310; }
                                if (room.id === 'ventilation') { x = 580; y = 310; }

                                const width = 160;
                                const height = 130;

                                return (
                                    <g key={room.id}>
                                        {/* Пол комнаты */}
                                        <rect
                                            x={x} y={y} width={width} height={height}
                                            fill={room.lightOn ? '#334155' : '#0f172a'}
                                            stroke={room.motionDetected ? '#22c55e' : '#475569'}
                                            strokeWidth={room.motionDetected ? 3 : 2}
                                            rx="4"
                                            className="transition-all duration-500"
                                        />

                                        {/* Название комнаты */}
                                        <text x={x + width / 2} y={y + 25} textAnchor="middle" fontSize="14" fontWeight="bold" fill="#e2e8f0">
                                            {room.name}
                                        </text>

                                        {/* Лампочка */}
                                        <circle cx={x + width - 25} cy={y + 20} r="6" fill={room.lightOn ? '#fbbf24' : '#475569'} className="transition-colors duration-300" />
                                        {room.lightOn && <circle cx={x + width - 25} cy={y + 20} r="14" fill="#fbbf24" opacity="0.2" className="animate-pulse" />}

                                        {/* Датчик движения */}
                                        <g transform={`translate(${x + 25}, ${y + 25})`}>
                                            {room.motionDetected && (
                                                <>
                                                    <circle r="8" fill="#22c55e" className="animate-ping" />
                                                    <circle r="8" fill="#22c55e" />
                                                </>
                                            )}
                                            <path d="M -4 -2 L 0 -6 L 4 -2 L 4 4 L 0 8 L -4 4 Z" fill="#94a3b8" />
                                        </g>

                                        {/* Люди */}
                                        {room.people > 0 && (
                                            <text x={x + 25} y={y + 65} fontSize="24" textAnchor="middle">👥</text>
                                        )}

                                        {/* Статистика */}
                                        <text x={x + width / 2} y={y + 85} textAnchor="middle" fontSize="12" fill="#94a3b8">
                                            🌡️ {room.temp.toFixed(1)}°C
                                        </text>
                                        <text x={x + width / 2} y={y + 105} textAnchor="middle" fontSize="12" fill={room.co2 > 800 ? '#f87171' : '#94a3b8'}>
                                            💨 {room.co2} ppm
                                        </text>

                                        {/* Дверь в коридор */}
                                        <rect
                                            x={x + width / 2 - 20}
                                            y={y < 200 ? y + height - 5 : y - 5}
                                            width="40" height="10"
                                            fill="#0f172a"
                                        />
                                    </g>
                                );
                            })}
                        </svg>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-gray-800/80 p-2 rounded border border-gray-700">
                                <div className="flex justify-between items-center mb-1">
                                    <h3 className="text-white text-xs font-bold">{room.name}</h3>
                                    <div className="flex gap-1">
                                        {room.lightOn && <span className="text-yellow-400 text-xs">💡</span>}
                                        {room.motionDetected && <span className="text-green-400 text-xs animate-pulse">📡</span>}
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-1 text-xs">
                                    <div className="text-gray-400">Люди:</div>
                                    <div className="text-cyan-400 font-mono">{room.people}</div>
                                    <div className="text-gray-400">Темп.:</div>
                                    <div className="text-cyan-400 font-mono">{room.temp.toFixed(1)}°C</div>
                                    <div className="text-gray-400">CO₂:</div>
                                    <div className={`font-mono ${room.co2 > 800 ? 'text-red-400' : 'text-cyan-400'}`}>{room.co2} ppm</div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {activeScreen === 'settings' && (
                <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h2 className="text-lg font-bold mb-3">Настройки офиса</h2>
                    <div className="space-y-3 text-sm">
                        <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                            <span>Автоматическое освещение (День/Ночь)</span>
                            <span className="text-green-400 font-bold">ВКЛ</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                            <span>Датчики движения в кабинетах</span>
                            <span className="text-green-400 font-bold">ВКЛ</span>
                        </div>
                        <div className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
                            <span>Вентиляция по расписанию</span>
                            <span className="text-green-400 font-bold">08:00 - 20:00</span>
                        </div>
                    </div>
                </div>
            )}

            {activeScreen === 'archive' && (
                <div className="bg-gray-800 p-4 rounded-lg text-white">
                    <h2 className="text-lg font-bold mb-3">Архив событий</h2>
                    <table className="w-full text-xs">
                        <thead>
                            <tr className="border-b border-gray-700">
                                <th className="text-left py-2">Время</th>
                                <th className="text-left py-2">Комната</th>
                                <th className="text-left py-2">Событие</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr className="border-b border-gray-700">
                                <td className="py-2 text-gray-400">{currentTime}</td>
                                <td className="py-2">Кладовая / Туалет</td>
                                <td className="py-2 text-green-400">Обнаружено движение</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-2 text-gray-400">{currentTime}</td>
                                <td className="py-2">Кабинет 2</td>
                                <td className="py-2 text-yellow-400">Свет выключен (нет движения)</td>
                            </tr>
                            <tr className="border-b border-gray-700">
                                <td className="py-2 text-gray-400">{currentTime}</td>
                                <td className="py-2">Серверная</td>
                                <td className="py-2 text-blue-400">Температура в норме (18.0°C)</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}