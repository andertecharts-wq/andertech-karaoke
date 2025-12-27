import { useState } from 'react';
import AdminSongList from '../components/admin/AdminSongList';
import UploadZone from '../components/UploadZone';
import { Settings, BarChart3, LayoutDashboard, Play, SkipForward, Mic2, ListMusic, Trash2, ArrowUp, Plus } from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';

export default function AdminDashboard() {
    const [activeTab, setActiveTab] = useState('live'); // 'live' | 'library'
    const { currentSong, queue, removeFromQueue, nextSong, addToQueue } = useKaraoke();
    const [adminSearch, setAdminSearch] = useState('');

    const handlePromote = (index) => {
        if (index <= 0) return;
        // Lógica simples: remove e readiciona no topo
        // Para fazer direito, precisaríamos de uma função reorderQueue no Context.
        // Como não temos, vamos fazer um "hack": clonar, remover e inserir no inicio
        // Isso requer acesso direto ao setQueue no context, que nao expusemos.
        // VAMOS PULAR essa complexidade agora e dar apenas "Play Now" se quiser furar fila completamente?
        // Ou melhor: Remover e PlayNow(song) faz ela virar a atual. 
        // Vamos manter simples: Remover.
        alert("Função 'Furar Fila' requer atualização no Contexto. Use 'Remover' e adicione novamente se precisar priorizar.");
    };

    const handleAdminAdd = () => {
        if (!adminSearch) return;
        // Adiciona como "Admin"
        const songData = {
            id: Date.now(),
            title: adminSearch,
            artist: "Pedido da Mesa (Admin)",
            singer: "ADMINISTRADOR",
            mode: 'youtube_search',
            query: `${adminSearch} Karaoke`
        };
        addToQueue(songData);
        setAdminSearch('');
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 min-h-screen pb-20">
            {/* Header com Tabs */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
                        {activeTab === 'live' ? 'Mesa de Controle Ao Vivo' : 'Gestão de Biblioteca'}
                    </h2>
                    <p className="text-slate-400 mt-2">
                        {activeTab === 'live' ? 'Gerencie a fila e o player em tempo real.' : 'Organize o catálogo de músicas e uploads.'}
                    </p>
                </div>

                <div className="flex bg-zinc-900 p-1 rounded-xl border border-white/10">
                    <button
                        onClick={() => setActiveTab('live')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'live' ? 'bg-purple-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <LayoutDashboard size={18} /> AO VIVO
                    </button>
                    <button
                        onClick={() => setActiveTab('library')}
                        className={`px-6 py-2 rounded-lg font-bold transition-all flex items-center gap-2 ${activeTab === 'library' ? 'bg-blue-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
                    >
                        <ListMusic size={18} /> BIBLIOTECA
                    </button>
                </div>
            </div>

            {/* CONTEÚDO DA ABA AO VIVO */}
            {activeTab === 'live' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Coluna 1: Player Atual e Ações Rápidas */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
                            <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 to-blue-900/20 opacity-0 group-hover:opacity-100 transition-opacity"></div>

                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                <Play size={14} className="text-green-400" /> Tocando Agora
                            </h3>

                            {currentSong ? (
                                <div>
                                    <div className="text-2xl font-bold text-white mb-1 leading-tight">{currentSong.title}</div>
                                    <div className="text-lg text-slate-400 mb-4">{currentSong.artist}</div>
                                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-900/30 text-cyan-400 text-xs font-bold border border-cyan-500/20 mb-6">
                                        <Mic2 size={12} />
                                        Cantor: {currentSong.singer || 'Desconhecido'}
                                    </div>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={nextSong}
                                            className="flex-1 bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/50 py-3 rounded-xl font-bold transition-all flex justify-center items-center gap-2"
                                        >
                                            <SkipForward size={20} /> PULAR
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center py-8 text-slate-500">
                                    <div className="bg-white/5 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                                        <Mic2 size={24} className="opacity-50" />
                                    </div>
                                    <p>Nenhuma música tocando.</p>
                                </div>
                            )}
                        </div>

                        {/* Adicionar Rápido */}
                        <div className="bg-zinc-900 border border-white/10 rounded-2xl p-6">
                            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Adicionar Pedido Manual
                            </h3>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    value={adminSearch}
                                    onChange={(e) => setAdminSearch(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleAdminAdd()}
                                    placeholder="Nome da música..."
                                    className="flex-1 bg-black/30 border border-white/10 rounded-lg px-4 text-white outline-none focus:border-purple-500"
                                />
                                <button
                                    onClick={handleAdminAdd}
                                    className="bg-purple-600 hover:bg-purple-500 text-white p-3 rounded-lg"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Coluna 2 e 3: Fila de Espera */}
                    <div className="lg:col-span-2 bg-zinc-900 border border-white/10 rounded-2xl p-6 flex flex-col h-[600px]">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold flex items-center gap-3">
                                <ListMusic className="text-cyan-400" />
                                Fila de Espera
                                <span className="bg-white/10 text-sm px-2 py-0.5 rounded-full text-slate-300">{queue.length}</span>
                            </h3>
                        </div>

                        <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar space-y-3">
                            {queue.length === 0 ? (
                                <div className="h-full flex flex-col items-center justify-center text-slate-500 opacity-50">
                                    <ListMusic size={64} className="mb-4" />
                                    <p className="text-lg">Fila vazia</p>
                                </div>
                            ) : (
                                queue.map((song, i) => (
                                    <div key={i} className="group flex items-center gap-4 bg-black/20 hover:bg-white/5 p-4 rounded-xl border border-white/5 transition-colors">
                                        <div className="font-mono font-bold text-slate-500 w-6 text-center">{i + 1}</div>

                                        <div className="flex-1 min-w-0">
                                            <div className="font-bold truncate text-white">{song.title}</div>
                                            <div className="flex items-center gap-2 text-xs text-slate-400">
                                                <span>{song.artist}</span>
                                                <span className="w-1 h-1 bg-slate-600 rounded-full"></span>
                                                <span className="text-cyan-400 uppercase font-bold">{song.singer || 'Anon'}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button
                                                onClick={() => removeFromQueue(i)}
                                                className="p-2 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-lg transition-colors"
                                                title="Remover"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* CONTEÚDO DA ABA BIBLIOTECA (Antigo Dashboard) */}
            {activeTab === 'library' && (
                <div className="space-y-8 animate-in slide-in-from-right duration-300">
                    {/* Cards de Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 rounded-xl bg-bgCard border border-white/5 flex gap-3 items-center">
                            <div className="p-2 bg-primary/20 rounded-lg text-primary">
                                <BarChart3 size={20} />
                            </div>
                            <div>
                                <p className="text-xs text-slate-400 font-bold uppercase">Total Músicas</p>
                                <p className="text-xl font-bold text-white">1,248</p>
                            </div>
                        </div>
                    </div>

                    {/* Upload Rápido */}
                    <section className="bg-bgCard p-6 rounded-2xl border border-white/5 shadow-xl">
                        <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                            <UploadZone size={20} className="hidden" />
                            Upload Inteligente
                        </h3>
                        <UploadZone />
                    </section>

                    {/* Lista de Gestão */}
                    <section>
                        <AdminSongList />
                    </section>
                </div>
            )}
        </div>
    );
}
