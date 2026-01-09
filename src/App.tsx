import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SplashScreen from "./components/SplashScreen.tsx";
import IdentitySetup from './components/IdentitySetup';
import Equalizer from './components/Equalizer';
import DiagnosisRadar from './components/DiagnosisRadar';
import GovernanceGenerator from './components/GovernanceGenerator';
import PortfolioScreen from './components/PortfolioScreen';
import { ActorProfile } from './types';
import { useSynergyScore } from './utils/logic';
import { TRANSLATIONS, Language } from './utils/i18n';
import { storage, SavedAnalysis } from './utils/storage';
import { Zap, Home, BookOpen, Globe, HelpCircle, ArrowUp } from 'lucide-react';
import KnowledgeHub from './components/KnowledgeHub';

const ScrollToTop = ({ labels }: { labels: any }) => {
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const toggleVisible = () => setVisible(window.scrollY > 300);
        window.addEventListener('scroll', toggleVisible);
        return () => window.removeEventListener('scroll', toggleVisible);
    }, []);
    return (
        <AnimatePresence>
            {visible && (
                <motion.button
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                    className="fixed bottom-8 right-8 z-[100] p-4 bg-white text-black rounded-full shadow-[0_0_30px_rgba(255,255,255,0.4)] transition-all group overflow-hidden"
                    title={labels.nav.scrollTop}
                >
                    <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                        className="absolute inset-0 bg-emerald-500/10"
                    />
                    <ArrowUp className="w-6 h-6 relative z-10" />
                </motion.button>
            )}
        </AnimatePresence>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [lang, setLang] = useState<Language>('pt');
    const [step, setStep] = useState<'identity' | 'calibration' | 'diagnosis' | 'portfolio'>('identity');
    const [portfolio, setPortfolio] = useState<SavedAnalysis[]>([]);
    const [isHubOpen, setIsHubOpen] = useState(false);
    const [viewMode, setViewMode] = useState(false);

    const t = TRANSLATIONS[lang];

    const [corp, setCorp] = useState<ActorProfile>({
        name: '',
        values: { speed: 5, risk: 5, cashflow: 5, ip: 5 }
    });

    const [startup, setStartup] = useState<ActorProfile>({
        name: '',
        values: { speed: 5, risk: 5, cashflow: 5, ip: 5 }
    });

    const analysis = useSynergyScore(corp, startup);

    // Load portfolio on mount
    useEffect(() => {
        setPortfolio(storage.getAll());
    }, []);

    const handleNext = () => {
        if (step === 'identity') setStep('calibration');
        else if (step === 'calibration') {
            setStep('diagnosis');
            handleSave();
        }
    };

    const handleSave = () => {
        const riskLevel = analysis.score > 80 ? 'OPTIMAL' : analysis.score > 50 ? 'MANAGEABLE' : 'CRITICAL';
        const newAnalysis: SavedAnalysis = {
            id: crypto.randomUUID(),
            createdAt: Date.now(),
            corpName: corp.name,
            startupName: startup.name,
            score: analysis.score,
            riskLevel,
            corpValues: corp.values,
            startupValues: startup.values
        };
        storage.save(newAnalysis);
        setPortfolio(storage.getAll());
    };

    const handleRestart = () => {
        setStep('identity');
        setViewMode(false);
        setCorp({ name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
        setStartup({ name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
    };

    const loadAnalysis = (item: SavedAnalysis) => {
        setCorp({ name: item.corpName, values: item.corpValues });
        setStartup({ name: item.startupName, values: item.startupValues });
        setViewMode(true);
        setStep('diagnosis');
    };

    const toggleLang = () => {
        setLang(l => l === 'en' ? 'pt' : 'en');
    };

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative bg-vault-bg text-white">
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-vault-bg z-0 no-print" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none z-0 no-print" />

            {/* Navbar */}
            <nav className="relative z-50 w-full max-w-7xl flex justify-between items-center py-4 mb-4 border-b border-white/5 no-print">
                <div className="flex items-center gap-4 md:gap-8">
                    <div
                        onClick={handleRestart}
                        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                    >
                        <div className="w-8 h-8 bg-emerald-500/10 rounded-lg flex items-center justify-center border border-emerald-500/20">
                            <Zap className="w-4 h-4 text-emerald-400" />
                        </div>
                        <div>
                            <h1 className="text-lg font-black tracking-tighter leading-none">
                                PARTNER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">FIT</span>
                            </h1>
                            <p className="text-[9px] tracking-[0.2em] text-gray-500">{t.tagline}</p>
                        </div>
                    </div>

                    <div className="hidden md:block h-8 border-l border-white/10" />
                </div>

                <div className="flex items-center gap-1 md:gap-4">
                    <button
                        onClick={handleRestart}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors hidden md:block"
                        title={t.nav.home}
                    >
                        <Home className="w-5 h-5" />
                    </button>

                    <button
                        onClick={() => setStep('portfolio')}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors relative"
                        title={t.nav.portfolio}
                    >
                        <BookOpen className="w-5 h-5" />
                        {portfolio.length > 0 && (
                            <span className="absolute top-2 right-2 w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                        )}
                    </button>

                    <button
                        onClick={() => setIsHubOpen(true)}
                        className="p-3 text-gray-400 hover:text-white hover:bg-white/5 rounded-full transition-colors"
                        title="Help / Knowledge Hub"
                    >
                        <HelpCircle className="w-5 h-5" />
                    </button>

                    <button
                        onClick={toggleLang}
                        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-emerald-500/50 hover:bg-emerald-500/10 transition-all ml-2"
                    >
                        <Globe className="w-3 h-3 text-emerald-400" />
                        <span className="text-xs font-bold text-emerald-100">{lang.toUpperCase()}</span>
                    </button>
                </div>
            </nav>

            {/* Main Content Area */}
            <main className="relative z-10 w-full flex-1 flex flex-col items-center mt-4 mb-24 lg:mb-32">
                <AnimatePresence mode="wait">
                    {step === 'identity' && (
                        <motion.div
                            key="identity"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex justify-center"
                        >
                            <IdentitySetup
                                corp={corp}
                                startup={startup}
                                setCorpName={(n) => setCorp({ ...corp, name: n })}
                                setStartupName={(n) => setStartup({ ...startup, name: n })}
                                onNext={handleNext}
                                labels={t}
                            />
                        </motion.div>
                    )}

                    {step === 'calibration' && (
                        <motion.div
                            key="calibration"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex justify-center"
                        >
                            <Equalizer
                                corp={corp}
                                startup={startup}
                                setCorpValue={(id, val) => setCorp({ ...corp, values: { ...corp.values, [id]: val } })}
                                setStartupValue={(id, val) => setStartup({ ...startup, values: { ...startup.values, [id]: val } })}
                                onNext={handleNext}
                                labels={t}
                            />
                        </motion.div>
                    )}

                    {step === 'diagnosis' && (
                        <motion.div
                            key="diagnosis"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.5 }}
                            className="w-full flex justify-center"
                        >
                            <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8">
                                <div className="flex-1 order-2 md:order-1">
                                    <GovernanceGenerator
                                        score={analysis.score}
                                        analysis={analysis.dimensionAnalysis}
                                        onRestart={handleRestart}
                                        corpName={corp.name}
                                        startupName={startup.name}
                                        labels={t}
                                    />
                                </div>
                                <div className="flex-1 order-1 md:order-2">
                                    <DiagnosisRadar corp={corp} startup={startup} labels={t} />
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {step === 'portfolio' && (
                        <motion.div
                            key="portfolio"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 1.05 }}
                            transition={{ duration: 0.4 }}
                            className="w-full flex justify-center"
                        >
                            <PortfolioScreen
                                analyses={portfolio}
                                lang={t}
                                onBack={() => setStep('identity')}
                                onView={loadAnalysis}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>

            {/* Knowledge Hub Drawer */}
            <KnowledgeHub
                isOpen={isHubOpen}
                onClose={() => setIsHubOpen(false)}
                labels={t}
            />

            {/* Scroll To Top */}
            <ScrollToTop labels={t} />

            {/* Footer */}
            <footer className="relative z-10 py-10 text-center transition-opacity mt-auto">
                <div className="flex flex-col items-center gap-4">
                    <div className="flex flex-col gap-1">
                        <a
                            href="https://www.ephata.solutions/portfolio"
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] font-black text-emerald-500 uppercase tracking-[0.3em] hover:text-emerald-400 transition-colors"
                        >
                            Visit Our Portfolio
                        </a>
                        <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest opacity-40">
                            © 2025 Cristaliza ROI Calculator. Powered by <i className="text-gray-400">Ephata Solutions.</i>
                        </p>
                    </div>
                </div>
            </footer>
        </div>
    );
}

export default App;
