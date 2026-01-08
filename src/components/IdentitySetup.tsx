import React from 'react';
import { Building2, Rocket } from 'lucide-react';
import { ActorProfile } from '../types';

interface IdentitySetupProps {
    corp: ActorProfile;
    startup: ActorProfile;
    setCorpName: (name: string) => void;
    setStartupName: (name: string) => void;
    onNext: () => void;
    labels: any;
}

const IdentitySetup: React.FC<IdentitySetupProps> = ({ corp, startup, setCorpName, setStartupName, onNext, labels }) => {
    const isValid = corp.name.length > 2 && startup.name.length > 2;

    return (
        <div className="w-full max-w-4xl animate-in fade-in slide-in-from-bottom-8 duration-700">
            <h2 className="text-heading-section text-center text-white mb-8 md:mb-12">{labels.stepTitle}</h2>

            <div className="flex flex-col md:flex-row gap-6 md:gap-8 mb-12">
                {/* Corp Input */}
                <div className="flex-1 glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Building2 className="w-24 h-24 md:w-32 md:h-32 text-cyan-400" />
                    </div>
                    <div className="relative z-10">
                        <label className="text-body-highlight text-cyan-400 mb-3 block">{labels.corpLabel}</label>
                        <input
                            type="text"
                            value={corp.name}
                            onChange={(e) => setCorpName(e.target.value)}
                            placeholder={labels.corpPlaceholder}
                            className="w-full bg-transparent border-b-2 border-white/20 text-xl md:text-2xl font-bold py-2 text-white focus:outline-none focus:border-cyan-400 transition-colors placeholder:text-white/20"
                        />
                    </div>
                </div>

                {/* Startup Input */}
                <div className="flex-1 glass-panel p-6 md:p-8 rounded-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                        <Rocket className="w-24 h-24 md:w-32 md:h-32 text-green-400" />
                    </div>
                    <div className="relative z-10">
                        <label className="text-body-highlight text-green-400 mb-3 block">{labels.startupLabel}</label>
                        <input
                            type="text"
                            value={startup.name}
                            onChange={(e) => setStartupName(e.target.value)}
                            placeholder={labels.startupPlaceholder}
                            className="w-full bg-transparent border-b-2 border-white/20 text-xl md:text-2xl font-bold py-2 text-white focus:outline-none focus:border-green-400 transition-colors placeholder:text-white/20"
                        />
                    </div>
                </div>
            </div>

            <div className="text-center">
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`
            px-12 py-4 rounded-full font-black tracking-widest text-sm md:text-base transition-all duration-300
            ${isValid
                            ? 'bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]'
                            : 'bg-white/10 text-white/30 cursor-not-allowed'}
          `}
                >
                    {labels.nextBtn}
                </button>
            </div>
        </div>
    );
};

export default IdentitySetup;
