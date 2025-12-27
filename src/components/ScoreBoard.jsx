import { useEffect, useState, useRef } from 'react';
import { Mic } from 'lucide-react';

export default function ScoreBoard({ isPlaying }) {
    const [score, setScore] = useState(0);
    const [lastScore, setLastScore] = useState(0); // Score da frase anterior
    const [combo, setCombo] = useState(0);
    const [feedback, setFeedback] = useState("");
    const [isListening, setIsListening] = useState(false);
    const [volume, setVolume] = useState(0); // Visualização debug (opcional)

    // Refs para engine de áudio
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const microphoneRef = useRef(null);
    const dataArrayRef = useRef(null);
    const rafIdRef = useRef(null);

    // Iniciar Microfone
    useEffect(() => {
        if (!isPlaying) {
            cleanupAudio();
            return;
        }

        const startMicrophone = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

                const AudioContext = window.AudioContext || window.webkitAudioContext;
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                const microphone = audioContext.createMediaStreamSource(stream);

                // Configuração do analisador
                analyser.fftSize = 256;
                const bufferLength = analyser.frequencyBinCount;
                const dataArray = new Uint8Array(bufferLength);

                microphone.connect(analyser); // Microfone -> Analisador (Não conecta ao destino pra não dar feedback/microfonia)

                audioContextRef.current = audioContext;
                analyserRef.current = analyser;
                microphoneRef.current = microphone;
                dataArrayRef.current = dataArray;

                setIsListening(true);
                analyzeAudio();

            } catch (err) {
                console.error("Erro ao acessar microfone:", err);
                setFeedback("Sem Microfone 🎤");
            }
        };

        startMicrophone();

        return () => {
            cleanupAudio();
        };
    }, [isPlaying]);

    const cleanupAudio = () => {
        if (rafIdRef.current) cancelAnimationFrame(rafIdRef.current);
        if (audioContextRef.current) audioContextRef.current.close();
        if (microphoneRef.current) microphoneRef.current.disconnect();
        setIsListening(false);
    };

    // Loop de Análise
    const analyzeAudio = () => {
        if (!analyserRef.current) return;

        analyserRef.current.getByteFrequencyData(dataArrayRef.current);

        // Calcular volume médio
        let sum = 0;
        const data = dataArrayRef.current;
        for (let i = 0; i < data.length; i++) {
            sum += data[i];
        }
        const avg = sum / data.length;
        setVolume(avg);

        // Lógica de Pontuação "Gamer"
        // Se o volume passar de um limiar (está cantando), ganha pontos
        const threshold = 15; // Sensibilidade de ruído

        if (avg > threshold) {
            // Pontuação baseada na intensidade e "consistência"
            const points = Math.floor(avg * 0.5);

            // Incremento suave
            setScore(prev => prev + points);

            // Combo
            if (avg > 40) { // Cantando forte
                // Lógica de Throttle para combo não subir rápido demais visualmente
                if (Math.random() > 0.8) setCombo(prev => prev + 1);
            }

            // Feedbacks
            if (avg > 100 && Math.random() > 0.95) showFeedback("UAU!!");
            else if (avg > 60 && Math.random() > 0.98) showFeedback("BOA!");

        } else {
            // Silêncio
            // Resetar combo se ficar em silêncio por muito tempo? (Opcional)
        }

        rafIdRef.current = requestAnimationFrame(analyzeAudio);
    };

    const showFeedback = (text) => {
        setFeedback(text);
        setTimeout(() => setFeedback(""), 1000);
    };

    return (
        <div className="absolute top-8 right-8 flex flex-col items-end pointer-events-none select-none">
            {/* Indicador de Microfone */}
            {!isListening ? (
                <div className="bg-red-500/80 text-white px-3 py-1 rounded-full text-xs font-bold mb-2 animate-pulse flex items-center gap-2">
                    <Mic size={12} /> Ative o mic
                </div>
            ) : (
                <div className="flex items-center gap-1 mb-2">
                    <div className={`w-2 h-2 rounded-full ${volume > 10 ? 'bg-green-500 animate-pulse' : 'bg-slate-500'}`}></div>
                    <span className="text-[10px] text-white/50 font-mono">MIC ON {Math.round(volume)}</span>
                </div>
            )}

            <div className={`text-6xl font-black italic text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-yellow-600 drop-shadow-[0_0_10px_rgba(250,204,21,0.5)] font-mono transition-all duration-100 ${volume > 50 ? 'scale-110' : 'scale-100'}`}>
                {score.toLocaleString()}
            </div>
            <div className="text-xl font-bold text-white tracking-widest uppercase mt-1 drop-shadow-md">
                Pontos
            </div>

            {combo > 5 && (
                <div className="mt-4 animate-bounce">
                    <span className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2 rounded-xl text-white font-black text-xl shadow-lg border border-white/20">
                        {combo}x COMBO 🔥
                    </span>
                </div>
            )}

            {feedback && (
                <div className="absolute top-32 right-0 text-5xl font-black text-white animate-ping opacity-90 whitespace-nowrap rotate-[-10deg] drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] text-stroke-purple">
                    {feedback}
                </div>
            )}
        </div>
    );
}
