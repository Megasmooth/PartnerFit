import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const MESSAGES = [
    ">_ inicializando_sistema_ephata_solutions...",
    ">_ alocando_memoria_segura...",
    ">_ acessando_metodologia: [Marcio Almeida]",
    ">_ baixando_benchmarks_globais...",
    ">_ carregando_dados_mercado...",
    ">_ calibrando_algoritmos_v2.4...",
    ">_ acesso_concedido",
    ">_ Bem_vindo_ao_sistema"
];

interface SplashScreenProps {
    onFinish: () => void;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [currentLogIndex, setCurrentLogIndex] = useState(0);
    const [isExiting, setIsExiting] = useState(false);

    // Matrix Rain Effect
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
        const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        const nums = '0123456789';
        const alphabet = katakana + latin + nums;

        const fontSize = 16;
        const columns = canvas.width / fontSize;
        const rainDrops = Array(Math.ceil(columns)).fill(1);

        const draw = () => {
            ctx.fillStyle = 'rgba(15, 15, 15, 0.05)'; // Deep Void with fade
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.fillStyle = '#22c55e'; // Neon Green
            ctx.font = fontSize + 'px monospace';

            for (let i = 0; i < rainDrops.length; i++) {
                const text = alphabet.charAt(Math.floor(Math.random() * alphabet.length));
                ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

                if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
                    rainDrops[i] = 0;
                }
                rainDrops[i]++;
            }
        };

        const intervalId = setInterval(draw, 30);

        const handleResize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        window.addEventListener('resize', handleResize);

        return () => {
            clearInterval(intervalId);
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // System Logs Sequence
    useEffect(() => {
        if (currentLogIndex < MESSAGES.length - 1) {
            const timeout = setTimeout(() => {
                setCurrentLogIndex(prev => prev + 1);
            }, 800); // Speed of logs
            return () => clearTimeout(timeout);
        } else {
            // Finished logs, wait a bit then exit
            const exitTimeout = setTimeout(() => {
                setIsExiting(true);
                setTimeout(onFinish, 1000); // Wait for fade out
            }, 2000);
            return () => clearTimeout(exitTimeout);
        }
    }, [currentLogIndex, onFinish]);

    return (
        <AnimatePresence>
            {!isExiting && (
                <motion.div
                    className="fixed inset-0 z-50 bg-[#0F0F0F] text-white overflow-hidden font-sans"
                    exit={{ opacity: 0, transition: { duration: 1 } }}
                >
                    {/* Layer 1: Matrix Rain Canvas */}
                    <canvas ref={canvasRef} className="absolute inset-0 opacity-30" />

                    {/* Layer 2: Top Data Logs */}
                    <div className="absolute top-8 left-8 font-mono text-sm text-center md:text-left z-20">
                        {MESSAGES.slice(0, currentLogIndex + 1).map((msg, idx) => (
                            <motion.div
                                key={idx}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{ opacity: 1, x: 0 }}
                                className="text-emerald-500/80 mb-1"
                            >
                                {msg}
                            </motion.div>
                        ))}
                    </div>

                    {/* Layer 3: The Trinity (Center) */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                        <div className="relative">
                            {/* The Pulse (Behind) */}
                            <motion.div
                                animate={{ opacity: [0.4, 1, 0.4] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute inset-0 bg-emerald-500 blur-3xl rounded-full opacity-40 transform scale-150"
                            />

                            {/* The Body (Typography) */}
                            <div className="relative overflow-hidden px-8 py-4">
                                <h1 className="text-7xl md:text-9xl font-black tracking-tighter text-white relative z-10">
                                    PARTNER<span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-cyan-400">FIT</span>
                                </h1>
                                <p className="text-center tracking-[0.5em] text-xs md:text-sm text-emerald-500/80 mt-2 font-bold z-10 relative">
                                    STRATEGIC ENGINE
                                </p>

                                {/* The Scanner (Laser) - Masked inside */}
                                <motion.div
                                    className="absolute top-0 left-0 w-full h-[2px] bg-emerald-400 shadow-[0_0_10px_#22c55e] z-20"
                                    animate={{ top: ["0%", "100%"] }}
                                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                                    style={{
                                        background: 'linear-gradient(90deg, transparent, #22c55e, transparent)'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Layer 4: Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1 }}
                        className="absolute bottom-12 w-full text-center z-40"
                    >
                        <a
                            href="https://www.ephata.solutions/portfolio"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex flex-col items-center opacity-50 hover:opacity-100 transition-opacity duration-300 cursor-pointer"
                        >
                            <span className="text-[10px] tracking-widest mb-2 text-gray-500">POWERED BY</span>
                            <img
                                src="https://static.wixstatic.com/media/aefc44_1e97a663b3614d8483e3e17a332685f9~mv2.png"
                                alt="Ephata Solutions"
                                className="h-6 w-auto"
                            />
                        </a>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default SplashScreen;
