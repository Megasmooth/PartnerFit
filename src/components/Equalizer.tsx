
import React from 'react';
import { motion } from 'framer-motion';
import { ActorProfile, DIMENSIONS, DimensionConfig, EcosystemValues } from '../types';
import { Info } from 'lucide-react';

interface EqualizerProps {
    corp: ActorProfile;
    startup: ActorProfile;
    setCorpValue: (dimId: keyof EcosystemValues, val: number) => void;
    setStartupValue: (dimId: keyof EcosystemValues, val: number) => void;
    onNext: () => void;
    labels: any;
}

const SliderTrack: React.FC<{
    dim: DimensionConfig;
    corpVal: number;
    startVal: number;
    setCorpVal: (v: number) => void;
    setStartVal: (v: number) => void;
}> = ({ dim, corpVal, startVal, setCorpVal, setStartVal }) => {
    // Logic for the line tension
    const delta = Math.abs(corpVal - startVal);
    const isCritical = delta > 6;


    // Percentage positions (1-10 mapped to 0-100%)
    const corpPct = ((corpVal - 1) / 9) * 100;
    const startPct = ((startVal - 1) / 9) * 100;

    return (
        <div className="flex flex-col gap-2 mb-8 select-none">
            <div className="flex justify-between items-end mb-2">
                <div>
                    <h3 className="text-white font-bold text-lg flex items-center gap-2">
                        {dim.label}
                        <div className="group relative">
                            <Info className="w-4 h-4 text-gray-500 cursor-help" />
                            <div className="absolute left-6 top-0 w-64 p-3 glass-panel text-xs text-gray-300 hidden group-hover:block z-50 rounded-lg">
                                {dim.description}
                            </div>
                        </div>
                    </h3>
                </div>
                <div className="text-right">
                    {isCritical && <span className="text-vault-gap font-mono text-xs animate-pulse">CRITICAL FRICTION DETECTED</span>}
                </div>
            </div>

            <div className="relative h-24 bg-black/40 rounded-xl border border-white/5 flex items-center px-6">

                {/* The Track Line */}
                <div className="absolute left-6 right-6 h-1 bg-white/10 rounded-full"></div>

                {/* Tension Line (Connecting the two points) */}
                <motion.div
                    className={`absolute h - 1 rounded - full z - 10 transition - colors duration - 300 ${isCritical ? 'bg-vault-gap' : 'bg-white/20'} `}
                    style={{
                        left: `calc(${Math.min(corpPct, startPct)} %)`,
                        width: `calc(${Math.abs(corpPct - startPct)} %)`
                    }}
                    animate={isCritical ? {
                        y: [0, -2, 2, -1, 1, 0],
                        backgroundColor: ['#ef4444', '#ff0000', '#ef4444']
                    } : {}}
                    transition={{ duration: 0.2, repeat: isCritical ? Infinity : 0, repeatDelay: 3 }}
                />

                {/* Left Label (Low) */}
                <span className="absolute left-2 text-[10px] text-gray-600 font-mono">1</span>

                {/* Right Label (High) */}
                <span className="absolute right-2 text-[10px] text-gray-600 font-mono">10</span>

                {/* Corp Handle (Blue) */}
                <div
                    className="absolute w-8 h-8 -ml-4 bg-vault-corp rounded-full shadow-[0_0_15px_#00FFFF] cursor-grab active:cursor-grabbing flex items-center justify-center text-black font-bold text-xs hover:scale-110 transition-transform z-20"
                    style={{ left: `calc(${corpPct} % + 1.5rem)` }} // +1.5rem to offset padding
                    onMouseDown={(e) => {
                        const track = e.currentTarget.parentElement!;
                        const handleMouseMove = (ev: MouseEvent) => {
                            const rect = track.getBoundingClientRect();
                            const x = ev.clientX - rect.left - 24; // 24px padding
                            const w = rect.width - 48;
                            let val = Math.round((x / w) * 9) + 1;
                            if (val < 1) val = 1; if (val > 10) val = 10;
                            setCorpVal(val);
                        };
                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                >
                    C
                </div>

                {/* Startup Handle (Green) */}
                <div
                    className="absolute top-1/2 mt-4 w-8 h-8 -ml-4 bg-vault-startup rounded-full shadow-[0_0_15px_#22c55e] cursor-grab active:cursor-grabbing flex items-center justify-center text-black font-bold text-xs hover:scale-110 transition-transform z-30"
                    style={{ left: `calc(${startPct} % + 1.5rem)` }}
                    onMouseDown={(e) => {
                        const track = e.currentTarget.parentElement!;
                        const handleMouseMove = (ev: MouseEvent) => {
                            const rect = track.getBoundingClientRect();
                            const x = ev.clientX - rect.left - 24;
                            const w = rect.width - 48;
                            let val = Math.round((x / w) * 9) + 1;
                            if (val < 1) val = 1; if (val > 10) val = 10;
                            setStartVal(val);
                        };
                        const handleMouseUp = () => {
                            window.removeEventListener('mousemove', handleMouseMove);
                            window.removeEventListener('mouseup', handleMouseUp);
                        };
                        window.addEventListener('mousemove', handleMouseMove);
                        window.addEventListener('mouseup', handleMouseUp);
                    }}
                >
                    S
                </div>

            </div>

            <div className="flex justify-between text-xs text-gray-400 px-2 mt-1">
                <span className="text-vault-corp">{dim.corpLabel}: <span className="text-white">{corpVal}</span></span>
                <span className="text-vault-startup">{dim.startupLabel}: <span className="text-white">{startVal}</span></span>
            </div>
        </div>
    );
};

const Equalizer: React.FC<EqualizerProps> = ({ corp, startup, setCorpValue, setStartupValue, onNext, labels }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 pb-24">
            <div className="mb-8 text-center">
                <h2 className="text-3xl font-bold text-white mb-2">CALIBRATION</h2>
                <p className="text-gray-400">Drag the sliders to reflect the reality of both entities.</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl">
                {DIMENSIONS.map(dim => (
                    <SliderTrack
                        key={dim.id}
                        dim={dim}
                        corpVal={corp.values[dim.id as keyof typeof corp.values]}
                        startVal={startup.values[dim.id as keyof typeof startup.values]}
                        setCorpVal={(v) => setCorpValue(dim.id, v)}
                        setStartVal={(v) => setStartupValue(dim.id, v)}
                    />
                ))}
            </div>

            <motion.div
                className="fixed bottom-12 left-0 right-0 flex justify-center z-50"
            >
                <div className="text-center">
                    <button
                        onClick={onNext}
                        className="px-12 py-4 rounded-full bg-white text-black font-black tracking-widest text-sm hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
                    >
                        {labels.nextBtn}
                    </button>
                </div>      </motion.div>
        </div>
    );
};

export default Equalizer;

