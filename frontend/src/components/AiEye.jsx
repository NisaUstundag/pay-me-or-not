import React, { useEffect, useState } from 'react';

const AiEye = ({ state }) => {
    // state: 'idle' | 'thinking' | 'angry' | 'granting'
    const [rotation, setRotation] = useState(0);

    useEffect(() => {
        const handleMouseMove = (e) => {
            if (state === 'granting') return;

            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            // Calculate angle
            const x = clientX - innerWidth / 2;
            const y = clientY - innerHeight / 2;
            const angle = Math.atan2(y, x) * (180 / Math.PI);
            setRotation(angle);
        };

        window.addEventListener('mousemove', handleMouseMove);
        return () => window.removeEventListener('mousemove', handleMouseMove);
    }, [state]);

    let eyeColor = 'text-neon-green/80';
    let pupilColor = 'fill-neon-green';
    let pulseClass = '';

    if (state === 'angry') {
        eyeColor = 'text-alert-red';
        pupilColor = 'fill-alert-red';
        pulseClass = 'animate-pulse-fast';
    } else if (state === 'thinking') {
        eyeColor = 'text-yellow-500';
        pupilColor = 'fill-yellow-500';
        pulseClass = 'animate-ping';
    } else if (state === 'granting') {
        eyeColor = 'text-white';
        pupilColor = 'fill-white';
        pulseClass = 'animate-spin';
    }

    return (
        <div className={`relative w-48 h-48 flex items-center justify-center transition-all duration-500 ${pulseClass}`}>
            {/* Outer Ring */}
            <svg className={`w-full h-full ${eyeColor}`} viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="2" fill="none" className="opacity-50" />
                <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="1" fill="none" className="opacity-80" />

                {/* Iris Wrapper with rotation */}
                <g transform={`rotate(${rotation} 50 50)`}>
                    {/* Pupil */}
                    <circle cx="65" cy="50" r="10" className={pupilColor} filter="url(#glow)" />
                    {/* Iris Details */}
                    <path d="M 50 50 L 80 50" stroke="currentColor" strokeWidth="1" className="opacity-30" />
                </g>
            </svg>
            {/* HUD Elements */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 text-[10px] text-neon-green opacity-50">
                    TARGET_LOCKED
                </div>
            </div>
        </div>
    );
};

export default AiEye;
