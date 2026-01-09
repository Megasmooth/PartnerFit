import React, { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle, Download, Share2, Printer, Lock, MessageCircle, Sparkles, TrendingUp, Info } from 'lucide-react';
import { generateExecutivePDF } from '../utils/pdfGenerator';

interface GovernanceGeneratorProps {
    score: number;
    analysis: any[];
    onRestart: () => void;
    corpName: string;
    startupName: string; // Added startupName
    leadEmail?: string;
    labels: any;
}

const GovernanceGenerator: React.FC<GovernanceGeneratorProps> = ({ score, analysis, onRestart, corpName, startupName, labels }) => {
    const [email, setEmail] = useState('');
    const [lgpdConsent, setLgpdConsent] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const scenarioKey = score > 80 ? 'optimal' : score > 50 ? 'manageable' : 'critical';
    const riskLevel = scenarioKey.toUpperCase();

    // Stable Quote for PDF and UI
    const randomQuote = useMemo(() => {
        const quotes = labels.knowledgeHub.marcioQuotes[scenarioKey];
        return quotes[Math.floor(Math.random() * quotes.length)];
    }, [scenarioKey, labels]);

    const handlePrint = async () => {
        const scenario = labels.portfolio.scenarios[scenarioKey];
        await generateExecutivePDF({
            corpName,
            startupName,
            score,
            riskLevel,
            analysis,
            date: new Date().toLocaleDateString(),
            scenario: {
                title: scenario.title,
                desc: scenario.desc,
                checklist: scenario.checklist
            },
            authorQuote: randomQuote
        }, labels);
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                const summary = analysis.map((dim: any) => `${dim.label}: ${dim.delta}`).join(', ');
                await navigator.share({
                    title: 'PartnerFit Executive Report',
                    text: `PartnerFit Diagnosis: ${score}/100 Synergy between ${corpName} and ${startupName}.\n\nDetailed Frictions: ${summary}\n\nAnalyze your partnership at:`,
                    url: 'https://partnerfit.ephata.solutions/',
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert(labels.diagnosis.shareSuccess);
        }
    };

    const handleExportCSV = async () => {
        setIsSubmitting(true);

        // 1. Generate CSV Data
        const headers = "Dimension,CorpValue,StartupValue,Delta,Status\n";
        const rows = analysis.map((item: any) =>
            `${item.label},${item.corpVal},${item.startVal},${item.delta},${item.status}`
        ).join("\n");
        const csvContent = headers + rows;

        // 2. Send to FormSubmit
        try {
            await fetch("https://formsubmit.co/ajax/siteform@ephata.solutions", {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    _subject: `📊 Novo Dossiê PartnerFit: ${score}/100`,
                    _template: "table",
                    Lead_Email: email,
                    LGPD_Consent: lgpdConsent ? 'Yes' : 'No',
                    Partner_Name: corpName,
                    Total_Score: score,
                    CSV_DATA_RAW: csvContent
                })
            });
        } catch (e) {
            console.warn("Form submission failed silently (CORS or network)", e);
        }

        // 3. Download Blob
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement("a");
        const url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", `partnerfit_report_${corpName.replace(/\s/g, '_')}.csv`);
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        setIsSubmitting(false);
        setShowEmailModal(false);
    };

    const translatedRiskLevel = labels.diagnosis[riskLevel.toLowerCase()] || riskLevel;

    return (
        <div className="w-full max-w-5xl mx-auto pb-24">
            {/* Header Result */}
            <div className="glass-panel p-8 rounded-3xl mb-12 flex flex-col md:flex-row items-center justify-between gap-8 border border-white/5 bg-gradient-to-br from-emerald-500/5 to-transparent relative overflow-hidden group">
                <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none group-hover:bg-white/10 transition-colors" />

                <div className="flex-1 text-center md:text-left relative z-10">
                    <h2 className="text-[10px] font-black text-gray-500 tracking-[0.2em] uppercase mb-4">{labels.diagnosis.stepTitle}</h2>
                    <div className="text-6xl md:text-7xl font-black text-white mb-4 tracking-tighter">
                        {score}<span className="text-3xl md:text-4xl text-gray-700">/100</span>
                    </div>
                </div>

                <div className="flex flex-col items-center md:items-end gap-6 relative z-10 w-full md:w-auto">
                    <div className={`px-6 py-2 rounded-full border ${score > 80 ? 'border-emerald-500/30 bg-emerald-500/10 text-emerald-400' : score > 50 ? 'border-amber-500/30 bg-amber-500/10 text-amber-400' : 'border-red-500/30 bg-red-500/10 text-red-500'} font-black text-xs tracking-widest uppercase`}>
                        {labels.diagnosis.levelLabel}: {translatedRiskLevel}
                    </div>
                    <div className="flex gap-4 no-print">
                        <button onClick={handleShare} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:scale-110 active:scale-95 text-white" title={labels.diagnosis.share}>
                            <Share2 className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button onClick={handlePrint} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:scale-110 active:scale-95 text-white" title={labels.diagnosis.print}>
                            <Printer className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button onClick={() => setShowEmailModal(true)} className="p-4 bg-white/5 rounded-2xl hover:bg-white/10 transition-all border border-white/5 hover:scale-110 active:scale-95 text-white" title={labels.diagnosis.exportCsv}>
                            <Download className="w-5 h-5 md:w-6 md:h-6" />
                        </button>
                        <button onClick={onRestart} className="px-6 py-4 bg-white text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_15px_30px_rgba(255,255,255,0.1)] text-[10px] uppercase tracking-widest flex items-center gap-2">
                            <Sparkles className="w-4 h-4" />
                            {labels.diagnosis.restart}
                        </button>
                    </div>
                </div>
            </div>

            {/* Suggested Governance Clauses */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                {analysis.filter((dim: any) => dim.status !== 'optimal').map((dim: any) => {
                    let recommendedService = null;
                    if (dim.id === 'ip') recommendedService = labels.diagnosis.services.gae;
                    else if (dim.id === 'risk') recommendedService = labels.diagnosis.services.asir;
                    else if (dim.id === 'speed') recommendedService = labels.diagnosis.services.saem;
                    else if (dim.id === 'cashflow') recommendedService = labels.diagnosis.services.etcd;

                    const dimLabel = labels.calibration.dimensions[dim.id]?.label || dim.label;
                    const isCritical = dim.delta > 4;

                    return (
                        <div key={dim.id} className={`glass-panel p-8 rounded-3xl border ${isCritical ? 'border-red-500/20 bg-red-500/5' : 'border-amber-500/20 bg-amber-500/5'} relative overflow-hidden flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-500`}>
                            <div className="absolute -top-4 -right-4 p-4 opacity-5">
                                {isCritical ? <AlertTriangle className="w-24 h-24 text-red-500" /> : <Lock className="w-24 h-24 text-amber-500" />}
                            </div>

                            <div className="flex items-center gap-3 mb-6 relative z-10">
                                <div className={`p-2 rounded-lg ${isCritical ? 'bg-red-500/10' : 'bg-amber-500/10'}`}>
                                    {isCritical ? <AlertTriangle className="w-4 h-4 text-red-500" /> : <Lock className="w-4 h-4 text-amber-500" />}
                                </div>
                                <h4 className={`${isCritical ? 'text-red-400' : 'text-amber-400'} font-black text-xs tracking-[0.1em] uppercase`}>
                                    {dimLabel}
                                </h4>
                            </div>

                            <div className="text-3xl font-black text-white mb-1 tracking-tighter">
                                {dim.delta} <span className="text-[10px] text-gray-600 font-bold uppercase tracking-widest">{labels.diagnosis.frictionDetected}</span>
                            </div>

                            <p className="text-[11px] text-gray-500 font-bold uppercase tracking-widest mb-8">
                                STATUS: {isCritical ? 'CRITICAL' : 'MODERATE'}
                            </p>

                            {/* Service Card */}
                            <div className="mt-auto bg-black border border-white/5 p-5 rounded-2xl group/svc hover:border-emerald-500/30 transition-all shadow-2xl relative z-10">
                                <div className="text-[8px] text-emerald-500 font-black mb-2 tracking-[0.2em] uppercase flex items-center gap-2">
                                    <TrendingUp className="w-3 h-3" />
                                    {labels.diagnosis.servicesTitle}
                                </div>
                                <h5 className="text-white font-black text-sm mb-2 uppercase tracking-tight leading-tight">{recommendedService?.title || "Consulting Session"}</h5>
                                <p className="text-[10px] text-gray-500 leading-relaxed font-medium">
                                    {recommendedService?.desc || "Schedule a session to align these vectors."}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {/* Optimal Zones Redesigned */}
                {analysis.filter((dim: any) => dim.status === 'optimal').length > 0 && (
                    <div className="glass-panel p-8 rounded-3xl border border-emerald-500/20 bg-emerald-500/5 relative flex flex-col animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <CheckCircle className="w-4 h-4 text-emerald-500" />
                            </div>
                            <h4 className="text-emerald-400 font-black text-xs tracking-[0.1em] uppercase">
                                {labels.diagnosis.optimalZone}
                            </h4>
                        </div>
                        <div className="space-y-4">
                            {analysis.filter((dim: any) => dim.status === 'optimal').map((dim: any) => {
                                const dimLabel = labels.calibration.dimensions[dim.id]?.label || dim.label;
                                return (
                                    <div key={dim.id} className="flex items-center gap-3 group/opt">
                                        <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full group-hover/opt:scale-150 transition-transform" />
                                        <span className="text-xs text-gray-400 font-bold uppercase tracking-widest group-hover/opt:text-white transition-colors">
                                            {dimLabel}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                        <div className="mt-8 pt-6 border-t border-emerald-500/10">
                            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed">
                                DIMENSIONS WITH FULL ALIGNMENT. NO MITIGATION REQUIRED.
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* CTA Footer with Randomized Marcio Quote */}
            {(() => {
                const scenarioKey = score > 80 ? 'optimal' : score > 50 ? 'manageable' : 'critical';
                const quotes = labels.portfolio.marcioQuotes[scenarioKey];
                const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];

                return (
                    <div className="mt-20 mb-20 space-y-12">
                        {/* Randomized High-End Quote */}
                        <div className="relative max-w-2xl mx-auto px-8 py-12 glass-panel rounded-[2rem] border border-white/5 bg-gradient-to-br from-white/5 to-transparent flex flex-col items-center text-center group no-print">
                            <div className="absolute top-0 left-0 p-8 opacity-5">
                                <Info className="w-32 h-32 text-white" />
                            </div>
                            <p className="text-lg md:text-xl font-medium text-white italic leading-relaxed mb-8 relative z-10 tracking-tight">
                                "{randomQuote}"
                            </p>

                            <div className="flex flex-col items-center gap-2 relative z-10">
                                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-emerald-500 to-cyan-500 flex items-center justify-center text-black font-black text-sm mb-2">MA</div>
                                <div className="text-xs font-black text-white uppercase tracking-widest">{labels.portfolio.signature}</div>
                                <div className="text-[10px] text-gray-500 font-black uppercase tracking-[0.3em]">{labels.knowledgeHub.authorRole}</div>
                            </div>
                        </div>

                        {/* Consulting Box */}
                        <div className="glass-panel p-10 rounded-[2.5rem] border border-emerald-500/20 bg-emerald-500/5 relative overflow-hidden group no-print max-w-3xl mx-auto">
                            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none group-hover:bg-emerald-500/20 transition-colors" />
                            <div className="relative z-10 text-center flex flex-col items-center">
                                <div className="p-3 bg-emerald-500/10 rounded-2xl mb-6">
                                    <MessageCircle className="w-8 h-8 text-emerald-500" />
                                </div>
                                <h4 className="text-xl md:text-2xl font-black text-white mb-4 uppercase tracking-tighter">{labels.diagnosis.expertTitle}</h4>
                                <p className="text-xs md:text-sm text-gray-500 font-bold uppercase tracking-[0.2em] mb-10 max-w-md">{labels.portfolio.consultingCTA}</p>
                                <a
                                    href={labels.knowledgeHub.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-4 px-12 py-5 bg-emerald-500 text-black font-black rounded-2xl hover:scale-105 transition-all shadow-[0_20px_40px_rgba(16,185,129,0.3)] group text-sm uppercase tracking-widest"
                                >
                                    <MessageCircle className="w-6 h-6 group-hover:rotate-12 transition-transform" />
                                    {labels.diagnosis.expertBtn.toUpperCase()}
                                </a>
                            </div>
                        </div>

                        {/* Disclaimer */}
                        <div className="max-w-2xl mx-auto text-center px-8">
                            <p className="text-[10px] text-gray-600 leading-snug italic font-medium opacity-60">
                                {labels.portfolio.disclaimer}
                            </p>
                        </div>
                    </div>
                );
            })()}

            {/* CSV/Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">{labels.diagnosis.exportCsv}</h3>
                        <p className="text-gray-400 text-sm mb-6">{labels.diagnosis.modalDesc}</p>

                        <input
                            type="email"
                            placeholder={labels.diagnosis.modalPlaceholder}
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full bg-black border border-gray-700 p-3 rounded-lg text-white mb-4 focus:border-green-500 outline-none"
                        />

                        <label className="flex items-start gap-3 mb-6 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={lgpdConsent}
                                onChange={e => setLgpdConsent(e.target.checked)}
                                className="mt-1 w-4 h-4 rounded border-gray-700 bg-black checked:bg-green-500"
                            />
                            <span className="text-xs text-gray-500 group-hover:text-gray-400 transition-colors">
                                {labels.diagnosis.modalConsent}
                            </span>
                        </label>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="flex-1 py-3 text-gray-400 hover:text-white transition-colors text-sm font-bold uppercase tracking-widest"
                            >
                                {labels.diagnosis.cancel}
                            </button>
                            <button
                                onClick={handleExportCSV}
                                disabled={!email || !lgpdConsent || isSubmitting}
                                className={`flex-1 py-3 bg-white text-black font-black rounded-lg hover:bg-emerald-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-xs uppercase tracking-widest`}
                            >
                                {isSubmitting ? labels.diagnosis.sending : labels.diagnosis.download}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernanceGenerator;
