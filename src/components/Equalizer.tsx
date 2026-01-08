
import React from 'react';
import { motion } from 'framer-motion';
import { ActorProfile, DIMENSIONS, DimensionConfig, EcosystemValues } from '../types';

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
    labels: any;
}> = ({ dim, corpVal, startVal, setCorpVal, setStartVal, labels }) => {
    // Logic for the line tension
    const delta = Math.abs(corpVal - startVal);
    const isCritical = delta > 6;
    const isOptimal = delta <= 3;

    // Look up translated texts
    const t = labels.calibration.dimensions[dim.id];

    // Percentage positions (1-10 mapped to 0-100%)
    const corpPct = ((corpVal - 1) / 9) * 100;
    const startPct = ((startVal - 1) / 9) * 100;

    return (
        <div className="flex flex-col gap-4 mb-10 select-none animate-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-2">
                <div>
                    <h3 className="text-white font-bold text-lg md:text-xl flex items-center gap-2 tracking-wide">
                        {t.label}
                    </h3>
                    <p className="text-gray-400 text-xs md:text-sm max-w-md">{t.description}</p>
                </div>
                <div className="text-right">
                    {isCritical && (
                        <span className="flex items-center gap-2 text-vault-gap font-bold text-[10px] bg-red-500/10 px-3 py-1 rounded-full animate-pulse border border-red-500/20 tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" /> {labels.diagnosis.critical}
                        </span>
                    )}
                    {isOptimal && (
                        <span className="flex items-center gap-2 text-vault-startup font-bold text-[10px] bg-green-500/10 px-3 py-1 rounded-full border border-green-500/20 tracking-widest uppercase">
                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" /> {labels.diagnosis.optimal}
                        </span>
                    )}
                </div>
            </div>

            <div className="relative h-20 bg-black/40 rounded-xl border border-white/5 flex items-center px-8 shadow-inner group transition-colors hover:border-white/10">

                {/* Background Track Markers */}
                <div className="absolute inset-x-8 flex justify-between text-[9px] text-gray-700 font-mono pointer-events-none">
                    <span>1</span><span>|</span><span>|</span><span>|</span><span>5</span><span>|</span><span>|</span><span>|</span><span>9</span><span>10</span>
                </div>

                {/* The Track Line */}
                <div className="absolute left-8 right-8 h-1 bg-white/10 rounded-full"></div>

                {/* Tension Line (Connecting the two points) */}
                <motion.div
                    className={`absolute h-1 rounded-full z-10 opacity-60 ${isCritical ? 'bg-gradient-to-r from-red-500/50 via-red-500 to-red-500/50' : 'bg-white/30'} `}
                    style={{
                        left: `calc(${Math.min(corpPct, startPct)}% + 2rem)`, // 2rem = 32px (left padding 8 + offset?) NO, px-8 is 32px
                        width: `calc(${Math.abs(corpPct - startPct)}%)`
                    }}
                    animate={isCritical ? {
                        opacity: [0.4, 0.8, 0.4],
                    } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                />

                {/* Corp Handle (Blue) */}
                <div
                    className="absolute w-10 h-10 -ml-5 bg-vault-card border-2 border-vault-corp rounded-full shadow-[0_0_15px_rgba(0,255,255,0.2)] cursor-grab active:cursor-grabbing flex flex-col items-center justify-center z-20 hover:scale-110 active:scale-95 transition-all group/handle"
                    style={{ left: `calc(${corpPct}% + 2rem)` }}
                    onMouseDown={(e) => {
                        const track = e.currentTarget.parentElement!;
                        const handleMouseMove = (ev: MouseEvent) => {
                            const rect = track.getBoundingClientRect();
                            const x = ev.clientX - rect.left - 32; // 32px padding (px-8)
                            const w = rect.width - 64; // total padding 64
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
                    <span className="text-[10px] font-black text-vault-corp">C</span>
                    <div className="absolute -bottom-8 opacity-0 group-hover/handle:opacity-100 transition-opacity bg-vault-corp text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                        {t.corp}
                    </div>
                </div>

                {/* Startup Handle (Green) */}
                <div
                    className="absolute w-10 h-10 -ml-5 bg-vault-card border-2 border-vault-startup rounded-full shadow-[0_0_15px_rgba(34,197,94,0.2)] cursor-grab active:cursor-grabbing flex flex-col items-center justify-center z-30 hover:scale-110 active:scale-95 transition-all group/handle"
                    style={{ left: `calc(${startPct}% + 2rem)` }}
                    onMouseDown={(e) => {
                        const track = e.currentTarget.parentElement!;
                        const handleMouseMove = (ev: MouseEvent) => {
                            const rect = track.getBoundingClientRect();
                            const x = ev.clientX - rect.left - 32;
                            const w = rect.width - 64;
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
                    <span className="text-[10px] font-black text-vault-startup">S</span>
                    <div className="absolute -top-8 opacity-0 group-hover/handle:opacity-100 transition-opacity bg-vault-startup text-black text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap z-50 pointer-events-none">
                        {t.startup}
                    </div>
                </div>

            </div>

            <div className="flex justify-between text-xs font-medium px-4">
                <div className="text-vault-corp flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-vault-corp" /> {t.corp}: {corpVal}
                </div>
                <div className="text-vault-startup flex items-center gap-2">
                    {t.startup}: {startVal} <div className="w-2 h-2 rounded-full bg-vault-startup" />
                </div>
            </div>
        </div>
    );
};

const Equalizer: React.FC<EqualizerProps> = ({ corp, startup, setCorpValue, setStartupValue, onNext, labels }) => {
    return (
        <div className="w-full max-w-4xl mx-auto p-4 pb-24">
            <div className="mb-12 text-center">
                <h2 className="text-heading-hero text-white mb-4 uppercase tracking-tighter">{labels.stepTitle}</h2>
                <p className="text-body-standard max-w-xl mx-auto opacity-70 italic">{labels.instruction}</p>
            </div>

            <div className="glass-panel p-6 md:p-10 rounded-2xl relative">
                {DIMENSIONS.map(dim => (
                    <SliderTrack
                        key={dim.id}
                        dim={dim}
                        corpVal={corp.values[dim.id as keyof typeof corp.values]}
                        startVal={startup.values[dim.id as keyof typeof startup.values]}
                        setCorpVal={(v) => setCorpValue(dim.id, v)}
                        setStartVal={(v) => setStartupValue(dim.id, v)}
                        labels={labels}
                    />
                ))}
            </div>

            <div className="text-center mt-12">
                <button
                    onClick={onNext}
                    className="px-12 py-4 rounded-full bg-white text-black font-black tracking-widest text-sm md:text-base hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transition-all duration-300"
                >
                    {labels.nextBtn}
                </button>
            </div>
        </div>
    );
};

export default Equalizer;
