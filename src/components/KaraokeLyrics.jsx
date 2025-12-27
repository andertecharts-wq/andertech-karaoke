import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KaraokeLyrics({ isPlaying, currentTime, customLyrics }) {
    // Mock de letras estendido para cobrir mais tempo (Fallback)
    const baseLyrics = [
        { time: 1000, text: "Será que isso é realidade?" },
        { time: 5000, text: "Ou é só fantasia?" },
        { time: 9000, text: "Preso em um deslizamento," },
        { time: 13000, text: "Sem escape da realidade." },
        { time: 17000, text: "Abra seus olhos," },
        { time: 21000, text: "Olhe para os céus e veja..." }
    ];

    // Se tiver letras customizadas válidas, usa elas. Senão, usa o mock/fallback.
    const initialLyrics = (customLyrics && customLyrics.length > 0) ? customLyrics : baseLyrics;

    // Gerador de letras infinitas (loop simulado) para músicas longas
    // Só aplica o loop se NÃO for customLyrics (pois customLyrics tem fim definido)
    const [lyrics, setLyrics] = useState(initialLyrics);

    useEffect(() => {
        // Se estamos usando letras customizadas, NÃO adicionar loop infinito de placeholders
        if (customLyrics && customLyrics.length > 0) return;

        // Se a música passar do tempo da última letra, adicionar mais (apenas para o modo Demo/Mock)
        const lastTime = lyrics[lyrics.length - 1].time;
        if (currentTime > lastTime + 2000) {
            const newLines = baseLyrics.map((line, idx) => ({
                ...line,
                time: line.time + lastTime + 5000,
                text: idx % 2 === 0 ? "♪ (Instrumental cantando...) ♪" : line.text
            }));
            setLyrics(prev => [...prev, ...newLines]);
        }
    }, [currentTime, lyrics, customLyrics]);

    // Encontrar índice ativo
    let activeIndex = lyrics.findIndex((line, i) => {
        const nextTime = lyrics[i + 1]?.time || Infinity;
        return currentTime >= line.time && currentTime < nextTime;
    });

    // Se estiver na intro (antes da primeira), activeIndex é -1.
    // Queremos mirar no index 0.
    const targetIndex = activeIndex === -1 ? 0 : activeIndex;

    // Calcular linhas visíveis (Janela de 3)
    // Se activeIndex é -1, mostrar [0, 1]
    const visibleLines = lyrics.map((line, index) => ({ ...line, index })).filter((line, index) => {
        return index >= targetIndex - 1 && index <= targetIndex + 1;
    });

    // Estado de Intro total (mostrando contador ou preparacao)
    if (visibleLines.length === 0 && activeIndex === -1) {
        // Fallback de segurança, mas a lógica acima deve pegar o index 0
        return <div className="text-white text-2xl animate-pulse">Carregando Letras...</div>
    }

    return (
        <div className="flex flex-col items-center justify-center h-full w-full px-4 text-center space-y-6">
            <AnimatePresence mode="popLayout">
                {visibleLines.map((line) => {
                    // Se activeIndex é -1, ninguém está ativo ainda (Intro state) -> mostrar opacity menor
                    const isActive = line.index === activeIndex;
                    const isFuture = line.index > activeIndex;

                    return (
                        <motion.div
                            key={`${line.index}-${line.time}`}
                            layout
                            initial={{ opacity: 0, y: 50, scale: 0.8 }}
                            animate={{
                                opacity: isActive ? 1 : (isFuture ? 0.6 : 0.3),
                                y: 0,
                                scale: isActive ? 1.1 : 0.95,
                                filter: isActive ? 'blur(0px)' : 'blur(0.5px)'
                            }}
                            exit={{ opacity: 0, y: -50, scale: 0.8 }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className={`
                                font-bold transition-colors duration-200 cursor-default select-none max-w-4xl
                                ${isActive
                                    ? 'text-3xl md:text-5xl text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-primary drop-shadow-[0_0_20px_rgba(139,92,246,0.5)]'
                                    : 'text-xl md:text-2xl text-slate-400'
                                }
                            `}
                        >
                            {line.text}
                        </motion.div>
                    );
                })}
            </AnimatePresence>

            {activeIndex === -1 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="absolute bottom-32 text-primary font-mono text-sm uppercase tracking-widest animate-pulse"
                >
                    Aguardando início vocal...
                </motion.div>
            )}
        </div>
    );
}
