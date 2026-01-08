import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain, ExternalLink, MessageCircle, FileText, User } from 'lucide-react';

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
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60]"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: "spring", damping: 25, stiffness: 200 }}
                        className="fixed inset-y-0 right-0 z-[70] w-full max-w-lg bg-vault-card border-l border-white/10 shadow-2xl flex flex-col"
                    >
                        {/* Sticky Header */}
                        <div className="sticky top-0 bg-vault-card/95 backdrop-blur-md z-10 border-b border-white/5 p-6 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-emerald-500/10 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-emerald-400" />
                                </div>
                                <h2 className="text-xl font-bold text-white tracking-wide">{labels.title}</h2>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-400 hover:text-white"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        {/* Content Scrollable Area */}
                        <div className="flex-1 overflow-y-auto p-6 space-y-8">

                            {/* Author Section */}
                            <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-900 to-black p-6 border border-white/10">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/20 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none" />
                                <div className="flex items-start gap-4 relative z-10">
                                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border-2 border-white/5 shadow-lg">
                                        <User className="w-8 h-8 text-gray-300" />
                                    </div>
                                    <div>
                                        <div className="text-xs font-bold text-emerald-500 mb-1 tracking-widest">{labels.authorTitle}</div>
                                        <h3 className="text-xl font-bold text-white mb-1">Marcio Almeida</h3>
                                        <p className="text-sm text-gray-400">{labels.authorRole}</p>
                                    </div>
                                </div>
                            </div>

                            {/* About Algorithm */}
                            <div className="space-y-3">
                                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                                    <Brain className="w-5 h-5 text-cyan-400" />
                                    {labels.aboutTitle}
                                </h3>
                                <p className="text-gray-400 leading-relaxed text-sm">
                                    {labels.aboutText}
                                </p>
                            </div>

                            {/* CTAs Grid */}
                            <div className="grid grid-cols-1 gap-4">
                                <a
                                    href="https://wa.me/5511999999999" // TODO: Add real number if provided, placeholder for now
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-[#25D366]/10 border border-[#25D366]/20 rounded-xl hover:bg-[#25D366]/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <MessageCircle className="w-5 h-5 text-[#25D366]" />
                                        <span className="font-bold text-white">{labels.whatsappBtn}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-[#25D366] opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>

                                <a
                                    href="https://ephata.com" // TODO: Add real portfolio URL
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl hover:bg-blue-500/20 transition-all group"
                                >
                                    <div className="flex items-center gap-3">
                                        <FileText className="w-5 h-5 text-blue-400" />
                                        <span className="font-bold text-white">{labels.portfolioBtn}</span>
                                    </div>
                                    <ExternalLink className="w-4 h-4 text-blue-400 opacity-50 group-hover:opacity-100 transition-opacity" />
                                </a>
                            </div>

                            {/* Synapsys Card */}
                            <div className="relative group overflow-hidden rounded-2xl border border-purple-500/30 bg-black/40">
                                <div className="absolute inset-0 bg-gradient-to-r from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="p-6 relative z-10">
                                    <div className="flex justify-between items-start mb-4">
                                        <div>
                                            <h4 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400 mb-2">
                                                {labels.synapsysTitle}
                                            </h4>
                                            <p className="text-sm text-gray-300 max-w-[250px]">
                                                {labels.synapsysDesc}
                                            </p>
                                        </div>
                                        <Brain className="w-8 h-8 text-purple-400 animate-pulse" />
                                    </div>

                                    <button className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg font-bold text-white text-sm tracking-wide shadow-lg shadow-purple-900/20 hover:shadow-purple-900/40 hover:scale-[1.02] transition-all transform flex items-center justify-center gap-2">
                                        {labels.synapsysBtn} <ExternalLink className="w-4 h-4" />
                                    </button>
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
