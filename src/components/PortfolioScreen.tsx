import React from 'react';
import { SavedAnalysis } from '../utils/storage';
import { TranslationKeys } from '../utils/i18n';
import { ArrowLeft, Calendar, TrendingUp } from 'lucide-react';

interface PortfolioScreenProps {
    analyses: SavedAnalysis[];
    lang: TranslationKeys;
    onView: (analysis: SavedAnalysis) => void;
    onBack: () => void;
}

const PortfolioScreen: React.FC<PortfolioScreenProps> = ({ analyses, lang, onView, onBack }) => {
    return (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-500">
            <div className="flex items-center gap-4 mb-8">
                <button onClick={onBack} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
                    <ArrowLeft className="w-6 h-6" />
                </button>
                <h2 className="text-3xl font-black text-white tracking-widest">{lang.portfolio.title}</h2>
            </div>

            {analyses.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <TrendingUp className="w-8 h-8 text-gray-600" />
                    </div>
                    <p className="text-gray-400 font-mono">{lang.portfolio.emptyState}</p>
                </div>
            ) : (
                <div className="grid gap-4">
                    {analyses.map((item) => (
                        <div
                            key={item.id}
                            className="glass-panel p-6 rounded-xl flex flex-col md:flex-row items-center justify-between gap-6 hover:bg-white/5 transition-colors group cursor-pointer border border-white/5 hover:border-emerald-500/30"
                            onClick={() => onView(item)}
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2 text-xs text-emerald-500 mb-1 font-mono">
                                    <Calendar className="w-3 h-3" />
                                    {new Date(item.createdAt).toLocaleDateString()}
                                </div>
                                <div className="flex items-center gap-3 text-lg font-bold text-white">
                                    <span>{item.corpName || 'Unknown Corp'}</span>
                                    <span className="text-gray-600">x</span>
                                    <span>{item.startupName || 'Unknown Startup'}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-8">
                                <div className="text-center">
                                    <div className="text-xs text-gray-500 tracking-widest mb-1">{lang.portfolio.score}</div>
                                    <div className="text-3xl font-black text-white">{item.score}</div>
                                </div>

                                <div className="text-center hidden md:block">
                                    <div className="text-xs text-gray-500 tracking-widest mb-1">{lang.portfolio.status}</div>
                                    <div className={`text-sm font-bold px-3 py-1 rounded-full ${item.riskLevel === 'OPTIMAL' ? 'bg-green-500/20 text-green-400' :
                                        item.riskLevel === 'MANAGEABLE' ? 'bg-yellow-500/20 text-yellow-400' :
                                            'bg-red-500/20 text-red-400'
                                        }`}>
                                        {item.riskLevel}
                                    </div>
                                </div>

                                <button className="px-4 py-2 bg-white/10 rounded-lg text-xs font-bold text-white group-hover:bg-emerald-500/20 group-hover:text-emerald-400 transition-colors">
                                    {lang.portfolio.viewBtn}
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default PortfolioScreen;
