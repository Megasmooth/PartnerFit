import React from 'react';
import { motion } from 'framer-motion';
import { ActorProfile } from '../types';
import { Building2, Rocket } from 'lucide-react';

interface IdentitySetupProps {
    corp: ActorProfile;
    startup: ActorProfile;
    setCorpName: (name: string) => void;
    setStartupName: (name: string) => void;
    onNext: () => void;
}

const IdentitySetup: React.FC<IdentitySetupProps> = ({
    corp, startup, setCorpName, setStartupName, onNext
}) => {
    const isValid = corp.name.trim().length > 0 && startup.name.trim().length > 0;

    return (
        <div className="flex flex-col h-full w-full max-w-6xl mx-auto md:flex-row relative z-10 p-6 gap-6 md:gap-12 mt-12">

            {/* Corp Side */}
            <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex-1 glass-panel p-8 rounded-2xl border-l-4 border-l-vault-corp flex flex-col justify-center"
            >
                <Building2 className="w-12 h-12 text-vault-corp mb-4" />
                <h2 className="text-2xl font-bold text-vault-corp mb-2">CORPORATE ENTITY</h2>
                <p className="text-gray-400 mb-6 text-sm">The established organization seeking innovation.</p>

                <div className="relative">
                    <input
                        type="text"
                        value={corp.name}
                        onChange={(e) => setCorpName(e.target.value)}
                        placeholder="Ex: Global Argotech"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-xl focus:border-vault-corp outline-none transition-colors text-white"
                    />
                    <span className="absolute -top-3 left-4 bg-[#0F0F0F] px-2 text-xs text-vault-corp">
                        Organization Name
                    </span>
                </div>
            </motion.div>

            {/* VS Separator */}
            <div className="flex items-center justify-center relative">
                <div className="w-12 h-12 rounded-full bg-white/5 border border-white/20 flex items-center justify-center font-black text-white/50 z-20">
                    VS
                </div>
                <div className="absolute top-0 bottom-0 w-px bg-white/10 md:block hidden"></div>
            </div>

            {/* Startup Side */}
            <motion.div
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="flex-1 glass-panel p-8 rounded-2xl border-l-4 border-l-vault-startup flex flex-col justify-center"
            >
                <Rocket className="w-12 h-12 text-vault-startup mb-4" />
                <h2 className="text-2xl font-bold text-vault-startup mb-2">PARTNER / STARTUP</h2>
                <p className="text-gray-400 mb-6 text-sm">The agile entity bringing new capabilities.</p>

                <div className="relative">
                    <input
                        type="text"
                        value={startup.name}
                        onChange={(e) => setStartupName(e.target.value)}
                        placeholder="Ex: Drone AI Labs"
                        className="w-full bg-black/40 border border-white/10 rounded-lg p-4 text-xl focus:border-vault-startup outline-none transition-colors text-white"
                    />
                    <span className="absolute -top-3 left-4 bg-[#0F0F0F] px-2 text-xs text-vault-startup">
                        Partner Name
                    </span>
                </div>
            </motion.div>

            {/* Next Button */}
            <motion.div
                className="fixed bottom-12 left-0 right-0 flex justify-center z-50"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: isValid ? 1 : 0.5 }}
            >
                <button
                    onClick={onNext}
                    disabled={!isValid}
                    className={`
            px-12 py-4 rounded-full font-bold tracking-widest text-lg transition-all
            ${isValid
                            ? 'bg-gradient-to-r from-vault-corp to-vault-startup text-black hover:scale-105 shadow-[0_0_20px_rgba(34,197,94,0.3)]'
                            : 'bg-white/10 text-gray-500 cursor-not-allowed'}
          `}
                >
                    INITIALIZE_ANALYSIS
                </button>
            </motion.div>

        </div>
    );
};

export default IdentitySetup;
