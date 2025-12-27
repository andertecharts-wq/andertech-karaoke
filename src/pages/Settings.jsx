import { useState } from 'react';
import { useKaraoke } from '../context/KaraokeContext';
import { Trash2, Disc, Mic2 } from 'lucide-react';

export default function Settings() {
    const { history, queue, removeFromQueue } = useKaraoke();
    const [confirmClear, setConfirmClear] = useState(false);

    const clearAllData = () => {
        localStorage.removeItem('karaoke_queue');
        localStorage.removeItem('karaoke_history');
        window.location.reload(); // Recarrega para limpar estado
    };

    return (
        <div className="p-8 max-w-4xl mx-auto min-h-screen text-white pb-32">
            <h1 className="text-4xl font-bold mb-8 flex items-center gap-3">
                <div className="p-3 bg-zinc-800 rounded-xl">⚙️</div>
                Configurações & Histórico
            </h1>

            <div className="grid gap-8">
                {/* Seção de Dados */}
                <section className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                    <h2 className="text-xl font-bold mb-4 text-red-400">Zona de Perigo</h2>
                    <p className="text-slate-400 mb-6">
                        Se precisar resetar o karaokê para uma nova festa, você pode limpar todos os dados aqui.
                    </p>

                    {!confirmClear ? (
                        <button
                            onClick={() => setConfirmClear(true)}
                            className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-bold transition-colors flex items-center gap-2"
                        >
                            <Trash2 size={20} /> Limpar Histórico e Fila
                        </button>
                    ) : (
                        <div className="flex items-center gap-4 animate-fade-in-up">
                            <span className="text-white font-bold">Tem certeza? Isso não pode ser desfeito.</span>
                            <button
                                onClick={clearAllData}
                                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-bold"
                            >
                                SIM, APAGAR TUDO
                            </button>
                            <button
                                onClick={() => setConfirmClear(false)}
                                className="bg-zinc-700 hover:bg-zinc-600 text-white px-4 py-2 rounded-lg font-bold"
                            >
                                CANCELAR
                            </button>
                        </div>
                    )}
                </section>

                {/* Histórico Recente */}
                <section>
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Disc className="text-purple-400" /> Últimas Cantadas
                    </h2>

                    {history.length === 0 ? (
                        <div className="text-center py-12 bg-white/5 rounded-2xl border border-dashed border-white/10">
                            <p className="text-slate-500">Nenhuma música tocada ainda.</p>
                        </div>
                    ) : (
                        <div className="grid gap-2">
                            {history.map((song, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-900/50 p-4 rounded-xl border border-white/5 opacity-70 hover:opacity-100 transition-opacity">
                                    <div className="text-slate-500 font-mono text-xs w-8">#{history.length - i}</div>
                                    <div className="flex-1">
                                        <div className="font-bold">{song.title}</div>
                                        <div className="text-xs text-slate-400">{song.artist}</div>
                                    </div>
                                    <div className="text-xs font-bold text-green-400 px-2 py-1 bg-green-900/20 rounded">
                                        TOCADA
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* Gerenciar Fila (Extra) */}
                <section className="mt-8">
                    <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                        <Mic2 className="text-cyan-400" /> Gerenciar Fila Atual
                    </h2>
                    {queue.length === 0 ? (
                        <p className="text-slate-500">Fila vazia.</p>
                    ) : (
                        <div className="grid gap-2">
                            {queue.map((song, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border border-white/5">
                                    <div className="font-bold text-cyan-400 w-6">{i + 1}</div>
                                    <div className="flex-1">
                                        <div className="font-bold">{song.title}</div>
                                        <div className="text-xs text-slate-400">{song.artist}</div>
                                    </div>
                                    <button
                                        onClick={() => removeFromQueue(i)}
                                        className="text-red-400 hover:text-red-300 hover:bg-red-400/10 p-2 rounded-full transition-colors"
                                        title="Remover da Fila"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </section>
            </div>
        </div>
    );
}
