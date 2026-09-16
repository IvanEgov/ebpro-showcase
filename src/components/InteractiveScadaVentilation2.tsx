"use client";
import { useState, useEffect } from 'react';

export default function InteractiveScadaVentilation2() {
    const [outdoorTemp, setOutdoorTemp] = useState(5.0);
    const [supplyTemp, setSupplyTemp] = useState(20.0);
    const [exhaustTemp, setExhaustTemp] = useState(22.0);
    const [roomTemp, setRoomTemp] = useState(22.5);
    const [coLevel, setCoLevel] = useState(500);
    const [pressure, setPressure] = useState(150);
    const [airFlow, setAirFlow] = useState(2500);
    const [filterStatus, setFilterStatus] = useState<'clean' | 'dirty' | 'alarm'>('clean');

    // Задвижки в % (регулируются по CO)
    const [supplyValve, setSupplyValve] = useState(60);
    const [exhaustValve, setExhaustValve] = useState(60);
    const [bypassValve, setBypassValve] = useState(10);

    // Сезон по температуре: <= +6 = зима
    const season = outdoorTemp <= 6 ? 'winter' : 'summer';

    // Вентиляторы ВСЕГДА включены
    const supplyFanOn = true;
    const exhaustFanOn = true;
    const recuperatorOn = true;

    useEffect(() => {
        const interval = setInterval(() => {
            const month = new Date().getMonth();
            const baseTemps = [-22, -22, -22, -8, 4, 11, 19, 21, 19, 11, 4, -8];
            const base = baseTemps[month];

            // Наружная температура ±1°C
            setOutdoorTemp(prev => {
                const target = base + (Math.random() - 0.5) * 2;
                return prev + (target - prev) * 0.1;
            });

            // CO: 500 ± 600 ppm
            setCoLevel(prev => {
                const target = 500 + (Math.random() - 0.5) * 1200;
                const clamped = Math.max(100, Math.min(1100, target));
                return prev + (clamped - prev) * 0.15;
            });

            // Задвижки регулируются по CO
            // CO < 400 → 40%, CO > 800 → 100%, между → пропорционально
            setSupplyValve(prev => {
                const target = coLevel < 400 ? 40 : coLevel > 800 ? 100 : 40 + ((coLevel - 400) / 400) * 60;
                return prev + (target - prev) * 0.1 + (Math.random() - 0.5) * 2;
            });
            setExhaustValve(prev => {
                const target = coLevel < 400 ? 40 : coLevel > 800 ? 100 : 40 + ((coLevel - 400) / 400) * 60;
                return prev + (target - prev) * 0.1 + (Math.random() - 0.5) * 2;
            });
            setBypassValve(prev => {
                const target = coLevel > 700 ? 35 : 10;
                return prev + (target - prev) * 0.1 + (Math.random() - 0.5) * 1;
            });

            // Температуры
            if (season === 'winter') {
                setSupplyTemp(prev => Math.min(42, prev + 0.2 + (Math.random() - 0.5) * 0.3));
            } else {
                setSupplyTemp(prev => Math.max(14, prev - 0.2 + (Math.random() - 0.5) * 0.3));
            }
            setExhaustTemp(prev => 22 + (Math.random() - 0.5) * 0.5);
            setRoomTemp(prev => {
                let next = prev + (Math.random() - 0.5) * 0.15;
                if (next < 22.0) next = 22.0 + Math.random() * 0.1;
                if (next > 23.0) next = 23.0 - Math.random() * 0.1;
                return next;
            });

            setPressure(prev => 150 + (Math.random() - 0.5) * 20);
            setAirFlow(prev => 2500 + (Math.random() - 0.5) * 300);

            if (Math.random() > 0.995) setFilterStatus(prev => prev === 'clean' ? 'dirty' : 'clean');
            if (Math.random() > 0.999) setFilterStatus('alarm');
        }, 1000);

        return () => clearInterval(interval);
    }, [season, coLevel]);

    const getFilterColor = () => filterStatus === 'clean' ? '#00ff00' : filterStatus === 'dirty' ? '#ffaa00' : '#ff0000';
    const getFilterText = () => filterStatus === 'clean' ? 'ЧИСТЫЙ' : filterStatus === 'dirty' ? 'ЗАГРЯЗНЁН' : 'АВАРИЯ';
    const getCoColor = () => coLevel < 400 ? '#00ff00' : coLevel < 700 ? '#ffaa00' : '#ff0000';
    const getCoText = () => coLevel < 400 ? 'НОРМА' : coLevel < 700 ? 'ВНИМАНИЕ' : 'ТРЕВОГА';

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
                    <span className={`font-bold ${season === 'winter' ? 'text-cyan-400' : 'text-orange-400'}`}>
                        {season === 'winter' ? '❄️ ЗИМА' : '☀️ ЛЕТО'}
                    </span>
                    <span className="text-cyan-400 font-bold">Улица: {outdoorTemp.toFixed(1)}°C</span>
                    <span className="text-green-400 font-bold">Комната: {roomTemp.toFixed(1)}°C</span>
                    <span className="font-bold" style={{ color: getCoColor() }}>CO: {coLevel.toFixed(0)} ppm ({getCoText()})</span>
                </div>
                <span className="bg-green-500 text-white text-xs px-2 py-1 rounded font-bold animate-pulse">АВТО</span>
            </div>

            {/* SVG Схема */}
            <div className="relative w-full mb-2" style={{ height: '520px' }}>
                <svg viewBox="0 0 1200 520" className="w-full h-full" preserveAspectRatio="xMidYMid meet">
                    <defs>
                        <linearGradient id="ductG" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#4a5568" /><stop offset="50%" stopColor="#718096" /><stop offset="100%" stopColor="#4a5568" />
                        </linearGradient>
                        <linearGradient id="heaterG" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#742a2a" /><stop offset="50%" stopColor="#e53e3e" /><stop offset="100%" stopColor="#742a2a" />
                        </linearGradient>
                        <linearGradient id="coolerG" x1="0%" y1="0%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="#2a4365" /><stop offset="50%" stopColor="#4299e1" /><stop offset="100%" stopColor="#2a4365" />
                        </linearGradient>
                        <linearGradient id="recupG" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="#2d3748" /><stop offset="50%" stopColor="#4a5568" /><stop offset="100%" stopColor="#2d3748" />
                        </linearGradient>
                    </defs>

                    {/* ================================================================ */}
                    {/* ТРУБЫ (рисуются ПЕРВЫМИ — оборудование будет поверх) */}
                    {/* ================================================================ */}

                    {/* === ПРИТОЧНАЯ ЛИНИЯ (синяя): Улица → Задвижка → Фильтр → Рекуператор → Калорифер → Помещение === */}
                    {/* Улица → Задвижка притока */}
                    <path d="M 80 140 L 160 140" stroke="#00b4d8" strokeWidth="14" fill="none" strokeLinecap="round" />
                    {/* Задвижка притока → Фильтр */}
                    <path d="M 230 140 L 300 140" stroke="#00b4d8" strokeWidth="14" fill="none" strokeLinecap="round" />
                    {/* Фильтр → Рекуператор (вход притока — верхний левый) */}
                    <path d="M 420 140 L 500 140 L 500 200" stroke="#00b4d8" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Рекуператор (выход притока — верхний правый) → Калорифер/Кондиционер */}
                    <path d="M 620 200 L 620 140 L 700 140" stroke="#00b4d8" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Калорифер → Помещение */}
                    <path d="M 850 140 L 1020 140" stroke="#00b4d8" strokeWidth="14" fill="none" strokeLinecap="round" />

                    {/* === ВЫТЯЖНАЯ ЛИНИЯ (красная): Помещение → Рекуператор → Задвижка → Вентилятор → Улица === */}
                    {/* Помещение → Рекуператор (вход вытяжки — нижний правый) */}
                    <path d="M 1020 380 L 620 380 L 620 320" stroke="#ff6b6b" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Рекуператор (выход вытяжки — нижний левый) → Задвижка вытяжки */}
                    <path d="M 500 320 L 500 380 L 370 380" stroke="#ff6b6b" strokeWidth="14" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                    {/* Задвижка вытяжки → Вытяжной вентилятор */}
                    <path d="M 300 380 L 230 380" stroke="#ff6b6b" strokeWidth="14" fill="none" strokeLinecap="round" />
                    {/* Вытяжной вентилятор → Улица */}
                    <path d="M 160 380 L 80 380" stroke="#ff6b6b" strokeWidth="14" fill="none" strokeLinecap="round" />

                    {/* === БАЙПАСНАЯ ТРУБА (обвод рекуператора) === */}
                    <path d="M 500 140 L 460 140 L 460 380 L 500 380" stroke="#888" strokeWidth="6" fill="none" strokeDasharray="8,4" strokeLinecap="round" strokeLinejoin="round" />

                    {/* ================================================================ */}
                    {/* ОБОРУДОВАНИЕ (поверх труб) */}
                    {/* ================================================================ */}

                    {/* === ВХОД С УЛИЦЫ (приток) === */}
                    <g>
                        <rect x="20" y="110" width="60" height="60" rx="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
                        <text x="50" y="135" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">УЛИЦА</text>
                        <text x="50" y="155" textAnchor="middle" fontSize="13" fontWeight="bold" fill="#00d4ff">{outdoorTemp.toFixed(1)}°</text>
                    </g>

                    {/* === ЗАДВИЖКА ПРИТОКА (с % по CO) === */}
                    <g>
                        <rect x="160" y="110" width="70" height="60" rx="6" fill="#2d3748" stroke="#00d4ff" strokeWidth="2" />
                        {/* Заслонка поворачивается по % */}
                        <g style={{ transformOrigin: '195px 140px', transform: `rotate(${90 - supplyValve * 0.9}deg)` }}>
                            <rect x="175" y="135" width="40" height="10" rx="2" fill="#00d4ff" stroke="#fff" strokeWidth="1" />
                        </g>
                        <text x="195" y="100" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ЗАДВИЖКА</text>
                        <text x="195" y="185" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#00d4ff">{supplyValve.toFixed(0)}%</text>
                        <text x="195" y="198" textAnchor="middle" fontSize="8" fill="#888">приток</text>
                    </g>

                    {/* === ФИЛЬТР === */}
                    <g>
                        <rect x="300" y="105" width="120" height="70" rx="6" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
                        {[320, 340, 360, 380, 400].map((x, i) => (
                            <line key={i} x1={x} y1="115" x2={x} y2="165" stroke={getFilterColor()} strokeWidth="2" />
                        ))}
                        <circle cx="360" cy="95" r="6" fill={getFilterColor()} stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
                        <text x="360" y="195" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ФИЛЬТР</text>
                        <text x="360" y="208" textAnchor="middle" fontSize="9" fill={getFilterColor()}>{getFilterText()}</text>
                    </g>

                    {/* === РЕКУПЕРАТОР (центр, 4 патрубка) === */}
                    <g>
                        <rect x="490" y="200" width="140" height="120" rx="10" fill="url(#recupG)" stroke="#4a5568" strokeWidth="3" />
                        {/* Пластины теплообменника */}
                        {[510, 530, 550, 570, 590, 610].map((x, i) => (
                            <line key={i} x1={x} y1="210" x2={x} y2="310" stroke="#5a6578" strokeWidth="2" />
                        ))}
                        {/* Стрелки теплообмена */}
                        <path d="M 530 240 L 560 260 L 530 280" stroke="#ffaa00" strokeWidth="2" fill="none" className="animate-pulse" />
                        <path d="M 590 280 L 560 260 L 590 240" stroke="#00b4d8" strokeWidth="2" fill="none" className="animate-pulse" />
                        {/* Индикатор */}
                        <circle cx="560" cy="195" r="6" fill={recuperatorOn ? '#00ff00' : '#ff0000'} stroke="#fff" strokeWidth="1.5" className="animate-pulse" />
                        <text x="560" y="265" textAnchor="middle" fontSize="12" fontWeight="bold" fill="white">РЕКУПЕРАТОР</text>
                        <text x="560" y="340" textAnchor="middle" fontSize="9" fill="#00ff00">ВСЕГДА ВКЛ</text>
                        {/* Подписи патрубков */}
                        <text x="500" y="195" textAnchor="middle" fontSize="8" fill="#00b4d8">вход прит.</text>
                        <text x="620" y="195" textAnchor="middle" fontSize="8" fill="#00b4d8">выход прит.</text>
                        <text x="620" y="335" textAnchor="middle" fontSize="8" fill="#ff6b6b">вход выт.</text>
                        <text x="500" y="335" textAnchor="middle" fontSize="8" fill="#ff6b6b">выход выт.</text>
                    </g>

                    {/* === БАЙПАСНАЯ ЗАДВИЖКА === */}
                    <g>
                        <rect x="435" y="245" width="50" height="30" rx="4" fill="#2d3748" stroke="#888" strokeWidth="1.5" />
                        <g style={{ transformOrigin: '460px 260px', transform: `rotate(${90 - bypassValve * 0.9}deg)` }}>
                            <rect x="445" y="256" width="30" height="8" rx="2" fill="#888" stroke="#fff" strokeWidth="1" />
                        </g>
                        <text x="460" y="290" textAnchor="middle" fontSize="8" fill="#888">Байпас {bypassValve.toFixed(0)}%</text>
                    </g>

                    {/* === КАЛОРИФЕР (зима) / КОНДИЦИОНЕР (лето) === */}
                    <g>
                        {season === 'winter' ? (
                            <>
                                <rect x="700" y="105" width="150" height="70" rx="8" fill="url(#heaterG)" stroke="#742a2a" strokeWidth="2" />
                                {[720, 740, 760, 780, 800, 820, 840].map((x, i) => (
                                    <path key={i} d={`M ${x} 115 Q ${x + 5} 140 ${x} 165`} stroke="#ffaa00" strokeWidth="2" fill="none" className="animate-pulse" />
                                ))}
                                <text x="775" y="195" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#e53e3e">КАЛОРИФЕР</text>
                                <text x="775" y="208" textAnchor="middle" fontSize="9" fill="#ffaa00">Водяной нагрев</text>
                            </>
                        ) : (
                            <>
                                <rect x="700" y="105" width="150" height="70" rx="8" fill="url(#coolerG)" stroke="#2a4365" strokeWidth="2" />
                                <text x="775" y="145" textAnchor="middle" fontSize="28" fill="#fff" className="animate-pulse">❄️</text>
                                <text x="775" y="195" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#4299e1">КОНДИЦИОНЕР</text>
                                <text x="775" y="208" textAnchor="middle" fontSize="9" fill="#63b3ed">Охлаждение</text>
                            </>
                        )}
                    </g>

                    {/* === ПОМЕЩЕНИЕ === */}
                    <g>
                        <rect x="1020" y="100" width="150" height="320" rx="10" fill="#1a365d" stroke="#2b6cb0" strokeWidth="3" />
                        <text x="1095" y="130" textAnchor="middle" fontSize="14" fontWeight="bold" fill="white">ПОМЕЩЕНИЕ</text>
                        <text x="1095" y="160" textAnchor="middle" fontSize="22" fontWeight="bold" fill="#48bb78">{roomTemp.toFixed(1)}°C</text>
                        {/* Приточная стрелка (вход сверху) */}
                        <path d="M 1020 140 L 1040 135 L 1040 145 Z" fill="#00b4d8" />
                        <text x="1060" y="145" fontSize="9" fill="#00b4d8">приток</text>
                        {/* Вытяжная стрелка (выход снизу) */}
                        <path d="M 1040 375 L 1040 385 L 1020 380 Z" fill="#ff6b6b" />
                        <text x="1060" y="385" fontSize="9" fill="#ff6b6b">вытяжка</text>
                        {/* Люди */}
                        {[1060, 1095, 1130].map((cx, i) => (
                            <g key={i}>
                                <circle cx={cx} cy="280" r="8" fill="#a0aec0" />
                                <rect x={cx - 5} y="290" width="10" height="20" rx="2" fill="#a0aec0" />
                            </g>
                        ))}
                        {/* Датчик CO в помещении */}
                        <rect x="1045" y="210" width="100" height="50" rx="6" fill="#1a202c" stroke={getCoColor()} strokeWidth="2" />
                        <text x="1095" y="230" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#888">CO датчик</text>
                        <text x="1095" y="250" textAnchor="middle" fontSize="16" fontWeight="bold" fill={getCoColor()}>{coLevel.toFixed(0)} ppm</text>
                    </g>

                    {/* === ВЫХОД НА УЛИЦУ (вытяжка) === */}
                    <g>
                        <rect x="20" y="350" width="60" height="60" rx="8" fill="#2d3748" stroke="#4a5568" strokeWidth="2" />
                        <text x="50" y="375" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ВЫБРОС</text>
                        <text x="50" y="395" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ff6b6b">{exhaustTemp.toFixed(1)}°</text>
                    </g>

                    {/* === ЗАДВИЖКА ВЫТЯЖКИ (с % по CO) === */}
                    <g>
                        <rect x="300" y="350" width="70" height="60" rx="6" fill="#2d3748" stroke="#ff8844" strokeWidth="2" />
                        <g style={{ transformOrigin: '335px 380px', transform: `rotate(${90 - exhaustValve * 0.9}deg)` }}>
                            <rect x="315" y="375" width="40" height="10" rx="2" fill="#ff8844" stroke="#fff" strokeWidth="1" />
                        </g>
                        <text x="335" y="340" textAnchor="middle" fontSize="10" fontWeight="bold" fill="white">ЗАДВИЖКА</text>
                        <text x="335" y="425" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ff8844">{exhaustValve.toFixed(0)}%</text>
                        <text x="335" y="438" textAnchor="middle" fontSize="8" fill="#888">вытяжка</text>
                    </g>

                    {/* === ПРИТОЧНЫЙ ВЕНТИЛЯТОР (всегда ВКЛ) === */}
                    <g>
                        <circle cx="120" cy="140" r="30" fill="#2d3748" stroke="#4a5568" strokeWidth="3" />
                        <circle cx="120" cy="140" r="22" fill="#1a202c" />
                        <g className="animate-spin" style={{ transformOrigin: '120px 140px', animationDuration: '0.6s' }}>
                            <path d="M 120 122 L 126 140 L 120 158 L 114 140 Z" fill="#00ff00" />
                            <path d="M 102 140 L 120 134 L 138 140 L 120 146 Z" fill="#00ff00" opacity="0.7" />
                        </g>
                        <circle cx="120" cy="140" r="6" fill="#00ff00" stroke="#fff" strokeWidth="1.5" />
                        <text x="120" y="185" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#00ff00">ПРИТОЧНЫЙ</text>
                        <text x="120" y="198" textAnchor="middle" fontSize="9" fill="#00ff00">ВЕНТИЛЯТОР</text>
                    </g>

                    {/* === ВЫТЯЖНОЙ ВЕНТИЛЯТОР (всегда ВКЛ) === */}
                    <g>
                        <circle cx="195" cy="380" r="30" fill="#2d3748" stroke="#4a5568" strokeWidth="3" />
                        <circle cx="195" cy="380" r="22" fill="#1a202c" />
                        <g className="animate-spin" style={{ transformOrigin: '195px 380px', animationDuration: '0.6s' }}>
                            <path d="M 195 362 L 201 380 L 195 398 L 189 380 Z" fill="#ff8844" />
                            <path d="M 177 380 L 195 374 L 213 380 L 195 386 Z" fill="#ff8844" opacity="0.7" />
                        </g>
                        <circle cx="195" cy="380" r="6" fill="#00ff00" stroke="#fff" strokeWidth="1.5" />
                        <text x="195" y="425" textAnchor="middle" fontSize="10" fontWeight="bold" fill="#ff8844">ВЫТЯЖНОЙ</text>
                        <text x="195" y="438" textAnchor="middle" fontSize="9" fill="#ff8844">ВЕНТИЛЯТОР</text>
                    </g>

                    {/* === ДАТЧИКИ НА ТРУБАХ === */}
                    {/* Температура притока */}
                    <g>
                        <circle cx="660" cy="100" r="18" fill="#1a202c" stroke="#00d4ff" strokeWidth="2" />
                        <text x="660" y="97" textAnchor="middle" fontSize="8" fill="#888">Tприт</text>
                        <text x="660" y="108" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#00d4ff">{supplyTemp.toFixed(1)}°</text>
                    </g>
                    {/* Температура вытяжки */}
                    <g>
                        <circle cx="660" cy="420" r="18" fill="#1a202c" stroke="#ff6b6b" strokeWidth="2" />
                        <text x="660" y="417" textAnchor="middle" fontSize="8" fill="#888">Tвыт</text>
                        <text x="660" y="428" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#ff6b6b">{exhaustTemp.toFixed(1)}°</text>
                    </g>
                    {/* Давление */}
                    <g>
                        <circle cx="900" cy="100" r="22" fill="#1a202c" stroke="#ed8936" strokeWidth="2" />
                        <text x="900" y="96" textAnchor="middle" fontSize="8" fill="#888">ΔP</text>
                        <text x="900" y="108" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#ed8936">{pressure.toFixed(0)}</text>
                        <text x="900" y="130" textAnchor="middle" fontSize="8" fill="#888">Па</text>
                    </g>
                    {/* Расход */}
                    <g>
                        <rect x="880" y="420" width="80" height="35" rx="5" fill="#1a202c" stroke="#48bb78" strokeWidth="2" />
                        <text x="920" y="435" textAnchor="middle" fontSize="8" fill="#888">Расход</text>
                        <text x="920" y="448" textAnchor="middle" fontSize="11" fontWeight="bold" fill="#48bb78">{airFlow.toFixed(0)} м³/ч</text>
                    </g>

                    {/* === СТРЕЛКИ ПОТОКА === */}
                    {[100, 260, 450, 750, 950].map((x, i) => (
                        <path key={`s${i}`} d={`M ${x} 135 L ${x + 12} 140 L ${x} 145`} fill="#00b4d8" opacity="0.7" className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                    {[950, 750, 450, 260].map((x, i) => (
                        <path key={`e${i}`} d={`M ${x} 375 L ${x - 12} 380 L ${x} 385`} fill="#ff6b6b" opacity="0.7" className="animate-pulse" style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                </svg>
            </div>

            {/* Нижняя панель */}
            <div className="grid grid-cols-4 gap-2">
                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Оборудование</h3>
                    <div className="space-y-1 text-xs">
                        <div className="flex justify-between p-1.5 rounded bg-green-500/10 border border-green-500/30">
                            <span className="text-green-400">Приточный вент.</span><span className="text-green-400 font-bold">● ВКЛ</span>
                        </div>
                        <div className="flex justify-between p-1.5 rounded bg-green-500/10 border border-green-500/30">
                            <span className="text-green-400">Вытяжной вент.</span><span className="text-green-400 font-bold">● ВКЛ</span>
                        </div>
                        <div className="flex justify-between p-1.5 rounded bg-green-500/10 border border-green-500/30">
                            <span className="text-green-400">Рекуператор</span><span className="text-green-400 font-bold">● ВКЛ</span>
                        </div>
                        <div className={`flex justify-between p-1.5 rounded border ${season === 'winter' ? 'bg-red-500/10 border-red-500/30' : 'bg-blue-500/10 border-blue-500/30'}`}>
                            <span className={season === 'winter' ? 'text-red-400' : 'text-blue-400'}>{season === 'winter' ? 'Калорифер' : 'Кондиционер'}</span>
                            <span className={`font-bold ${season === 'winter' ? 'text-red-400' : 'text-blue-400'}`}>{season === 'winter' ? '🔥 НАГРЕВ' : '❄️ ОХЛ'}</span>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Клапана (по CO)</h3>
                    <div className="space-y-2 text-xs">
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-cyan-400">Приток</span><span className="text-cyan-400 font-mono font-bold">{supplyValve.toFixed(0)}%</span></div>
                            <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-cyan-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, supplyValve)}%` }} /></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-orange-400">Вытяжка</span><span className="text-orange-400 font-mono font-bold">{exhaustValve.toFixed(0)}%</span></div>
                            <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-orange-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, exhaustValve)}%` }} /></div>
                        </div>
                        <div>
                            <div className="flex justify-between mb-1"><span className="text-gray-400">Байпас</span><span className="text-gray-400 font-mono font-bold">{bypassValve.toFixed(0)}%</span></div>
                            <div className="w-full bg-gray-700 rounded-full h-2"><div className="bg-gray-500 h-2 rounded-full transition-all" style={{ width: `${Math.min(100, bypassValve)}%` }} /></div>
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Газоанализатор</h3>
                    <div className="space-y-2">
                        <div className={`p-2 rounded border-2`} style={{ borderColor: getCoColor(), backgroundColor: `${getCoColor()}15` }}>
                            <div className="flex justify-between text-xs">
                                <span className="font-bold" style={{ color: getCoColor() }}>CO</span>
                                <span className="font-mono font-bold" style={{ color: getCoColor() }}>{coLevel.toFixed(0)} ppm</span>
                            </div>
                            <div className="text-[10px] mt-1 font-bold" style={{ color: getCoColor() }}>{getCoText()}</div>
                            <div className="w-full bg-gray-700 rounded-full h-1.5 mt-1">
                                <div className="h-1.5 rounded-full transition-all" style={{ width: `${(coLevel / 1100) * 100}%`, backgroundColor: getCoColor() }} />
                            </div>
                        </div>
                        <div className="text-[10px] text-gray-400">
                            Задвижки открываются при CO &gt; 400 ppm
                        </div>
                    </div>
                </div>

                <div className="bg-gray-800/80 p-2 rounded border border-gray-700">
                    <h3 className="text-white text-xs font-bold mb-2 uppercase tracking-wider">Параметры</h3>
                    <div className="space-y-1.5 text-xs">
                        <div className="flex justify-between"><span className="text-gray-400">Улица:</span><span className="text-cyan-400 font-mono">{outdoorTemp.toFixed(1)} °C</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Приток:</span><span className="text-cyan-400 font-mono">{supplyTemp.toFixed(1)} °C</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Вытяжка:</span><span className="text-orange-400 font-mono">{exhaustTemp.toFixed(1)} °C</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Комната:</span><span className="text-green-400 font-mono font-bold">{roomTemp.toFixed(1)} °C</span></div>
                        <div className="flex justify-between"><span className="text-gray-400">Давление:</span><span className="text-orange-400 font-mono">{pressure.toFixed(0)} Па</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
}