import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, Download, FileText, Share2, Printer, Lock } from 'lucide-react';
import { } from '../types';

interface GovernanceGeneratorProps {
    score: number;
    analysis: any[];
    onRestart: () => void;
    corpName: string;
    leadEmail?: string;
    labels: any;
}

const GovernanceGenerator: React.FC<GovernanceGeneratorProps> = ({ score, analysis, onRestart, corpName, labels }) => {
    const [email, setEmail] = useState('');
    const [lgpdConsent, setLgpdConsent] = useState(false);
    const [showEmailModal, setShowEmailModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const riskLevel = score > 80 ? 'OPTIMAL' : score > 50 ? 'MANAGEABLE' : 'CRITICAL';
    const riskColor = score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500';

    const handlePrint = () => {
        window.print();
    };

    const handleShare = async () => {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: 'PartnerFit Score',
                    text: `We calculated a Synergy Score of ${score}/100 between ${corpName} and our startup.`,
                    url: window.location.href,
                });
            } catch (err) {
                console.error('Share failed', err);
            }
        } else {
            navigator.clipboard.writeText(window.location.href);
            alert('Link copied to clipboard!');
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
            <div className="glass-panel p-6 md:p-8 rounded-2xl mb-8 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8 border-t-4 border-t-white/10 print:border-none print:shadow-none">
                <div className="flex-1 text-center md:text-left">
                    <h2 className="text-body-highlight text-gray-400 mb-2">{labels.stepTitle}</h2>
                    <div className="text-heading-hero text-white mb-2">
                        {score}<span className="text-2xl md:text-3xl text-gray-600">/100</span>
                    </div>
                    <div className={`text-xl md:text-2xl tracking-widest font-bold ${riskColor}`}>
                        {labels.diagnosis.levelLabel}: {translatedRiskLevel}
                    </div>
                </div>

                <div className="flex gap-4 no-print">
                    <button onClick={handleShare} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors tooltip" title={labels.share}>
                        <Share2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                    <button onClick={handlePrint} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors" title={labels.print}>
                        <Printer className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                    <button onClick={() => setShowEmailModal(true)} className="p-4 bg-white/5 rounded-full hover:bg-white/10 transition-colors" title={labels.exportCsv}>
                        <Download className="w-5 h-5 md:w-6 md:h-6 text-white" />
                    </button>
                </div>
            </div>

            {/* Suggested Governance Clauses (The "Meat") */}
            {/* Suggested Governance Clauses (The "Meat") */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                {analysis.filter((dim: any) => dim.status !== 'optimal').map((dim: any) => {
                    // SMART DIAGNOSIS ENGINE logic
                    let recommendedService = null;

                    if (dim.id === 'ip') recommendedService = labels.diagnosis.services.gae;
                    else if (dim.id === 'risk') recommendedService = labels.diagnosis.services.asir;
                    else if (dim.id === 'speed') recommendedService = labels.diagnosis.services.saem;
                    else if (dim.id === 'cashflow') recommendedService = labels.diagnosis.services.etcd;

                    // Determine label name from translation if possible, else fallback
                    const dimLabel = labels.calibration.dimensions[dim.id]?.label || dim.label;

                    return (
                        <div key={dim.id} className="glass-panel p-6 rounded-xl border border-red-500/20 relative overflow-hidden flex flex-col h-full">
                            <div className="absolute top-0 right-0 p-2 opacity-10">
                                <AlertTriangle className="w-24 h-24 text-red-500" />
                            </div>
                            <h4 className="text-red-400 font-bold mb-1 flex items-center gap-2 text-sm md:text-base tracking-wide uppercase">
                                <Lock className="w-4 h-4" /> {labels.diagnosis.frictionDetected}: {dimLabel}
                            </h4>
                            <p className="text-gray-400 text-xs md:text-sm mb-4">
                                Gap: {dim.delta} points
                            </p>

                            {/* Service Card */}
                            <div className="mt-auto bg-black/40 p-4 rounded-lg border-l-2 border-l-vault-corp">
                                <div className="text-xs text-vault-corp font-bold mb-1 tracking-widest">ECOSYSTEM RECOMMENDATION</div>
                                <h5 className="text-white font-bold text-sm mb-1">{recommendedService?.title || "Consulting Session"}</h5>
                                <p className="text-gray-400 text-xs leading-relaxed">
                                    {recommendedService?.desc || "Schedule a session to align these vectors."}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {analysis.filter((dim: any) => dim.status === 'optimal').length > 0 && (
                    <div className="glass-panel p-6 rounded-xl border border-green-500/20 relative">
                        <h4 className="text-green-400 font-bold mb-4 flex items-center gap-2 text-sm md:text-base tracking-wide">
                            <CheckCircle className="w-4 h-4" /> {labels.diagnosis.optimalZone}
                        </h4>
                        <ul className="space-y-4">
                            {analysis.filter((dim: any) => dim.status === 'optimal').map((dim: any) => {
                                const dimLabel = labels.calibration.dimensions[dim.id]?.label || dim.label;
                                return (
                                    <li key={dim.id} className="text-gray-400 text-sm flex items-center gap-2">
                                        <div className="w-2 h-2 bg-green-500 rounded-full" />
                                        {dimLabel}
                                    </li>
                                );
                            })}
                        </ul>
                    </div>
                )}
            </div>

            {/* CTA Footer */}
            <div className="text-center mt-12 mb-12 no-print">
                <p className="text-gray-400 mb-4">Need help negotiating these terms?</p>
                <a
                    href="https://www.ephata.solutions/portfolio"
                    target="_blank"
                    rel=" noreferrer"
                    className="inline-flex items-center gap-3 px-8 py-4 bg-white text-black font-bold rounded-full hover:scale-105 transition-transform"
                >
                    TALK TO AN EXPERT <FileText className="w-4 h-4" />
                </a>
                <div className="mt-8">
                    <button onClick={onRestart} className="text-gray-600 hover:text-white text-sm underline">
                        {labels.restart}
                    </button>
                </div>
            </div>

            {/* CSV/Email Modal */}
            {showEmailModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] p-8 rounded-2xl w-full max-w-md border border-white/10 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-4">Export Analysis</h3>
                        <p className="text-gray-400 text-sm mb-6">Receive the raw CSV data and full report via email.</p>

                        <input
                            type="email"
                            placeholder="Your work email"
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
                                I agree to the processing of data for business contact purposes in accordance with LGPD/GDPR.
                            </span>
                        </label>

                        <div className="flex gap-4">
                            <button
                                onClick={() => setShowEmailModal(false)}
                                className="flex-1 py-3 text-gray-400 hover:text-white transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportCSV}
                                disabled={!email || !lgpdConsent || isSubmitting}
                                className={`flex-1 py-3 bg-green-600 text-white font-bold rounded-lg hover:bg-green-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed`}
                            >
                                {isSubmitting ? 'Sending...' : 'Download'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GovernanceGenerator;
