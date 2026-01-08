import { useState, useEffect } from 'react';
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
        <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className={`fixed bottom-8 right-8 z-[100] p-4 bg-white text-black rounded-full shadow-2xl transition-all transform ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-50 pointer-events-none hover:scale-110'}`}
            title={labels.nav.scrollTop}
        >
            <ArrowUp className="w-6 h-6" />
        </button>
    );
};

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [lang, setLang] = useState<Language>('pt');
    const [step, setStep] = useState<'identity' | 'calibration' | 'diagnosis' | 'portfolio'>('identity');
    const [portfolio, setPortfolio] = useState<SavedAnalysis[]>([]);
    const [isHubOpen, setIsHubOpen] = useState(false);

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
        setCorp({ name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
        setStartup({ name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
    };

    const loadAnalysis = (item: SavedAnalysis) => {
        setCorp({ name: item.corpName, values: item.corpValues });
        setStartup({ name: item.startupName, values: item.startupValues });
        setStep('diagnosis');
    };

    const toggleLang = () => {
        setLang(l => l === 'en' ? 'pt' : 'en');
    };

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-x-hidden bg-vault-bg text-white">
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-vault-bg z-0" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-emerald-900/10 to-transparent pointer-events-none z-0" />

            {/* Navbar */}
            <nav className="relative z-50 w-full max-w-7xl flex justify-between items-center py-4 mb-4 border-b border-white/5 no-print">
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
            <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center mt-4 mb-12">

                {step === 'identity' && (
                    <IdentitySetup
                        corp={corp}
                        startup={startup}
                        setCorpName={(n) => setCorp({ ...corp, name: n })}
                        setStartupName={(n) => setStartup({ ...startup, name: n })}
                        onNext={handleNext}
                        labels={t.identity} // Passing labels prop we need to add to component
                    />
                )}

                {step === 'calibration' && (
                    <Equalizer
                        corp={corp}
                        startup={startup}
                        setCorpValue={(id, val) => setCorp({ ...corp, values: { ...corp.values, [id]: val } })}
                        setStartupValue={(id, val) => setStartup({ ...startup, values: { ...startup.values, [id]: val } })}
                        onNext={handleNext}
                        labels={t.calibration}
                    />
                )}

                {step === 'diagnosis' && (
                    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex-1 order-2 md:order-1">
                            <GovernanceGenerator
                                score={analysis.score}
                                analysis={analysis.dimensionAnalysis}
                                onRestart={handleRestart}
                                corpName={corp.name}
                                labels={t.diagnosis}
                                lang={lang}
                            />
                        </div>
                        <div className="flex-1 order-1 md:order-2">
                            <DiagnosisRadar corp={corp} startup={startup} labels={t} />
                        </div>
                    </div>
                )}

                {step === 'portfolio' && (
                    <PortfolioScreen
                        analyses={portfolio}
                        lang={t}
                        onView={loadAnalysis}
                        onBack={() => setStep('identity')}
                    />
                )}

            </main>

            {/* Knowledge Hub Drawer */}
            <KnowledgeHub
                isOpen={isHubOpen}
                onClose={() => setIsHubOpen(false)}
                labels={t.knowledgeHub}
            />

            {/* Scroll To Top */}
            <ScrollToTop labels={t} />

            {/* Footer */}
            <footer className="relative z-10 py-6 text-center opacity-40 hover:opacity-100 transition-opacity mt-auto no-print">
                <img
                    src="https://static.wixstatic.com/media/aefc44_1e97a663b3614d8483e3e17a332685f9~mv2.png"
                    alt="Powered By Ephata"
                    className="h-4 mx-auto mb-2 filter grayscale hover:grayscale-0 transition-all"
                />
            </footer>
        </div>
    );
}

export default App;
