import { useState } from 'react';
import SplashScreen from './components/SplashScreen';
import IdentitySetup from './components/IdentitySetup';
import Equalizer from './components/Equalizer';
import DiagnosisRadar from './components/DiagnosisRadar';
import GovernanceGenerator from './components/GovernanceGenerator';
import { ActorProfile } from './types';
import { useSynergyScore } from './utils/logic';
import { Zap } from 'lucide-react';

function App() {
    const [showSplash, setShowSplash] = useState(true);
    const [step, setStep] = useState<'identity' | 'calibration' | 'diagnosis'>('identity');

    const [corp, setCorp] = useState<ActorProfile>({
        name: '',
        values: { speed: 5, risk: 5, cashflow: 5, ip: 5 }
    });

    const [startup, setStartup] = useState<ActorProfile>({
        name: '',
        values: { speed: 5, risk: 5, cashflow: 5, ip: 5 }
    });

    const analysis = useSynergyScore(corp, startup);

    const handleNext = () => {
        if (step === 'identity') setStep('calibration');
        else if (step === 'calibration') setStep('diagnosis');
    };

    const handleRestart = () => {
        setStep('identity');
        setCorp({ ...corp, name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
        setStartup({ ...startup, name: '', values: { speed: 5, risk: 5, cashflow: 5, ip: 5 } });
    };

    if (showSplash) {
        return <SplashScreen onFinish={() => setShowSplash(false)} />;
    }

    return (
        <div className="min-h-screen flex flex-col items-center p-4 relative overflow-x-hidden">
            {/* Background Ambience */}
            <div className="fixed inset-0 bg-vault-bg z-0" />
            <div className="fixed top-0 left-0 w-full h-[500px] bg-gradient-to-b from-vault-corp/10 to-transparent pointer-events-none z-0 opactiy-50" />

            {/* Header */}
            <header className="relative z-10 w-full max-w-7xl flex justify-between items-center py-6 border-b border-white/5 no-print">
                <h1 className="text-xl font-black tracking-tighter text-white">
                    PARTNER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">FIT</span>
                </h1>
                <div className="flex items-center gap-2 text-xs font-mono text-gray-500">
                    <Zap className="w-3 h-3 text-emerald-500" />
                    SYSTEM_ONLINE_V2.0
                </div>
            </header>

            {/* Main Content Area */}
            <main className="relative z-10 w-full flex-1 flex flex-col items-center justify-center mt-8">

                {step === 'identity' && (
                    <IdentitySetup
                        corp={corp}
                        startup={startup}
                        setCorpName={(n) => setCorp({ ...corp, name: n })}
                        setStartupName={(n) => setStartup({ ...startup, name: n })}
                        onNext={handleNext}
                    />
                )}

                {step === 'calibration' && (
                    <Equalizer
                        corp={corp}
                        startup={startup}
                        setCorpValue={(id, val) => setCorp({ ...corp, values: { ...corp.values, [id]: val } })}
                        setStartupValue={(id, val) => setStartup({ ...startup, values: { ...startup.values, [id]: val } })}
                        onNext={handleNext}
                    />
                )}

                {step === 'diagnosis' && (
                    <div className="w-full max-w-6xl flex flex-col md:flex-row gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <div className="flex-1">
                            <DiagnosisRadar corp={corp} startup={startup} />
                        </div>
                        <div className="flex-1">
                            <GovernanceGenerator
                                score={analysis.score}
                                analysis={analysis.dimensionAnalysis}
                                onRestart={handleRestart}
                                corpName={corp.name}
                                leadEmail=""
                            />
                        </div>
                    </div>
                )}

            </main>

            {/* Footer */}
            <footer className="relative z-10 py-8 text-center opacity-30 hover:opacity-100 transition-opacity mt-auto no-print">
                <img
                    src="https://static.wixstatic.com/media/aefc44_1e97a663b3614d8483e3e17a332685f9~mv2.png"
                    alt="Powered By Ephata"
                    className="h-4 mx-auto mb-2"
                />
                <p className="text-[10px] text-gray-600 tracking-widest">ECOSYSTEM SYNERGY ENGINE</p>
            </footer>
        </div>
    );
}

export default App;
