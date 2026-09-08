// components/InteractiveScada.tsx
import { useState, useEffect } from 'react';

export default function InteractiveScada() {
  const [activeScreen, setActiveScreen] = useState<'mode' | 'settings' | 'archive'>('mode');
  const [activeMode, setActiveMode] = useState<'filtration' | 'automatic'>('filtration');
  const [pump1Running, setPump1Running] = useState(false);
  const [pump2Running, setPump2Running] = useState(false);
  const [pump3Running, setPump3Running] = useState(false);
  const [pressure1, setPressure1] = useState(0.0);
  const [pressure2, setPressure2] = useState(0.0);
  const [pressure3, setPressure3] = useState(0.0);
  const [alarm1, setAlarm1] = useState(false);
  const [alarm2, setAlarm2] = useState(false);
  const [alarm3, setAlarm3] = useState(false);
  const [alarm4, setAlarm4] = useState(false);
  const [reactorLevel, setReactorLevel] = useState(45);
  const [filterStatus, setFilterStatus] = useState([true, true, true, true]);

  // Симуляция работы системы
  useEffect(() => {
    if (activeMode === 'automatic' && pump1Running) {
      const interval = setInterval(() => {
        setPressure1(prev => Math.min(2.5, prev + 0.1));
        setPressure2(prev => Math.min(1.8, prev + 0.08));
        setReactorLevel(prev => Math.min(95, prev + 2));
      }, 500);
      return () => clearInterval(interval);
    } else {
      setPressure1(0);
      setPressure2(0);
    }
  }, [activeMode, pump1Running]);

  const togglePump = (pump: number) => {
    if (pump === 1) setPump1Running(!pump1Running);
    if (pump === 2) setPump2Running(!pump2Running);
    if (pump === 3) setPump3Running(!pump3Running);
  };

  const toggleFilter = (index: number) => {
    const newStatus = [...filterStatus];
    newStatus[index] = !newStatus[index];
    setFilterStatus(newStatus);
  };

  return (
    <div className="w-full h-full bg-[#0a2540] p-2 md:p-4 rounded-lg flex flex-col">
      {/* Навигация */}
      <div className="flex justify-center gap-2 mb-4">
        <button
          onClick={() => setActiveScreen('mode')}
          className={`px-6 py-2 rounded font-bold transition-all ${
            activeScreen === 'mode' 
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Режим
        </button>
        <button
          onClick={() => setActiveScreen('settings')}
          className={`px-6 py-2 rounded font-bold transition-all ${
            activeScreen === 'settings' 
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Настройка
        </button>
        <button
          onClick={() => setActiveScreen('archive')}
          className={`px-6 py-2 rounded font-bold transition-all ${
            activeScreen === 'archive' 
              ? 'bg-cyan-500 text-white shadow-lg shadow-cyan-500/50' 
              : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Архив
        </button>
      </div>

      {activeScreen === 'mode' && (
        <>
          {/* Выбор режима */}
          <div className="flex justify-center gap-4 mb-6">
            <button
              onClick={() => setActiveMode('filtration')}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeMode === 'filtration'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Фильтрация
            </button>
            <button
              onClick={() => setActiveMode('automatic')}
              className={`px-8 py-3 rounded-lg font-bold text-lg transition-all ${
                activeMode === 'automatic'
                  ? 'bg-green-500 text-white shadow-lg shadow-green-500/50 scale-105'
                  : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
              }`}
            >
              Автоматический режим
            </button>
          </div>

          {/* Основная схема */}
          <div className="relative h-[500px]">
            <svg viewBox="0 0 1200 500" className="w-full h-full">
              {/* Трубы */}
              <path
                d="M 150 250 L 300 250 L 300 150 L 400 150"
                stroke="#00d4ff"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 400 150 L 400 350 L 500 350"
                stroke="#00d4ff"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 500 350 L 600 350 L 600 250 L 700 250"
                stroke="#00d4ff"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />
              <path
                d="M 700 250 L 800 250 L 800 150 L 900 150"
                stroke="#00d4ff"
                strokeWidth="8"
                fill="none"
                opacity="0.6"
              />

              {/* Бак-реактор */}
              <g onClick={() => setReactorLevel(Math.random() * 100)} className="cursor-pointer">
                <rect x="50" y="150" width="150" height="200" rx="10" fill="#c0c0c0" stroke="#808080" strokeWidth="3"/>
                <rect x="60" y={350 - reactorLevel * 2} width="130" height={reactorLevel * 2} fill="#00d4ff" opacity="0.6"/>
                <text x="125" y="200" textAnchor="middle" className="text-xl font-bold fill-white">ВУ</text>
                <text x="125" y="230" textAnchor="middle" className="text-lg fill-white">Бак-реактор</text>
                <text x="125" y="260" textAnchor="middle" className="text-xl font-bold fill-white">НУ</text>
                
                {/* Индикаторы */}
                <circle cx="180" cy="180" r="12" fill={reactorLevel > 80 ? '#ff0000' : '#00ff00'} className="animate-pulse"/>
                <circle cx="180" cy="220" r="12" fill={reactorLevel < 20 ? '#ff0000' : '#00ff00'} className="animate-pulse"/>
              </g>

              {/* Насос 1 */}
              <g onClick={() => togglePump(1)} className="cursor-pointer">
                <circle cx="250" cy="300" r="30" fill="#606060" stroke="#404040" strokeWidth="3"/>
                {pump1Running && (
                  <g className="animate-spin" style={{ transformOrigin: '250px 300px' }}>
                    <path d="M 250 270 L 260 300 L 250 330 L 240 300 Z" fill="#00d4ff"/>
                  </g>
                )}
                <text x="250" y="350" textAnchor="middle" className="text-sm fill-white">Насос 1</text>
                <text x="250" y="370" textAnchor="middle" className={`text-xs ${alarm1 ? 'fill-red-500' : 'fill-green-500'}`}>
                  {alarm1 ? 'Авария' : 'Норма'}
                </text>
              </g>

              {/* Фильтры */}
              {[0, 1, 2, 3].map((i) => (
                <g key={i} onClick={() => toggleFilter(i)} className="cursor-pointer">
                  <rect x={380 + i * 120} y="100" width="60" height="200" rx="5" fill="#d0d0d0" stroke="#808080" strokeWidth="2"/>
                  <rect x={385 + i * 120} y="110" width="50" height="180" fill={filterStatus[i] ? '#00d4ff' : '#ff0000'} opacity="0.3"/>
                  <text x={410 + i * 120} y="200" textAnchor="middle" className="text-sm font-bold fill-white">
                    {filterStatus[i] ? 'Работа' : 'Авария'}
                  </text>
                  <circle cx={440 + i * 120} cy="120" r="8" fill={filterStatus[i] ? '#00ff00' : '#ff0000'} className="animate-pulse"/>
                </g>
              ))}

              {/* Насос 2 */}
              <g onClick={() => togglePump(2)} className="cursor-pointer">
                <circle cx="600" cy="300" r="30" fill="#606060" stroke="#404040" strokeWidth="3"/>
                {pump2Running && (
                  <g className="animate-spin" style={{ transformOrigin: '600px 300px' }}>
                    <path d="M 600 270 L 610 300 L 600 330 L 590 300 Z" fill="#00d4ff"/>
                  </g>
                )}
                <text x="600" y="350" textAnchor="middle" className="text-sm fill-white">Насос 2</text>
              </g>

              {/* Насос 3 */}
              <g onClick={() => togglePump(3)} className="cursor-pointer">
                <circle cx="850" cy="300" r="30" fill="#606060" stroke="#404040" strokeWidth="3"/>
                {pump3Running && (
                  <g className="animate-spin" style={{ transformOrigin: '850px 300px' }}>
                    <path d="M 850 270 L 860 300 L 850 330 L 840 300 Z" fill="#00d4ff"/>
                  </g>
                )}
                <text x="850" y="350" textAnchor="middle" className="text-sm fill-white">Насос 3</text>
              </g>

              {/* Резервуары РЧВ1, РЧВ2 */}
              <g>
                <rect x="1000" y="50" width="120" height="80" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1060" y="80" textAnchor="middle" className="text-lg font-bold fill-white">РЧВ1</text>
                <text x="1060" y="110" textAnchor="middle" className="text-sm fill-cyan-400">{pressure1.toFixed(2)} Па</text>
                
                <rect x="1000" y="150" width="120" height="80" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1060" y="180" textAnchor="middle" className="text-lg font-bold fill-white">РЧВ2</text>
                <text x="1060" y="210" textAnchor="middle" className="text-sm fill-cyan-400">{pressure2.toFixed(2)} Па</text>
              </g>

              {/* РПВ */}
              <g>
                <rect x="1000" y="250" width="120" height="80" rx="5" fill="#c0c0c0" stroke="#808080" strokeWidth="2"/>
                <text x="1060" y="280" textAnchor="middle" className="text-lg font-bold fill-white">РПВ</text>
                <circle cx="1020" cy="300" r="8" fill={pump1Running ? '#00ff00' : '#606060'}/>
                <circle cx="1040" cy="300" r="8" fill={pump2Running ? '#00ff00' : '#606060'}/>
                <circle cx="1060" cy="300" r="8" fill={pump3Running ? '#00ff00' : '#606060'}/>
              </g>

              {/* Септик */}
              <g>
                <rect x="900" y="400" width="150" height="60" rx="5" fill="#606060" stroke="#404040" strokeWidth="2"/>
                <text x="975" y="435" textAnchor="middle" className="text-lg font-bold fill-white">Септик</text>
              </g>

              {/* Манометры */}
              <g>
                <circle cx="300" cy="100" r="25" fill="#202020" stroke="#404040" strokeWidth="2"/>
                <text x="300" y="105" textAnchor="middle" className="text-xs fill-cyan-400">{pressure1.toFixed(2)}</text>
                <text x="300" y="80" textAnchor="middle" className="text-xs fill-white">Па</text>
              </g>
            </svg>
          </div>

          {/* Панель управления */}
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Насосы</h3>
              <div className="space-y-2">
                <button
                  onClick={() => togglePump(1)}
                  className={`w-full py-2 rounded ${pump1Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}
                >
                  Насос 1: {pump1Running ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <button
                  onClick={() => togglePump(2)}
                  className={`w-full py-2 rounded ${pump2Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}
                >
                  Насос 2: {pump2Running ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
                <button
                  onClick={() => togglePump(3)}
                  className={`w-full py-2 rounded ${pump3Running ? 'bg-green-500' : 'bg-gray-600'} text-white`}
                >
                  Насос 3: {pump3Running ? 'ВКЛ' : 'ВЫКЛ'}
                </button>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Давление</h3>
              <div className="space-y-2 text-cyan-400">
                <div>РЧВ1: {pressure1.toFixed(2)} Па</div>
                <div>РЧВ2: {pressure2.toFixed(2)} Па</div>
                <div>РЧВ3: {pressure3.toFixed(2)} Па</div>
              </div>
            </div>

            <div className="bg-gray-800 p-4 rounded-lg">
              <h3 className="text-white font-bold mb-2">Уровень реактора</h3>
              <div className="text-3xl font-bold text-cyan-400">{reactorLevel.toFixed(0)}%</div>
              <div className="w-full bg-gray-700 rounded-full h-4 mt-2">
                <div 
                  className="bg-cyan-500 h-4 rounded-full transition-all"
                  style={{ width: `${reactorLevel}%` }}
                />
              </div>
            </div>
          </div>
        </>
      )}

      {activeScreen === 'settings' && (
        <div className="bg-gray-800 p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Настройки системы</h2>
          <div className="space-y-4">
            <div>
              <label className="block mb-2">Порог давления (Па):</label>
              <input type="range" min="0" max="5" step="0.1" defaultValue="2.5" className="w-full"/>
            </div>
            <div>
              <label className="block mb-2">Уровень реактора (%):</label>
              <input type="range" min="0" max="100" defaultValue="80" className="w-full"/>
            </div>
            <div>
              <label className="flex items-center gap-2">
                <input type="checkbox" defaultChecked/> Автоматический режим
              </label>
            </div>
          </div>
        </div>
      )}

      {activeScreen === 'archive' && (
        <div className="bg-gray-800 p-8 rounded-lg text-white">
          <h2 className="text-2xl font-bold mb-4">Архив данных</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-700">
                <th className="text-left py-2">Время</th>
                <th className="text-left py-2">Давление РЧВ1</th>
                <th className="text-left py-2">Давление РЧВ2</th>
                <th className="text-left py-2">Уровень</th>
              </tr>
            </thead>
            <tbody>
              {[...Array(5)].map((_, i) => (
                <tr key={i} className="border-b border-gray-700">
                  <td className="py-2">{new Date().toLocaleTimeString()}</td>
                  <td className="py-2">{(Math.random() * 2).toFixed(2)} Па</td>
                  <td className="py-2">{(Math.random() * 1.5).toFixed(2)} Па</td>
                  <td className="py-2">{Math.floor(Math.random() * 100)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}