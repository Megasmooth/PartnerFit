import React from 'react';
import { SavedAnalysis } from '../utils/storage';
import { TranslationKeys } from '../utils/i18n';
import { ArrowLeft, Calendar, TrendingUp, BarChart3, Shield, Info, Download, Briefcase, Sparkles, FileText, Share2, Printer } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend } from 'recharts';
import { DIMENSIONS } from '../types';

interface PortfolioScreenProps {
    analyses: SavedAnalysis[];
    lang: TranslationKeys;
    onView: (analysis: SavedAnalysis) => void;
    onBack: () => void;
}

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ analyses, lang, onView, onBack }) => {
    const p = lang.portfolio;
    const avgScore = analyses.length > 0
        ? Math.round(analyses.reduce((acc, curr) => acc + curr.score, 0) / analyses.length)
        : 0;

    // Calculate Average Radar Data
    const avgData = DIMENSIONS.map(dim => {
        const avgVal = analyses.length > 0
            ? analyses.reduce((acc, curr) => acc + (curr.corpValues[dim.id] || 5), 0) / analyses.length
            : 5;
        return {
            subject: lang.calibration.dimensions[dim.id].label,
            value: avgVal,
            fullMark: 10,
        };
    });

    // Dynamic Metrics
    const shieldPercent = analyses.length > 0
        ? Math.round((analyses.filter(a => a.score > 70).length / analyses.length) * 100)
        : 0;

    const maturityAvgVal = analyses.length > 0
        ? (analyses.reduce((acc, curr) => {
            const vals = Object.values(curr.corpValues);
            return acc + (vals.reduce((a, b) => a + b, 0) / vals.length);
        }, 0) / analyses.length).toFixed(1)
        : "0.0";

    const handleExportExecutive = () => {
        window.print(); // Simple PDF trigger for now
    };

    return (
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20 no-print">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-body-highlight text-emerald-400">{p.title}</h2>
                <div className="ml-auto">
                    <button
                        onClick={onBack}
                        className="flex items-center gap-2 px-6 py-2.5 bg-white text-black font-black rounded-full hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] text-xs uppercase tracking-widest"
                    >
                        <Sparkles className="w-4 h-4" />
                        {p.newAnalysisBtn}
                    </button>
                </div>
            </div>

            <h3 className="text-3xl md:text-5xl font-black text-white mb-10 tracking-tighter uppercase flex items-center gap-4">
                <Briefcase className="w-8 h-8 md:w-12 md:h-12 text-emerald-500" />
                {p.vaultCentral}
            </h3>

            {analyses.length === 0 ? (
                <div className="glass-panel p-20 text-center rounded-3xl border border-white/5">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-6">
                        <TrendingUp className="w-10 h-10 text-gray-700" />
                    </div>
                    <p className="text-gray-500 font-bold uppercase tracking-widest">{p.emptyState}</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">

                    {/* Left: Project List */}
                    <div className="xl:col-span-4 space-y-4">
                        <div className="flex justify-between items-center mb-4 px-2">
                            <h4 className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">{p.totalAnalyses} [{analyses.length}]</h4>
                        </div>
                        <div className="space-y-3 max-h-[800px] overflow-y-auto pr-2 custom-scrollbar">
                            {analyses.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-emerald-500/30 transition-all group cursor-pointer"
                                    onClick={() => onView(item)}
                                >
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="text-[9px] font-bold text-gray-500 flex items-center gap-1 uppercase">
                                            <Calendar className="w-3 h-3" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className={`text-[10px] font-black px-2 py-0.5 rounded-md ${item.riskLevel === 'OPTIMAL' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
                                            {item.riskLevel}
                                        </div>
                                    </div>
                                    <div className="text-white font-black truncate text-sm mb-1 uppercase tracking-tight">
                                        {item.corpName}
                                    </div>
                                    <div className="text-emerald-500/60 font-medium text-xs truncate uppercase tracking-widest">
                                        vs {item.startupName}
                                    </div>
                                    <div className="mt-4 flex items-center justify-between">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={(e) => { e.stopPropagation(); onView(item); }}
                                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                            >
                                                <Info className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); window.print(); }}
                                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                            >
                                                <Printer className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={(e) => { e.stopPropagation(); if (navigator.share) navigator.share({ title: 'PartnerFit Report', url: window.location.href }); }}
                                                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-md transition-colors text-gray-400 hover:text-white"
                                            >
                                                <Share2 className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="flex flex-col text-right mr-2">
                                                <span className="text-[8px] text-gray-600 font-black uppercase">{p.frictionScore}</span>
                                                <span className="text-xl font-black text-white">{item.score}</span>
                                            </div>
                                            <button className="p-2 bg-white/5 rounded-lg group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                                <ArrowLeft className="w-4 h-4 rotate-180" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right: Aggregate Dashboard */}
                    <div className="xl:col-span-8 space-y-8">

                        {/* Summary Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent">
                                <div className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase mb-1">{p.avgScore}</div>
                                <div className="text-5xl font-black text-white tracking-tighter">{avgScore}</div>
                                <div className="mt-2 w-full h-1 bg-white/5 rounded-full overflow-hidden">
                                    <div className="h-full bg-emerald-500" style={{ width: `${avgScore}%` }} />
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-500/5 to-transparent">
                                <div className="text-[10px] font-black text-cyan-500 tracking-[0.2em] uppercase mb-1">{p.portfolioShield}</div>
                                <div className="text-5xl font-black text-white tracking-tighter">{shieldPercent}%</div>
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-500">
                                    <Shield className="w-3 h-3 text-cyan-400" /> {p.protectedAssets}
                                </div>
                            </div>
                            <div className="glass-panel p-6 rounded-3xl border border-white/5 bg-gradient-to-br from-purple-500/5 to-transparent">
                                <div className="text-[10px] font-black text-purple-500 tracking-[0.2em] uppercase mb-1">{p.maturityAvg}</div>
                                <div className="text-5xl font-black text-white tracking-tighter">{maturityAvgVal}<span className="text-sm opacity-20">/10</span></div>
                                <div className="mt-2 flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase">
                                    <BarChart3 className="w-3 h-3 text-purple-400" /> {p.trlBenchmark}
                                </div>
                            </div>
                        </div>

                        {/* Charts Row */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {/* Portfolio Radar */}
                            <div className="glass-panel p-8 rounded-3xl border border-white/5 relative flex flex-col items-center">
                                <div className="absolute top-6 left-8 text-[10px] font-black text-gray-600 tracking-[0.3em] uppercase">{p.avgProfile}</div>
                                <div className="w-full h-[300px] mt-4">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={avgData}>
                                            <PolarGrid stroke="#222" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#555', fontSize: 10, fontWeight: 'bold' }} />
                                            <Radar
                                                name={p.average}
                                                dataKey="value"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.6}
                                            />
                                            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '20px', fontSize: '10px', fontWeight: 'bold' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                                <div className="mt-4 text-center">
                                    <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest flex items-center justify-center gap-2">
                                        <Info className="w-3 h-3" /> {p.avgAlignment}
                                    </div>
                                </div>
                            </div>

                            {/* Top Valuations Placeholder / Stats */}
                            <div className="glass-panel p-8 rounded-3xl border border-white/5 flex flex-col justify-between">
                                <div className="text-[10px] font-black text-gray-600 tracking-[0.3em] uppercase mb-6">{p.synergyRanking}</div>
                                <div className="space-y-6">
                                    {analyses.slice(0, 3).map((a, i) => (
                                        <div key={i} className="flex flex-col gap-2">
                                            <div className="flex justify-between text-xs font-bold uppercase tracking-tighter">
                                                <span className="text-white">{a.corpName}</span>
                                                <span className="text-emerald-500">{a.score}%</span>
                                            </div>
                                            <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-600 to-cyan-600" style={{ width: `${a.score}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="mt-8 p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-2xl flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                                        <Sparkles className="w-5 h-5 text-emerald-500" />
                                    </div>
                                    <p className="text-[10px] font-medium text-gray-400 leading-tight">
                                        {p.higherThanAvg}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Board Summary Card */}
                        <div className="glass-panel p-8 rounded-3xl border border-amber-500/30 bg-gradient-to-r from-amber-500/5 to-transparent relative overflow-hidden group border-2">
                            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
                                <FileText className="w-48 h-48 text-amber-500" />
                            </div>
                            <div className="relative z-10">
                                <div className="flex items-center gap-4 mb-4">
                                    <div className="p-3 bg-amber-500/10 rounded-2xl">
                                        <Briefcase className="w-6 h-6 text-amber-500" />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-black text-white uppercase tracking-tight">{p.boardSummaryTitle}</h4>
                                        <p className="text-xs text-gray-500 font-medium">{p.boardSummarySub}</p>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-400 mb-8 max-w-xl leading-relaxed">
                                    {p.boardSummaryDesc}
                                </p>
                                <button
                                    onClick={handleExportExecutive}
                                    className="flex items-center gap-3 px-8 py-4 bg-amber-500 text-black font-black rounded-xl hover:scale-[1.02] transition-all shadow-xl shadow-amber-900/20 text-xs uppercase tracking-widest"
                                >
                                    <Download className="w-4 h-4" /> {p.boardExportBtn}
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
            )}
        </div>
    );
};

export default PortfolioScreen;
