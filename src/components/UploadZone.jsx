import { useRef, useState } from 'react';
import { UploadCloud, Music, FileAudio, Loader2, X, PlayCircle, Search, Wand2, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function UploadZone() {
    const navigate = useNavigate();
    const [isDragOver, setIsDragOver] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Estado temporário para o arquivo sendo editado
    const [currentFile, setCurrentFile] = useState(null);
    const [metadata, setMetadata] = useState({
        title: '',
        artist: '',
        lyrics: ''
    });
    const [isSearchingLyrics, setIsSearchingLyrics] = useState(false);

    // Arquivos prontos na lista
    const [files, setFiles] = useState([]);

    const handleDragOver = (e) => {
        e.preventDefault();
        setIsDragOver(true);
    };

    const handleDragLeave = () => {
        setIsDragOver(false);
    };

    const handleDrop = (e) => {
        e.preventDefault();
        setIsDragOver(false);

        const droppedFiles = Array.from(e.dataTransfer.files);
        if (droppedFiles.length > 0) {
            const file = droppedFiles[0];
            const url = URL.createObjectURL(file);

            // Tentar extrair Artista - Musica.mp3
            let artist = "Desconhecido";
            let title = file.name.replace(/\.[^/.]+$/, "");

            // Heurística básica de nomes (Artista - Musica)
            if (title.includes('-')) {
                const parts = title.split('-');
                if (parts.length >= 2) {
                    artist = parts[0].trim();
                    title = parts[1].trim();
                }
            }

            // Preparar para abrir modal
            setCurrentFile({ file, url });
            setMetadata({
                title: title,
                artist: artist,
                lyrics: ''
            });
            setShowModal(true);
        }
    };

    const fetchLyrics = async () => {
        if (!metadata.title || !metadata.artist) {
            alert("Preencha o Título e o Artista para buscar a letra.");
            return;
        }

        setIsSearchingLyrics(true);
        try {
            // Tenta buscar na API Lyrics.ovh (Gratuita e Simples)
            const response = await fetch(`https://api.lyrics.ovh/v1/${encodeURIComponent(metadata.artist)}/${encodeURIComponent(metadata.title)}`);
            const data = await response.json();

            if (data.lyrics) {
                setMetadata(prev => ({ ...prev, lyrics: data.lyrics }));
            } else {
                alert("Letra não encontrada automaticamente.\n\nDica: Verifique se o nome do artista e música estão corretos (em inglês ou idioma original tem mais chance).");
            }
        } catch (error) {
            console.error("Erro na busca:", error);
            alert("Erro ao conectar com serviço de letras.");
        } finally {
            setIsSearchingLyrics(false);
        }
    };

    const startKaraoke = () => {
        if (!currentFile) return;

        // Processar letras
        const rawText = metadata.lyrics.trim() || "Letra instrumental ou não encontrada...";
        const lines = rawText.split('\n').filter(line => line.trim() !== '');

        // Estimativa de tempo (fallback sem LRC real)
        const durationPerLine = 3500;
        const processedLyrics = lines.map((text, index) => ({
            time: (index * durationPerLine) + 3000,
            text: text.trim()
        }));

        const finalData = {
            audioUrl: currentFile.url,
            title: metadata.title,
            artist: metadata.artist,
            lyrics: processedLyrics
        };

        setFiles(prev => [...prev, { name: metadata.title, ...finalData }]);
        setShowModal(false);
        navigate('/player/custom', { state: finalData });
    };

    return (
        <div className="w-full relative">
            {/* Área de Drop */}
            <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`
          relative w-full h-64 border-2 border-dashed rounded-2xl flex flex-col items-center justify-center
          transition-all duration-300 ease-in-out cursor-pointer overflow-hidden
          ${isDragOver
                        ? 'border-primary bg-primary/10 scale-[1.01] shadow-[0_0_30px_rgba(139,92,246,0.2)]'
                        : 'border-white/10 bg-white/5 hover:bg-white/[0.07] hover:border-white/20'
                    }
        `}
            >
                <div className={`p-4 rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 mb-4 transition-transform duration-300 ${isDragOver ? 'scale-110' : ''}`}>
                    <UploadCloud size={40} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">Arraste sua música (MP3) aqui para o ADMIN</h3>
                <p className="text-sm text-slate-400 max-w-md text-center">
                    Ferramenta exclusiva do estúdio: Upload e Sincronização Automática.
                </p>
                <p className="mt-4 text-xs text-slate-500 font-mono bg-black/20 px-3 py-1 rounded border border-white/5">
                    Suporta MP3, WAV, FLAC
                </p>
            </div>

            {/* Modal de Configuração da Música */}
            {showModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-300">
                    <div className="bg-bgMain border border-white/10 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-white flex items-center gap-2">
                                <Music className="text-primary" size={20} />
                                Configurar Faixa
                            </h3>
                            <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white">
                                <X size={24} />
                            </button>
                        </div>

                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Artista</label>
                                    <input
                                        type="text"
                                        value={metadata.artist}
                                        onChange={e => setMetadata({ ...metadata, artist: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        placeholder="Ex: Legião Urbana"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Música</label>
                                    <input
                                        type="text"
                                        value={metadata.title}
                                        onChange={e => setMetadata({ ...metadata, title: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-primary"
                                        placeholder="Ex: Tempo Perdido"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex justify-between items-end">
                                    <label className="text-xs text-slate-400 uppercase font-bold">Letra da Música</label>
                                    <button
                                        onClick={fetchLyrics}
                                        disabled={isSearchingLyrics}
                                        className="text-xs flex items-center gap-1 text-primary hover:text-primary/80 disabled:opacity-50 border border-primary/20 px-2 py-1 rounded bg-primary/10 transition-colors"
                                    >
                                        {isSearchingLyrics ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
                                        {isSearchingLyrics ? 'Pesquisando na web...' : 'Buscar Letra Online'}
                                    </button>
                                </div>
                                <textarea
                                    value={metadata.lyrics}
                                    onChange={e => setMetadata({ ...metadata, lyrics: e.target.value })}
                                    placeholder="Clique em 'Buscar Letra Online' ou cole a letra manualmente aqui..."
                                    className="w-full h-48 bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-primary font-mono text-xs leading-relaxed resize-none"
                                />
                            </div>
                        </div>

                        <div className="p-6 border-t border-white/10 bg-white/5 flex justify-end gap-4">
                            <button
                                onClick={() => setShowModal(false)}
                                className="px-4 py-2 text-slate-300 hover:text-white font-medium"
                            >
                                Cancelar
                            </button>
                            <button
                                onClick={startKaraoke}
                                disabled={!metadata.lyrics.trim()}
                                className="px-6 py-2 bg-primary hover:bg-primary/90 disabled:opacity-50 text-white font-bold rounded-lg flex items-center gap-2"
                            >
                                <PlayCircle size={18} />
                                Criar Karaokê
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Lista de Arquivos Recentes */}
            {files.length > 0 && (
                <div className="mt-8 animate-in slide-in-from-bottom-4 duration-500">
                    <h4 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Adições Recentes</h4>
                    <div className="space-y-3">
                        {files.map((file, idx) => (
                            <div key={idx} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-colors">
                                <div className="flex items-center gap-4">
                                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center text-indigo-400">
                                        <Music size={20} />
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-white">{file.title}</p>
                                        <p className="text-xs text-slate-400">{file.artist}</p>
                                    </div>
                                </div>
                                <button
                                    onClick={() => navigate('/player/custom', { state: file })}
                                    className="px-4 py-1.5 text-xs font-bold bg-white text-black rounded hover:bg-slate-200 transition-colors">
                                    Tocar
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
