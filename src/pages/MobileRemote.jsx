import { useState } from 'react';
import { Search, Plus, ListMusic, Music, MonitorSmartphone } from 'lucide-react';
import { useKaraoke } from '../context/KaraokeContext';

export default function MobileRemote() {
    const { addToQueue, queue } = useKaraoke();
    const [searchTerm, setSearchTerm] = useState('');
    const [activeTab, setActiveTab] = useState('search'); // 'search' | 'queue'
    const [notification, setNotification] = useState('');
    const [singerName, setSingerName] = useState(''); // Estado para o nome do cantor
    const [selectedGenre, setSelectedGenre] = useState('Todos'); // Filtro de Gênero

    const trending = [
        { id: 1, title: "Evidências", artist: "Chitãozinho e Xororó", genre: "Sertanejo" },
        { id: 2, title: "Bohemian Rhapsody", artist: "Queen", genre: "Rock" },
        { id: 3, title: "Anna Júlia", artist: "Los Hermanos", genre: "Pop Rock" },
        { id: 4, title: "Tempo Perdido", artist: "Legião Urbana", genre: "Rock Nacional" },
        { id: 5, title: "Cheia de Manias", artist: "Raça Negra", genre: "Pagode" },
        { id: 6, title: "Menina Veneno", artist: "Ritchie", genre: "Pop 80s" }
    ];

    const genres = ["Todos", "Sertanejo", "Rock", "Pagode", "Pop", "Internacional"];

    const showToast = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(''), 2000);
    };

    const handleAdd = (songOrTerm) => {
        // Validação simples: exigir nome (opcional, pode deixar anônimo se quiser)
        const singer = singerName.trim() || "Anônimo Mobile";

        let title, artist;
        if (typeof songOrTerm === 'string') {
            title = songOrTerm;
            artist = "Pedido via Mobile";
        } else {
            title = songOrTerm.title;
            artist = songOrTerm.artist;
        }

        // MAPA DE VIPS (Mesma lógica da Home)
        const vipMap = {
            'evidencias': 'x-0KoCAV4mc',
            'evidências': 'x-0KoCAV4mc',
            'bohemian rhapsody': 'vsl3gBVO2k4',
        };
        const normalizedTerm = title.toLowerCase().trim();
        const vipId = vipMap[normalizedTerm];

        const songData = {
            id: Date.now(),
            title,
            artist,
            singer, // Adiciona o cantor
            videoId: vipId,
            query: vipId ? null : `${title} ${artist} Karaoke`,
            mode: vipId ? 'youtube_direct' : 'youtube_search'
        };

        addToQueue(songData);
        showToast(`🎵 Pedido de ${singer} enviado!`);
        setSearchTerm('');
    };

    // Filtra lista de sugestões
    const filteredTrending = selectedGenre === 'Todos'
        ? trending
        : trending.filter(t => t.genre.includes(selectedGenre) || (selectedGenre === 'Rock' && t.genre.includes('Rock')));

    return (
        <div className="min-h-screen bg-zinc-950 text-white font-sans pb-20">
            {/* Header */}
            <div className="bg-zinc-900 p-4 sticky top-0 z-50 border-b border-white/5 shadow-lg flex justify-between items-center">
                <div className="font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 text-lg">
                    REMOTE
                </div>

                {/* Input Nome no Header */}
                <div className="flex items-center bg-zinc-800 rounded-full px-3 py-1 border border-white/10 w-40">
                    <span className="text-xs text-zinc-500 mr-2">👤</span>
                    <input
                        type="text"
                        value={singerName}
                        onChange={(e) => setSingerName(e.target.value)}
                        placeholder="Seu Nome..."
                        className="bg-transparent text-xs text-white outline-none w-full placeholder:text-zinc-600"
                    />
                </div>
            </div>

            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-full shadow-xl z-50 text-sm font-bold animate-fade-in-down whitespace-nowrap">
                    {notification}
                </div>
            )}

            {activeTab === 'search' && (
                <div className="p-4 space-y-6">
                    {/* Search Bar */}
                    <div className="relative">
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Buscar música..."
                            className="w-full bg-zinc-800 text-white p-4 rounded-xl pl-12 shadow-inner focus:ring-2 focus:ring-purple-500 outline-none transition-all"
                        />
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
                        <button
                            onClick={() => searchTerm && handleAdd(searchTerm)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 bg-purple-600 p-2 rounded-lg text-white font-bold text-xs"
                        >
                            PEDIR
                        </button>
                    </div>

                    {/* Genre Filters */}
                    <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                        {genres.map(g => (
                            <button
                                key={g}
                                onClick={() => setSelectedGenre(g)}
                                className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-colors ${selectedGenre === g ? 'bg-white text-black' : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'}`}
                            >
                                {g}
                            </button>
                        ))}
                    </div>

                    {/* Quick Hits */}
                    <div>
                        <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-3">Sugestões - {selectedGenre}</h3>
                        <div className="grid grid-cols-1 gap-3">
                            {filteredTrending.map((song) => (
                                <div key={song.id} className="bg-zinc-900 p-4 rounded-xl border border-white/5 flex justify-between items-center active:bg-zinc-800 transition-colors">
                                    <div>
                                        <div className="font-bold text-sm">{song.title}</div>
                                        <div className="text-xs text-zinc-500">{song.artist}</div>
                                    </div>
                                    <button
                                        onClick={() => handleAdd(song)}
                                        className="bg-white/10 p-2 rounded-full text-purple-400 hover:bg-purple-500 hover:text-white transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {activeTab === 'queue' && (
                <div className="p-4">
                    <h3 className="text-zinc-400 text-xs font-bold uppercase tracking-wider mb-4">Fila de Reprodução ({queue.length})</h3>

                    {queue.length === 0 ? (
                        <div className="text-center py-20 text-zinc-600">
                            <Music size={48} className="mx-auto mb-4 opacity-20" />
                            <p>Nenhuma música na fila.</p>
                            <button onClick={() => setActiveTab('search')} className="text-purple-400 font-bold mt-2">Pedir uma agora</button>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {queue.map((song, i) => (
                                <div key={i} className="flex items-center gap-4 bg-zinc-900 p-4 rounded-xl border-l-4 border-purple-500 relative overflow-hidden">
                                    {/* Watermark do cantor */}
                                    <div className="absolute right-2 bottom-1 text-[10px] text-zinc-600 font-mono italic">
                                        Pedido por: {song.singer || 'Anônimo'}
                                    </div>

                                    <div className="text-xl font-mono font-bold text-zinc-600">
                                        {i + 1}
                                    </div>
                                    <div className="min-w-0 flex-1 pb-2">
                                        <div className="font-bold text-sm truncate">{song.title}</div>
                                        <div className="text-xs text-zinc-500 truncate">{song.artist}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Bottom Nav */}
            <div className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-white/5 flex justify-around p-2 pb-safe z-50">
                <button
                    onClick={() => setActiveTab('search')}
                    className={`flex flex-col items-center p-2 rounded-xl w-full ${activeTab === 'search' ? 'text-purple-400 bg-white/5' : 'text-zinc-500'}`}
                >
                    <Search size={24} />
                    <span className="text-[10px] mt-1 font-bold">Buscar</span>
                </button>
                <button
                    onClick={() => setActiveTab('queue')}
                    className={`flex flex-col items-center p-2 rounded-xl w-full ${activeTab === 'queue' ? 'text-purple-400 bg-white/5' : 'text-zinc-500'}`}
                >
                    <div className="relative">
                        <ListMusic size={24} />
                        {queue.length > 0 && <span className="absolute -top-1 -right-2 bg-red-500 text-white text-[9px] w-4 h-4 flex items-center justify-center rounded-full font-bold">{queue.length}</span>}
                    </div>
                    <span className="text-[10px] mt-1 font-bold">Fila</span>
                </button>
            </div>
        </div>
    );
}
