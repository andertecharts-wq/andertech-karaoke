import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Youtube, Mic2, Pause, Play, Music, SkipForward, ListMusic } from 'lucide-react';
import ReactPlayer from 'react-player';
import ScoreBoard from '../components/ScoreBoard';
import KaraokeLyrics from '../components/KaraokeLyrics';
import AudioVisualizer from '../components/AudioVisualizer';
import { useKaraoke } from '../context/KaraokeContext';

// --- SUB-COMPONENTE: PLAYER LOCAL (MP3) ---
function LocalPlayerComponent({ data, onExit, onNext }) {
    const audioRef = useRef(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [duration, setDuration] = useState(0);

    // Estado do Removedor de Voz
    const [isKaraokeMode, setIsKaraokeMode] = useState(true);
    const audioContextRef = useRef(null);
    const sourceRef = useRef(null);
    const karaokeNodeRef = useRef(null);
    const gainNodeRef = useRef(null);

    // Estado para forçar re-render quando o contexto de áudio estiver pronto para o visualizador
    const [audioReady, setAudioReady] = useState(false);

    // Inicializa o processador de áudio (Vocal Remover)
    const initAudioProcessor = () => {
        if (audioContextRef.current) return;

        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            const ctx = new AudioContext();
            audioContextRef.current = ctx;

            const source = ctx.createMediaElementSource(audioRef.current);
            sourceRef.current = source;
            setAudioReady(true); // Avisa que o áudio está pronto para o visualizador

            // Criar canal de processamento para remover vocal (Center Channel Cancellation)
            // 1. Split channels
            const splitter = ctx.createChannelSplitter(2);
            // 2. Invert one channel and merge to create cancellation
            const merger = ctx.createChannelMerger(2);
            const gainNode = ctx.createGain(); // Controle de volume/mix

            // Lógica simples: L - R (remove o centro)
            // Na prática Web Audio: Inverter fase de um canal e somar mono

            // Vamos usar uma abordagem mais robusta de filtro se possível, 
            // mas a inversão de fase é o padrão "Karaoke Effect" de navegador.

            // Configuração do Grafo de Áudio:
            // Source -> Splitter
            // Splitter L -> Merger L
            // Splitter R -> Inverter -> Merger R
            // Merger -> Destination

            const inverter = ctx.createGain();
            inverter.gain.value = -1; // Inverte fase

            // Conexões para modo NORMAL (Pass-through)
            const normalGain = ctx.createGain();
            source.connect(normalGain);
            normalGain.connect(ctx.destination);
            gainNodeRef.current = normalGain; // Guardar para mutar/desmutar

            // Conexões para modo KARAOKE
            const karaokeGain = ctx.createGain();
            karaokeGain.gain.value = 0; // Começa mudo se não ativo, ou 1 se ativo

            // Truque de Karaoke (OOF - Out of Phase Stereo) para cancelar centro
            // L - R
            source.connect(splitter);
            splitter.connect(karaokeGain, 0); // L pro output
            splitter.connect(inverter, 1);    // R pro inverter
            inverter.connect(karaokeGain);    // Inverted R pro output

            // Mono mix para ambos os canais de saida
            karaokeGain.connect(ctx.destination);

            karaokeNodeRef.current = karaokeGain;

            // Estado inicial
            updateAudioMode(isKaraokeMode, normalGain, karaokeGain);

        } catch (e) {
            console.error("Erro ao iniciar áudio avançado:", e);
        }
    };

    const updateAudioMode = (karaokeActive, normal, karaoke) => {
        const n = normal || gainNodeRef.current;
        const k = karaoke || karaokeNodeRef.current;

        if (!n || !k) return;

        if (karaokeActive) {
            n.gain.value = 0; // Muta original
            k.gain.value = 1; // Ativa filtro
        } else {
            n.gain.value = 1; // Toca original
            k.gain.value = 0; // Muta filtro
        }
    };

    // Toggle Effect
    const toggleKaraokeEffect = () => {
        const newState = !isKaraokeMode;
        setIsKaraokeMode(newState);
        updateAudioMode(newState);
    };

    // Efeito para ligar/desligar áudio e contexto
    useEffect(() => {
        const audio = audioRef.current;
        if (!audio) return;

        if (isPlaying) {
            // Resume context se necessário (browsers bloqueiam autoplay)
            if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
                audioContextRef.current.resume();
            }
            // Garante init no primeiro play
            if (!audioContextRef.current) initAudioProcessor();

            audio.play().catch(e => console.error("Erro play:", e));
        } else {
            audio.pause();
        }
    }, [isPlaying]);

    const togglePlay = () => setIsPlaying(!isPlaying);

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime * 1000); // Ms para letras
            setDuration(audioRef.current.duration || 0);
        }
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans text-white">
            {/* Header Local */}
            <div className="bg-zinc-900/90 h-16 px-4 flex justify-between items-center border-b border-white/10 shrink-0 z-50">
                <button onClick={onExit} className="bg-white/10 text-white p-2 px-4 rounded-full font-bold flex items-center gap-2 hover:bg-white/20">
                    <X size={20} /> Sair
                </button>
                <div className="text-white font-bold flex items-center gap-3">
                    <Music size={20} className="text-blue-400" />
                    <span className="truncate text-lg">{data.title} - {data.artist} (MP3 Local)</span>
                </div>

                {/* Botão Mágico de Karaokê */}
                <button
                    onClick={toggleKaraokeEffect}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm transition-all ${isKaraokeMode ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'bg-white/10 text-gray-400'}`}
                >
                    <Mic2 size={16} />
                    {isKaraokeMode ? 'REMOVE VOZ ATIVO' : 'VOCAL ORIGINAL'}
                </button>
            </div>

            {/* Visualizer & Letras */}
            <div className="flex-1 relative flex flex-col items-center justify-center p-6 bg-[url('https://images.unsplash.com/photo-1514525253440-b393332569ce?q=80&w=2074&auto=format&fit=crop')] bg-cover bg-center">
                {/* Overlay Escuro */}
                <div className="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>

                {/* Visualizer Background */}
                {audioReady && (
                    <AudioVisualizer
                        audioContext={audioContextRef.current}
                        sourceNode={sourceRef.current}
                        isPlaying={isPlaying}
                    />
                )}

                {/* Letras Centralizadas */}
                <div className="relative z-10 w-full max-w-4xl h-[60vh]">
                    <KaraokeLyrics
                        isPlaying={isPlaying}
                        currentTime={currentTime}
                        customLyrics={data.lyrics}
                    />
                </div>

                {/* ScoreBoard */}
                <div className="absolute top-4 right-4 z-20 scale-90 opacity-90">
                    <ScoreBoard isPlaying={isPlaying} />
                </div>
            </div>

            {/* Controles de Playback */}
            <div className="bg-zinc-900 p-6 border-t border-white/10 shrink-0 z-50 pb-8">
                <div className="max-w-xl mx-auto flex flex-col gap-4">
                    {/* Barra de Progresso */}
                    <input
                        type="range"
                        min="0"
                        max={duration}
                        value={currentTime / 1000}
                        onChange={(e) => {
                            const time = Number(e.target.value);
                            audioRef.current.currentTime = time;
                            setCurrentTime(time * 1000);
                        }}
                        className="w-full accent-blue-500 h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />

                    {/* Botões */}
                    <div className="flex justify-center items-center gap-6">
                        <button
                            onClick={togglePlay}
                            className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-500 shadow-xl hover:scale-105 transition-all text-white"
                        >
                            {isPlaying ? <Pause size={32} fill="white" /> : <Play size={32} fill="white" ml={4} />}
                        </button>
                    </div>
                </div>

                {/* Elemento de Áudio Oculto COM CORS (Importante para Web Audio API) */}
                <audio
                    ref={audioRef}
                    src={data.audioUrl}
                    crossOrigin="anonymous"
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                        setIsPlaying(false);
                        if (onNext) onNext();
                    }}
                />
            </div>
        </div>
    );
}


// --- SUB-COMPONENTE: PLAYER YOUTUBE (O Antigo) ---
function YoutubePlayerComponent({ data, onExit, onNext, queue }) {
    const [url, setUrl] = useState(() => {
        if (data.videoId) return `https://www.youtube.com/watch?v=${data.videoId}`;
        if (data.query) return `https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(data.query)}`;
        return 'https://www.youtube.com/watch?v=ysz5S6P_z-E';
    });

    // Atualiza URL se data mudar (importante para fila)
    useEffect(() => {
        if (data.videoId) setUrl(`https://www.youtube.com/watch?v=${data.videoId}`);
        else if (data.query) setUrl(`https://www.youtube.com/embed?listType=search&list=${encodeURIComponent(data.query)}`);
    }, [data]);

    const [manualLink, setManualLink] = useState('');
    const [hasError, setHasError] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [showQueue, setShowQueue] = useState(false);

    const openYoutubeSearch = () => {
        const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent((data.query || "") + " karaoke")}`;
        window.open(searchUrl, '_blank');
    };

    const handleRetry = () => {
        setHasError(false);
        setIsLoading(true);
    };

    return (
        <div className="fixed inset-0 bg-black z-[100] flex flex-col font-sans text-white">
            <div className="bg-zinc-900/90 backdrop-blur-md h-16 px-4 flex justify-between items-center border-b border-white/10 shrink-0 z-50 shadow-lg relative">
                <button onClick={onExit} className="bg-white/10 hover:bg-white/20 text-white p-2 pr-4 rounded-full font-bold flex items-center gap-2 text-sm transition-colors border border-white/5">
                    <X size={20} /> <span className="hidden md:inline">Voltar para Home</span>
                </button>
                <div className="text-white font-bold flex flex-col items-center flex-1 mx-4 overflow-hidden">
                    <span className="truncate text-lg tracking-wide">{data.title || 'Karaokê'}</span>
                    <span className="text-xs text-white/50">{data.artist}</span>
                </div>

                <button
                    onClick={() => setShowQueue(!showQueue)}
                    className={`p-2 rounded-full relative ${showQueue ? 'bg-primary text-white' : 'bg-white/10 text-slate-300'}`}
                >
                    <ListMusic size={20} />
                    {queue.length > 0 && (
                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">{queue.length}</span>
                    )}
                </button>

                {/* Fila Dropdown / Sidebar overlay */}
                {showQueue && (
                    <div className="absolute top-16 right-0 w-80 bg-zinc-900/95 backdrop-blur-xl border-l border-b border-white/10 shadow-2xl p-4 z-[60] rounded-bl-2xl">
                        <h3 className="font-bold text-white mb-4 flex items-center gap-2">
                            <ListMusic size={18} /> Próximas na Fila
                        </h3>
                        {queue.length === 0 ? (
                            <div className="text-white/30 text-center py-8 text-sm">Fila vazia. Adicione músicas na Home!</div>
                        ) : (
                            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                                {queue.map((song, idx) => (
                                    <div key={song.id || idx} className="flex items-center gap-3 p-2 bg-white/5 rounded-lg border border-white/5">
                                        <div className="text-xs font-mono text-white/30 w-4">{idx + 1}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="text-sm font-bold text-white truncate">{song.title}</div>
                                            <div className="text-xs text-white/50 truncate">{song.artist}</div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <div className="flex-1 bg-gradient-to-b from-black to-zinc-900 relative flex flex-col items-center justify-center p-2 sm:p-6 overflow-hidden">
                <div className="w-full max-w-5xl aspect-video bg-black shadow-[0_0_50px_rgba(0,0,0,0.7)] relative rounded-2xl overflow-hidden border border-white/10 ring-1 ring-white/5 mb-4 group flex items-center justify-center">

                    {isLoading && !hasError && (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900 z-10">
                            <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        </div>
                    )}

                    {hasError ? (
                        <div className="z-20 text-center p-8 bg-zinc-900/90 rounded-xl backdrop-blur-sm border border-white/10 max-w-md">
                            <h3 className="text-xl font-bold text-red-400 mb-2">Ops! Não foi possível carregar o vídeo.</h3>
                            <p className="text-white/60 mb-6 text-sm">
                                O YouTube pode ter restringido a reprodução deste vídeo. Tente pular para o próximo.
                            </p>
                            <div className="flex flex-col gap-3">
                                <button
                                    onClick={onNext}
                                    className="bg-primary hover:bg-primary/80 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Pular Música
                                </button>
                                <button
                                    onClick={handleRetry}
                                    className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-lg font-bold transition-colors"
                                >
                                    Tentar Novamente
                                </button>
                            </div>
                        </div>
                    ) : (
                        <ReactPlayer
                            key={url}
                            url={url}
                            width="100%"
                            height="100%"
                            playing={true}
                            controls={true}
                            onReady={() => setIsLoading(false)}
                            onBuffer={() => setIsLoading(true)}
                            onBufferEnd={() => setIsLoading(false)}
                            onEnded={onNext}
                            onError={(e) => {
                                console.error("Erro no Player:", e);
                                setIsLoading(false);
                                setHasError(true);
                            }}
                            config={{
                                youtube: {
                                    playerVars: { showinfo: 0, autoplay: 1, origin: window.location.origin }
                                }
                            }}
                        />
                    )}

                    {!hasError && (
                        <div className="absolute top-4 right-4 z-20 pointer-events-none scale-75 sm:scale-90 origin-top-right opacity-90">
                            <ScoreBoard isPlaying={!isLoading} />
                        </div>
                    )}
                </div>

                <div className="text-center text-white/50 text-sm flex flex-col gap-2 items-center">
                    {!hasError && (
                        <div className="flex items-center gap-4">
                            <p className="animate-pulse">Problemas? Cole outro link abaixo.</p>
                            <button onClick={onNext} className="text-white bg-white/10 px-3 py-1 rounded-full text-xs font-bold hover:bg-white/20 flex items-center gap-1">
                                <SkipForward size={14} /> Pular
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div className="bg-zinc-900/90 backdrop-blur p-4 border-t border-white/10 shrink-0 z-50 pb-8 safe-area-bottom">
                <div className="max-w-xl mx-auto flex gap-2 items-center bg-black/50 p-1.5 rounded-xl border border-white/10">
                    <div className="pl-3 text-white/30 hidden sm:block"><Mic2 size={16} /></div>
                    <input
                        type="text"
                        className="flex-1 bg-transparent text-white px-2 py-2 text-sm outline-none"
                        placeholder="Cole o link do YouTube aqui..."
                        value={manualLink}
                        onChange={(e) => setManualLink(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setUrl(manualLink);
                                setHasError(false);
                            }
                        }}
                    />
                    <button
                        onClick={() => {
                            if (manualLink.trim()) {
                                setUrl(manualLink);
                                setHasError(false);
                            }
                        }}
                        className="bg-red-600 hover:bg-red-500 text-white font-bold px-6 py-2 rounded-lg text-sm"
                    >
                        TOCAR
                    </button>
                </div>
            </div>
        </div>
    );
}

// --- COMPONENTE PRINCIPAL (Roteador) ---
export default function Player() {
    const navigate = useNavigate();
    const location = useLocation();

    // Hooks do Contexto da Fila
    const { currentSong, nextSong, queue } = useKaraoke();

    // Prioriza o currentSong do contexto. Se não tiver, tenta pegar do location.state (backup simples)
    // Se não tiver nenhum, volta pra home.
    const activeData = currentSong || location.state;

    // Se estiver sem dados nenhuns, volta
    useEffect(() => {
        if (!activeData && !location.state) {
            navigate('/');
        }
    }, [activeData, location.state, navigate]);

    if (!activeData) return <div className="bg-black min-h-screen text-white flex items-center justify-center">Carregando...</div>;

    const handleNext = () => {
        nextSong();
        // Se a fila vazia, nextSong define currentSong como null?
        // O hook deve lidar com isso. O useEffect em cima vai redirecionar se ficar null.
    };

    // Se tiver audioUrl (Blob/File), usa Player Local
    if (activeData.audioUrl) {
        return <LocalPlayerComponent data={activeData} onExit={() => navigate('/')} onNext={handleNext} />;
    }

    // Se não, usa Player YouTube
    return <YoutubePlayerComponent data={activeData} onExit={() => navigate('/')} onNext={handleNext} queue={queue} />;
}
