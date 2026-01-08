import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain, ExternalLink, User, ShieldCheck, Linkedin, Globe, ChevronDown, Download, Sparkles } from 'lucide-react';

interface KnowledgeHubProps {
    isOpen: boolean;
    onClose: () => void;
    labels: any;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ isOpen, onClose, labels }) => {
    const t = labels.knowledgeHub;
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60]"
                    />

                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 30, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-xl bg-[#0a0a0c] border-l border-white/10 shadow-[0_0_50px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden"
                    >
                        {/* Header */}
                        <div className="sticky top-0 bg-[#0a0a0c]/90 backdrop-blur-xl z-20 border-b border-white/5 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-widest uppercase">{t.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-10 pb-16 custom-scrollbar">

                            {/* Author Card */}
                            <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-900 via-black to-slate-900 p-8 border border-white/10 shadow-2xl group">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -mr-32 -mt-32 pointer-events-none group-hover:bg-emerald-500/10 transition-colors duration-700" />

                                <div className="flex flex-col gap-6 relative z-10">
                                    <div className="flex items-center gap-6">
                                        <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-400/20 to-cyan-400/20 flex items-center justify-center border border-white/10 shadow-inner overflow-hidden shrink-0">
                                            <User className="w-10 h-10 text-emerald-400" />
                                        </div>
                                        <div>
                                            <div className="text-[10px] font-black text-amber-500 mb-1 tracking-[0.3em] uppercase">{t.authorTitle}</div>
                                            <h3 className="text-3xl font-black text-white mb-1">Marcio Almeida</h3>
                                            <p className="text-xs font-bold text-emerald-400/60 uppercase tracking-widest leading-tight">{t.authorRole}</p>
                                        </div>
                                    </div>

                                    <p className="text-sm text-gray-400 leading-relaxed font-medium">
                                        {t.authorBio}
                                    </p>

                                    <div className="grid grid-cols-2 gap-3">
                                        <a href={t.linkedinUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-cyan-600/20 hover:bg-cyan-600/30 text-cyan-400 rounded-xl text-xs font-bold transition-all border border-cyan-500/20">
                                            <Linkedin className="w-4 h-4" /> {t.authorLinkedin}
                                        </a>
                                        <a href={t.portfolioUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 py-3 bg-white/5 hover:bg-white/10 text-white rounded-xl text-xs font-bold transition-all border border-white/5">
                                            <Globe className="w-4 h-4" /> {t.authorWebsite}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Methodology */}
                            <div className="space-y-6">
                                <div className="flex items-center gap-3 border-l-4 border-amber-500 pl-4">
                                    <Sparkles className="w-5 h-5 text-amber-500" />
                                    <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">{t.aboutTitle}</h3>
                                </div>
                                <p className="text-gray-400 text-sm leading-relaxed mb-6 font-medium italic opacity-80">
                                    {t.aboutText}
                                </p>
                                <div className="space-y-4">
                                    {[t.methodology.p1, t.methodology.p2, t.methodology.p3].map((p: string, i: number) => {
                                        const [title, content] = p.split(': ');
                                        return (
                                            <div key={i} className="p-5 bg-white/[0.02] rounded-2xl border border-white/5 hover:bg-white/[0.04] transition-colors">
                                                <div className="text-xs text-gray-300 leading-relaxed">
                                                    <strong className="text-amber-500 block mb-1 uppercase tracking-tighter">{title}</strong>
                                                    {content}
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* FAQ Details */}
                            <div className="space-y-6 pt-4">
                                <div className="flex items-center gap-3">
                                    <Brain className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-sm font-black text-white tracking-[0.2em] uppercase">{t.faqTitle}</h3>
                                </div>
                                <div className="space-y-3">
                                    {t.faq.map((item: any, i: number) => (
                                        <div key={i} className="group glass-panel rounded-2xl overflow-hidden border border-white/5">
                                            <div
                                                className="p-5 flex justify-between items-center cursor-pointer hover:bg-white/5 transition-colors"
                                                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                                            >
                                                <h4 className="text-sm font-bold text-amber-500/90 leading-snug pr-4">{item.q}</h4>
                                                <ChevronDown className={`w-4 h-4 text-gray-600 shrink-0 transition-transform duration-300 ${openFaq === i ? 'rotate-180 text-amber-500' : 'group-hover:text-amber-500'}`} />
                                            </div>
                                            {openFaq === i && (
                                                <div className="px-5 pb-5 animate-in fade-in slide-in-from-top-2 duration-300">
                                                    <p className="text-xs text-gray-400 leading-relaxed border-t border-white/5 pt-4">
                                                        {item.a}
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Deepen Strategy Special Card */}
                            <div className="relative rounded-3xl bg-amber-500 p-8 text-black overflow-hidden group shadow-[0_20px_40px_rgba(245,158,11,0.2)]">
                                <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                                    <Sparkles className="w-32 h-32" />
                                </div>
                                <div className="relative z-10 flex flex-col gap-6">
                                    <div>
                                        <h4 className="text-xs font-black tracking-[0.3em] uppercase mb-2 opacity-60">{t.deepenTitleLabel || 'Deepen Strategy'}</h4>
                                        <h3 className="text-2xl font-black mb-2 uppercase leading-tight tracking-tighter">
                                            {t.deepenTitle}
                                        </h3>
                                        <p className="text-sm font-bold leading-relaxed opacity-80">
                                            {t.deepenDesc}
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-1 gap-3">
                                        <a href={t.downloadPortfolioUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-black text-white rounded-xl font-bold text-sm text-center flex items-center justify-center gap-2 hover:bg-slate-900 transition-all shadow-xl">
                                            <Download className="w-4 h-4" /> {t.deepenBtn}
                                        </a>
                                        <a href={t.whatsappUrl} target="_blank" rel="noreferrer" className="w-full py-4 bg-black/10 border-2 border-black/20 text-black rounded-xl font-bold text-sm text-center hover:bg-black/20 transition-all">
                                            {t.whatsappBtn}
                                        </a>
                                    </div>
                                </div>
                            </div>

                            {/* Synapsys Card */}
                            <div className="relative rounded-2xl border border-purple-500/20 bg-purple-500/5 p-6 group">
                                <div className="flex justify-between items-start mb-6">
                                    <div className="space-y-1">
                                        <h4 className="text-lg font-black text-purple-400 uppercase tracking-tighter">{t.synapsysTitle}</h4>
                                        <p className="text-[10px] text-gray-500 leading-relaxed max-w-[200px]">{t.synapsysDesc}</p>
                                    </div>
                                    <Brain className="w-8 h-8 text-purple-500/40 animate-pulse" />
                                </div>
                                <a href={t.synapsysUrl} target="_blank" rel="noreferrer" className="w-full py-3 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-900/40">
                                    {t.synapsysBtn} <ExternalLink className="w-3 h-3" />
                                </a>
                            </div>

                            {/* Compliance */}
                            <div className="pt-8 border-t border-white/5 flex items-start gap-3 text-gray-600">
                                <ShieldCheck className="w-5 h-5 shrink-0 opacity-40" />
                                <div className="space-y-1">
                                    <div className="text-[10px] font-black tracking-widest uppercase opacity-40 font-mono">LGPD/GDPR PROOF</div>
                                    <p className="text-[9px] leading-relaxed opacity-30 font-medium">
                                        {labels.nav.home === 'HOME'
                                            ? "This application follows LGPD guidelines. No confidential information is stored externally without express authorization."
                                            : "Este aplicativo segue as diretrizes da LGPD. Nenhuma informação confidencial é armazenada externamente sem sua autorização expressa."
                                        }
                                    </p>
                                </div>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default KnowledgeHub;
