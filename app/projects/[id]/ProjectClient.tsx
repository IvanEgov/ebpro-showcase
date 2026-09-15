'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import InteractiveScada from '@/components/InteractiveScada';
import InteractiveScadaKotel from '@/components/InteractiveScadaKotel';
import InteractiveScadaVentilation from '@/components/InteractiveScadaVentilation'; // ← НОВОЕ
import InteractiveScadaSmartHome from '@/components/InteractiveScadaSmartHome'; // ← НОВОЕ

export default function ProjectPage() {
    const router = useRouter();
    const params = useParams();
    const projectId = params.id as string;
    const [isAuthorized, setIsAuthorized] = useState(false);

    useEffect(() => {
        const auth = localStorage.getItem(`auth_${projectId}`);
        if (!auth) {
            router.push(`/login?project=${projectId}`);
        } else {
            setIsAuthorized(true);
        }
    }, [projectId, router]);

    const handleLogout = () => {
        localStorage.removeItem(`auth_${projectId}`);
        router.push('/');
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-[#0a2540] flex items-center justify-center">
                <div className="text-white animate-pulse">Проверка авторизации...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a2540] p-4">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                    <button onClick={() => router.push('/')} className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors">
                        ← На главную
                    </button>
                    <button onClick={handleLogout} className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
                        Выйти
                    </button>
                </div>

                {projectId === 'water-treatment' && <InteractiveScada />}
                {projectId === 'boiler-house' && <InteractiveScadaKotel />}
                {projectId === 'ventilation-system' && <InteractiveScadaVentilation />}
                {projectId === 'smart-home' && <InteractiveScadaSmartHome />}
            </div>
        </div>
    );
}