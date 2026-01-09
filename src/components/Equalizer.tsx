import React from 'react';
import { motion } from 'framer-motion';
import { Building2, Rocket, Info } from 'lucide-react';
import { ActorProfile, DIMENSIONS, DimensionConfig, EcosystemValues } from '../types';

interface EqualizerProps {
    corp: ActorProfile;
    startup: ActorProfile;
    setCorpValue: (dimId: keyof EcosystemValues, val: number) => void;
    setStartupValue: (dimId: keyof EcosystemValues, val: number) => void;
    onNext: () => void;
    labels: any;
}

const ScaleButton: React.FC<{
    value: number;
    isSelected: boolean;
    onClick: () => void;
    color: 'cyan' | 'emerald';
}> = ({ value, isSelected, onClick, color }) => {
    const colorClasses = color === 'cyan'
        ? 'border-cyan-500 bg-cyan-500/20 text-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
        : 'border-emerald-500 bg-emerald-500/20 text-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)]';

    const defaultClasses = 'border-white/10 bg-white/5 text-gray-500';

    return (
        <button
            onClick={onClick}
            className={`w-12 h-12 rounded-xl font-black text-sm transition-all duration-300 border-2 hover:scale-110 active:scale-95 ${isSelected ? colorClasses : defaultClasses
                } hover:border-white/30`}
        >
            {value}
        </button>
    );
};

const DimensionRow: React.FC<{
    dim: DimensionConfig;
    corpVal: number;
    startVal: number;
    setCorpVal: (v: number) => void;
    setStartVal: (v: number) => void;
    labels: any;
}> = ({ dim, corpVal, startVal, setCorpVal, setStartVal, labels }) => {
    const delta = Math.abs(corpVal - startVal);
    const isCritical = delta > 4;
    const isOptimal = delta <= 2;
    const t = labels.calibration.dimensions[dim.id];

    const getQualitativeLabel = (val: number) => {
        if (val <= 3) return labels.calibration.levels?.low || 'Low';
        if (val <= 5) return labels.calibration.levels?.medium || 'Medium';
        if (val <= 7) return labels.calibration.levels?.high || 'High';
        return labels.calibration.levels?.veryHigh || 'Very High';
    };

    return (
        <div className="flex flex-col gap-8 mb-12 last:mb-0 p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-white/5 to-transparent hover:border-white/10 transition-all">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3">
                        <div className={`w-1 h-8 rounded-full ${isCritical ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]' : isOptimal ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]' : 'bg-white/20'}`} />
                        <h3 className="text-white font-black text-2xl uppercase tracking-tighter">
                            {t.label}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500 font-bold uppercase tracking-widest max-w-2xl pl-4">
                        {t.description}
                    </p>
                </div>

                <div className="text-right">
                    <div className="text-[9px] text-gray-600 font-black uppercase tracking-widest mb-1">Friction Index</div>
                    <div className={`text-3xl font-black ${isCritical ? 'text-red-500' : isOptimal ? 'text-emerald-500' : 'text-white'} tracking-tighter`}>
                        Δ {delta}
                    </div>
                </div>
            </div>

            {/* Corporate Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Building2 className="w-5 h-5 text-cyan-400" />
                    <h4 className="text-cyan-400 font-black text-sm uppercase tracking-widest">
                        {t.corp || 'Corporate'}
                    </h4>
                    <div className="text-xs text-gray-500 font-bold">
                        → {getQualitativeLabel(corpVal)}
                    </div>
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                        <ScaleButton
                            key={val}
                            value={val}
                            isSelected={corpVal === val}
                            onClick={() => setCorpVal(val)}
                            color="cyan"
                        />
                    ))}
                </div>
            </div>

            {/* Startup Selection */}
            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Rocket className="w-5 h-5 text-emerald-400" />
                    <h4 className="text-emerald-400 font-black text-sm uppercase tracking-widest">
                        {t.startup || 'Startup'}
                    </h4>
                    <div className="text-xs text-gray-500 font-bold">
                        → {getQualitativeLabel(startVal)}
                    </div>
                </div>
                <div className="flex gap-2">
                    {Array.from({ length: 10 }, (_, i) => i + 1).map((val) => (
                        <ScaleButton
                            key={val}
                            value={val}
                            isSelected={startVal === val}
                            onClick={() => setStartVal(val)}
                            color="emerald"
                        />
                    ))}
                </div>
            </div>

            {/* Friction Indicator */}
            {!isOptimal && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`flex items-start gap-3 p-4 rounded-2xl border ${isCritical
                            ? 'border-red-500/30 bg-red-500/5'
                            : 'border-amber-500/30 bg-amber-500/5'
                        }`}
                >
                    <Info className={`w-5 h-5 flex-shrink-0 mt-0.5 ${isCritical ? 'text-red-500' : 'text-amber-500'}`} />
                    <div>
                        <div className={`text-xs font-black uppercase tracking-widest mb-1 ${isCritical ? 'text-red-400' : 'text-amber-400'}`}>
                            {isCritical ? 'Critical Friction Detected' : 'Moderate Friction'}
                        </div>
                        <p className="text-xs text-gray-400 leading-relaxed">
                            {isCritical
                                ? 'Significant misalignment may require governance mitigation strategies.'
                                : 'Manageable gap - consider alignment during partnership structuring.'}
                        </p>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

const Equalizer: React.FC<EqualizerProps> = ({ corp, startup, setCorpValue, setStartupValue, onNext, labels }) => {
    return (
        <div className="w-full max-w-6xl mx-auto p-4 pb-24 animate-in fade-in duration-1000">
            <div className="mb-16 text-center">
                <div className="inline-flex items-center gap-2 px-4 py-1 bg-white/5 rounded-full border border-white/10 mb-6 group">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                    <span className="text-[10px] font-black text-gray-500 uppercase tracking-[0.3em] group-hover:text-white transition-colors">Strategic Assessment Matrix</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-black text-white mb-6 uppercase tracking-tighter leading-tight">
                    {labels.calibration.stepTitle}
                </h2>
                <p className="text-gray-500 text-sm md:text-base font-medium max-w-3xl mx-auto leading-relaxed">
                    {labels.calibration.instruction}
                </p>
                <p className="text-xs text-gray-600 font-bold uppercase tracking-widest mt-4">
                    Select values from 1 (Low) to 10 (Very High) for each dimension
                </p>
            </div>

            <div className="space-y-6">
                {DIMENSIONS.map(dim => (
                    <DimensionRow
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

            <div className="text-center mt-16">
                <button
                    onClick={onNext}
                    className="group relative inline-flex items-center gap-4 px-16 py-6 bg-white text-black font-black rounded-[2rem] hover:scale-105 transition-all duration-500 active:scale-95 shadow-[0_20px_50px_rgba(255,255,255,0.1)] overflow-hidden"
                >
                    <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <span className="relative z-10 uppercase tracking-[0.3em] text-sm group-hover:text-white transition-colors">
                        {labels.calibration.nextBtn}
                    </span>
                    <Rocket className="w-5 h-5 relative z-10 group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform duration-500 group-hover:text-white" />
                </button>
            </div>
        </div>
    );
};

export default Equalizer;
