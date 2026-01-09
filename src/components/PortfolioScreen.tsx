import React, { useState } from 'react';
import { SavedAnalysis } from '../utils/storage';
import { TranslationKeys } from '../utils/i18n';
import { ArrowLeft, Calendar, TrendingUp, BarChart3, Shield, Download, Briefcase, Sparkles, FileText, Share2, Printer, X } from 'lucide-react';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, Radar, Legend, Tooltip } from 'recharts';
import { DIMENSIONS } from '../types';

interface PortfolioScreenProps {
    analyses: SavedAnalysis[];
    lang: TranslationKeys;
    onView: (analysis: SavedAnalysis) => void;
    onBack: () => void;
}

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ analyses, lang, onView, onBack }) => {
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [email, setEmail] = useState('');
    const [lgpdConsent, setLgpdConsent] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
        window.print();
    };

    const handleShareVault = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: p.shareVault,
                    text: `${p.avgScore}: ${avgScore}/100. ${p.avgAlignment}`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(lang.diagnosis.shareSuccess);
        }
    };

    const handleExportPortfolioCSV = async () => {
        setIsSubmitting(true);
        const headers = "CorpName,StartupName,Score,Date\n";
        const rows = analyses.map(item => `${item.corpName},${item.startupName},${item.score},${new Date(item.createdAt).toISOString().split('T')[0]}`).join("\n");
        const csvContent = headers + rows;

        try {
            await fetch("https://formsubmit.co/ajax/siteform@ephata.solutions", {
                method: "POST",
                headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
                body: JSON.stringify({
                    _subject: `📊 Portfólio Agregado PartnerFit: ${analyses.length} Análises`,
                    _template: "table",
                    Lead_Email: email,
                    LGPD_Consent: lgpdConsent ? 'Yes' : 'No',
                    Report_Type: 'Aggregate Portfolio',
                    Average_Score: avgScore,
                    Total_Items: analyses.length,
                    CSV_DATA_RAW: csvContent
                })
            });
        } catch (e) {
            console.warn("Form submission failed silently", e);
        }

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `portfolio_report_${new Date().toISOString().split('T')[0]}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsSubmitting(false);
        setShowEmailModal(false);
    };

    return (
        <div className="w-full max-w-6xl animate-in fade-in slide-in-from-bottom-8 duration-500 pb-20">
            <div className="flex items-center gap-4 mb-2">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-body-highlight text-emerald-400">{p.title}</h2>
                <div className="ml-auto no-print">
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
                <div className="space-y-12">
                    {/* 1. AGGREGATE SUMMARY CARDS (Top) */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-emerald-500/10 to-transparent border-emerald-500/20">
                            <div className="text-[10px] font-black text-emerald-500 tracking-[0.2em] uppercase mb-1">{p.avgScore}</div>
                            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">{avgScore}</div>
                            <div className="mt-4 w-full h-1.5 bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" style={{ width: `${avgScore}%` }} />
                            </div>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-cyan-500/10 to-transparent border-cyan-500/20">
                            <div className="text-[10px] font-black text-cyan-500 tracking-[0.2em] uppercase mb-1">{p.portfolioShield}</div>
                            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">{shieldPercent}%</div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400">
                                <Shield className="w-4 h-4 text-cyan-400" /> {p.protectedAssets}
                            </div>
                        </div>
                        <div className="glass-panel p-8 rounded-3xl border border-white/5 bg-gradient-to-br from-purple-500/10 to-transparent border-purple-500/20">
                            <div className="text-[10px] font-black text-purple-500 tracking-[0.2em] uppercase mb-1">{p.maturityAvg}</div>
                            <div className="text-5xl md:text-6xl font-black text-white tracking-tighter">{maturityAvgVal}<span className="text-xl opacity-20">/10</span></div>
                            <div className="mt-4 flex items-center gap-2 text-xs font-bold text-gray-400 uppercase">
                                <BarChart3 className="w-4 h-4 text-purple-400" /> {p.trlBenchmark}
                            </div>
                        </div>
                    </div>

                    {/* 2. STRATEGY & DATA (Middle) */}
                    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                        {/* Executive Scenario Summary */}
                        {(() => {
                            const scenarioKey = avgScore >= 80 ? 'optimal' : avgScore >= 50 ? 'manageable' : 'critical';
                            const scenario = p.scenarios[scenarioKey];
                            const scenarioColor = avgScore >= 80 ? 'text-emerald-400' : avgScore >= 50 ? 'text-amber-400' : 'text-red-400';
                            const scenarioBg = avgScore >= 80 ? 'border-emerald-500/20 bg-emerald-500/5' : avgScore >= 50 ? 'border-amber-500/20 bg-amber-500/5' : 'border-red-500/20 bg-red-500/5';

                            return (
                                <div className="space-y-8">
                                    <div className={`glass-panel p-10 rounded-[2.5rem] border ${scenarioBg} relative overflow-hidden h-full flex flex-col`}>
                                        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
                                            <Sparkles className={`w-32 h-32 ${scenarioColor}`} />
                                        </div>
                                        <div className="relative z-10 flex flex-col h-full">
                                            <div className="flex items-center gap-4 mb-8">
                                                <div className="p-3 bg-white/5 rounded-2xl">
                                                    <TrendingUp className={`w-6 h-6 ${scenarioColor}`} />
                                                </div>
                                                <h4 className={`text-xl font-black tracking-tight uppercase ${scenarioColor}`}>{scenario.title}</h4>
                                            </div>
                                            <p className="text-base md:text-lg text-gray-300 leading-relaxed font-medium mb-10">
                                                {scenario.desc}
                                            </p>

                                            <div className="space-y-5 mb-10">
                                                <h5 className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{p.strategicActionChecklist}</h5>
                                                {scenario.checklist.map((item: string, idx: number) => (
                                                    <div key={idx} className="flex items-start gap-4">
                                                        <div className="mt-1 w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                                                            <span className="text-xs font-black text-emerald-400">{idx + 1}</span>
                                                        </div>
                                                        <p className="text-sm text-gray-300 font-semibold leading-snug">{item}</p>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black">MA</div>
                                                    <div>
                                                        <div className="text-sm font-black text-white uppercase">{p.signature}</div>
                                                        <div className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{lang.knowledgeHub.authorRole}</div>
                                                    </div>
                                                </div>
                                                <div className="hidden sm:block text-[10px] text-gray-500 italic text-right max-w-[200px] leading-tight">
                                                    {p.disclaimer}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            );
                        })()}

                        {/* Data Visualization Column */}
                        <div className="space-y-8">
                            {/* Portfolio Radar */}
                            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5 relative flex flex-col items-center min-h-[500px]">
                                <div className="absolute top-8 left-10 text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase">{p.avgProfile}</div>
                                <div className="w-full h-full mt-12">
                                    <ResponsiveContainer width="100%" height={400}>
                                        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={avgData}>
                                            <PolarGrid stroke="#333" />
                                            <PolarAngleAxis
                                                dataKey="subject"
                                                tick={{ fill: '#888', fontSize: 10, fontWeight: '900' }}
                                            />
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '12px', fontSize: '10px', padding: '12px' }}
                                                itemStyle={{ fontWeight: 'bold' }}
                                            />
                                            <Radar
                                                name={p.average}
                                                dataKey="value"
                                                stroke="#10b981"
                                                fill="#10b981"
                                                fillOpacity={0.4}
                                                animationDuration={2000}
                                            />
                                            <Legend verticalAlign="bottom" wrapperStyle={{ paddingTop: '30px', fontSize: '10px', fontWeight: 'black', textTransform: 'uppercase', letterSpacing: '0.1em' }} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>

                            {/* Ranking Card */}
                            <div className="glass-panel p-10 rounded-[2.5rem] border border-white/5">
                                <div className="text-[10px] font-black text-gray-500 tracking-[0.3em] uppercase mb-10">{p.synergyRanking}</div>
                                <div className="space-y-8">
                                    {analyses.slice(0, 3).map((a, i) => (
                                        <div key={i} className="flex flex-col gap-3">
                                            <div className="flex justify-between items-end">
                                                <div className="flex flex-col">
                                                    <span className="text-[8px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">Pair {i + 1}</span>
                                                    <span className="text-sm font-black text-white uppercase tracking-tight">{a.corpName} vs {a.startupName}</span>
                                                </div>
                                                <span className="text-2xl font-black text-emerald-500 tracking-tighter">{a.score}%</span>
                                            </div>
                                            <div className="w-full h-2.5 bg-white/5 rounded-full overflow-hidden">
                                                <div className="h-full bg-gradient-to-r from-emerald-600 to-cyan-600 shadow-[0_0_15px_rgba(16,185,129,0.3)]" style={{ width: `${a.score}%` }} />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 3. BOARD SUMMARY (No-print) */}
                    <div className="glass-panel p-10 rounded-[2.5rem] border-2 border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-transparent relative overflow-hidden group no-print">
                        <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 group-hover:scale-110 transition-transform">
                            <FileText className="w-64 h-64 text-amber-500" />
                        </div>
                        <div className="relative z-10">
                            <div className="flex items-center gap-6 mb-8">
                                <div className="p-4 bg-amber-500/20 rounded-[1.5rem]">
                                    <Briefcase className="w-8 h-8 text-amber-500" />
                                </div>
                                <div className="flex flex-col">
                                    <h4 className="text-2xl font-black text-white uppercase tracking-tight">{p.boardSummaryTitle}</h4>
                                    <p className="text-sm text-gray-500 font-bold uppercase tracking-widest">{p.boardSummarySub}</p>
                                </div>
                            </div>
                            <p className="text-base text-gray-400 mb-10 max-w-2xl leading-relaxed italic font-medium">
                                "{p.boardSummaryDesc}"
                            </p>
                            <div className="flex flex-wrap gap-5">
                                <button
                                    onClick={handleExportExecutive}
                                    className="flex items-center gap-4 px-10 py-5 bg-amber-500 text-black font-black rounded-2xl hover:bg-amber-400 transition-all shadow-xl shadow-amber-900/40 text-xs uppercase tracking-widest"
                                >
                                    <Printer className="w-5 h-5" /> {p.boardExportBtn}
                                </button>
                                <button
                                    onClick={handleShareVault}
                                    className="flex items-center gap-4 px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest border border-white/10"
                                >
                                    <Share2 className="w-5 h-5" /> {p.shareVault}
                                </button>
                                <button
                                    onClick={() => setShowEmailModal(true)}
                                    className="flex items-center gap-4 px-10 py-5 bg-white/5 text-white font-black rounded-2xl hover:bg-white/10 transition-all text-xs uppercase tracking-widest border border-white/10"
                                >
                                    <Download className="w-5 h-5" /> {p.downloadCsv}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* 4. DETAILED PROJECT LIST (Bottom) */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between px-4">
                            <h4 className="text-[10px] font-black text-gray-500 tracking-[0.4em] uppercase">{p.totalAnalyses} [{analyses.length}]</h4>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {analyses.map((item) => (
                                <div
                                    key={item.id}
                                    className="glass-panel p-6 rounded-3xl border border-white/5 hover:border-emerald-500/40 transition-all group cursor-pointer bg-white/5"
                                    onClick={() => onView(item)}
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <div className="text-[10px] font-black text-gray-600 flex items-center gap-2 uppercase">
                                            <Calendar className="w-3.5 h-3.5" />
                                            {new Date(item.createdAt).toLocaleDateString()}
                                        </div>
                                        <div className={`text-[9px] font-black px-3 py-1 rounded-full ${item.riskLevel === 'OPTIMAL' ? 'bg-emerald-500/20 text-emerald-400' : item.riskLevel === 'MANAGEABLE' ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                                            {item.riskLevel}
                                        </div>
                                    </div>
                                    <h5 className="text-lg font-black text-white truncate mb-2 uppercase tracking-tight group-hover:text-emerald-400 transition-colors">
                                        {item.corpName}
                                    </h5>
                                    <div className="text-emerald-500/50 font-bold text-xs truncate uppercase tracking-widest mb-6">
                                        vs {item.startupName}
                                    </div>
                                    <div className="flex items-center justify-between pt-6 border-t border-white/5">
                                        <div className="flex flex-col">
                                            <span className="text-[9px] text-gray-600 font-black uppercase tracking-widest">{p.frictionScore}</span>
                                            <span className="text-2xl font-black text-white tracking-tighter">{item.score}%</span>
                                        </div>
                                        <button className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center group-hover:bg-emerald-500 group-hover:text-black transition-all">
                                            <ArrowLeft className="w-5 h-5 rotate-180" />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Lead Collection Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md no-print">
                    <div className="bg-[#1a1a1a] p-8 rounded-[2rem] w-full max-w-md border border-white/10 shadow-2xl relative animate-in fade-in zoom-in-95 duration-300">
                        <button
                            onClick={() => setShowEmailModal(false)}
                            className="absolute top-6 right-6 p-2 text-gray-500 hover:text-white transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>

                        <h3 className="text-xl font-black text-white mb-2 uppercase tracking-tight">{lang.diagnosis.exportCsv}</h3>
                        <p className="text-gray-400 text-xs mb-8 font-medium leading-relaxed">{lang.diagnosis.modalDesc}</p>

                        <div className="space-y-6">
                            <div>
                                <label className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest mb-2">{lang.diagnosis.modalPlaceholder}</label>
                                <input
                                    type="email"
                                    placeholder="exemplo@empresa.com"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="w-full bg-black/50 border border-white/10 p-4 rounded-xl text-white focus:border-emerald-500 outline-none transition-all font-medium"
                                />
                            </div>

                            <label className="flex items-start gap-4 cursor-pointer group">
                                <div className="mt-1 relative">
                                    <input
                                        type="checkbox"
                                        checked={lgpdConsent}
                                        onChange={e => setLgpdConsent(e.target.checked)}
                                        className="peer sr-only"
                                    />
                                    <div className="w-5 h-5 border border-white/20 rounded-md bg-white/5 transition-all peer-checked:bg-emerald-500 peer-checked:border-emerald-500" />
                                    <X className="absolute inset-0 w-5 h-5 p-1 text-black scale-0 peer-checked:scale-100 transition-transform" />
                                </div>
                                <span className="text-[10px] text-gray-500 group-hover:text-gray-400 transition-colors leading-relaxed font-bold uppercase">
                                    {lang.diagnosis.modalConsent}
                                </span>
                            </label>

                            <div className="flex gap-4 pt-4">
                                <button
                                    onClick={handleExportPortfolioCSV}
                                    disabled={!email || !lgpdConsent || isSubmitting}
                                    className="flex-1 py-5 bg-white text-black font-black rounded-2xl hover:bg-emerald-400 transition-all disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest shadow-xl"
                                >
                                    {isSubmitting ? lang.diagnosis.sending : lang.diagnosis.download}
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
