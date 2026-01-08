import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain, ExternalLink, MessageCircle, FileText, User, ShieldCheck } from 'lucide-react';

interface KnowledgeHubProps {
    isOpen: boolean;
    onClose: () => void;
    labels: any;
}

const KnowledgeHub: React.FC<KnowledgeHubProps> = ({ isOpen, onClose, labels }) => {
    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop: z-[60] as per spec */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer: z-[70], right-0, spring physics as per spec */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-vault-card border-l border-white/10 shadow-2xl flex flex-col overflow-hidden"
                    >
                        {/* A. Sticky Header */}
                        <div className="sticky top-0 bg-vault-card/95 backdrop-blur-md z-20 border-b border-white/5 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-tight uppercase">{labels.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Scrollable Content */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8 pb-12 custom-scrollbar">

                            {/* B. Autoridade (Marcio Almeida) */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-black p-6 border border-white/10 group">
                                {/* Glow effect blur-3xl */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/30 transition-colors duration-500" />

                                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 relative z-10 text-center sm:text-left">
                                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-white/10 shadow-xl overflow-hidden shrink-0">
                                        <User className="w-10 h-10 text-emerald-400" />
                                    </div>
                                    <div>
                                        <div className="text-[10px] font-black text-emerald-500 mb-1 tracking-[0.2em] uppercase">{labels.authorTitle}</div>
                                        <h3 className="text-2xl font-bold text-white mb-1">Marcio Almeida</h3>
                                        <p className="text-sm font-medium text-emerald-400/80 mb-3">{labels.authorRole}</p>
                                        <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
                                            {labels.authorBio}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* C. Metodologia / Algorithm */}
                            <div className="space-y-4">
                                <div className="flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-cyan-400" />
                                    <h3 className="text-sm font-bold text-white tracking-widest uppercase">{labels.aboutTitle}</h3>
                                </div>
                                <div className="p-5 bg-white/5 rounded-xl border border-white/5">
                                    <p className="text-gray-400 leading-relaxed text-sm">
                                        {labels.aboutText}
                                    </p>
                                </div>
                            </div>

                            {/* D. Synapsys Card */}
                            <div className="relative group overflow-hidden rounded-2xl border border-purple-500/30 bg-black/40 hover:border-purple-500/50 transition-all duration-300">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-6 relative z-10 flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                                                {labels.synapsysTitle}
                                            </h4>
                                            <p className="text-xs text-gray-400 max-w-[200px] leading-relaxed">
                                                {labels.synapsysDesc}
                                            </p>
                                        </div>
                                        <div className="p-2 bg-purple-500/10 rounded-lg">
                                            <Brain className="w-6 h-6 text-purple-400 animate-pulse" />
                                        </div>
                                    </div>

                                    <button className="w-full mt-2 py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white text-xs tracking-widest uppercase shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2">
                                        {labels.synapsysBtn} <ExternalLink className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>

                            {/* E. Action Grid & Footer */}
                            <div className="grid grid-cols-1 gap-3">
                                <a
                                    href={labels.whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-emerald-500/5 border border-emerald-500/10 rounded-xl hover:bg-emerald-500/10 hover:border-emerald-500/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-emerald-500/10 rounded-lg text-emerald-400">
                                            <MessageCircle className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-white text-sm uppercase tracking-wide">{labels.whatsappBtn}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-emerald-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </a>

                                <a
                                    href={labels.portfolioUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-cyan-500/5 border border-cyan-500/10 rounded-xl hover:bg-cyan-500/10 hover:border-cyan-500/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-cyan-500/10 rounded-lg text-cyan-400">
                                            <FileText className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-white text-sm uppercase tracking-wide">{labels.portfolioBtn}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-cyan-500 opacity-40 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>

                            {/* Compliance Info */}
                            <div className="pt-4 border-t border-white/5 flex items-center gap-3 text-gray-600">
                                <ShieldCheck className="w-4 h-4" />
                                <span className="text-[10px] font-bold tracking-widest uppercase opacity-60">LGPD Compliance Guaranteed</span>
                            </div>

                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    );
};

export default KnowledgeHub;
