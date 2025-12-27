import { useState } from 'react';
import { Play, TrendingUp, Search, Mic2, Youtube, Plus, ListMusic } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useKaraoke } from '../context/KaraokeContext';

export default function Home() {
    const navigate = useNavigate();
    const { addToQueue, playNow, queue } = useKaraoke();
    const [searchTerm, setSearchTerm] = useState('');
    const [notification, setNotification] = useState(null);

    const trending = [
        { id: 1, title: "Evidências", artist: "Chitãozinho e Xororó", img: "https://upload.wikimedia.org/wikipedia/pt/8/86/Chit%C3%A3ozinho_%26_Xoror%C3%B3_-_Cowboy_do_Asfalto.jpg" },
        { id: 2, title: "Bohemian Rhapsody", artist: "Queen", img: "https://upload.wikimedia.org/wikipedia/en/9/9f/Bohemian_Rhapsody.png" },
        { id: 3, title: "Anna Júlia", artist: "Los Hermanos", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/a/a4/Los_Hermanos_1999.jpg/220px-Los_Hermanos_1999.jpg" },
        { id: 4, title: "Tempo Perdido", artist: "Legião Urbana", img: "https://upload.wikimedia.org/wikipedia/pt/thumb/3/35/Dois_Legi%C3%A3o.jpg/220px-Dois_Legi%C3%A3o.jpg" }
    ];

    const showNotification = (msg) => {
        setNotification(msg);
        setTimeout(() => setNotification(null), 3000);
    };

    const prepareSongData = (termOrSong, singerName = "Você") => {
        let title, artist;

        if (typeof termOrSong === 'string') {
            title = termOrSong;
            artist = "Busca Inteligente";
        } else {
            title = termOrSong.title;
            artist = termOrSong.artist;
        }

        // MAPA DE VÍDEOS GARANTIDOS (VIPS)
        const vipMap = {
            'evidencias': 'x-0KoCAV4mc',
            'evidências': 'x-0KoCAV4mc',
            'bohemian rhapsody': 'vsl3gBVO2k4',
        };

        const normalizedTerm = title.toLowerCase().trim();
        const vipId = vipMap[normalizedTerm];

        return {
            id: Date.now(), // ID único temporário para fila
            title,
            artist,
            singer: singerName, // Quem pediu
            videoId: vipId,
            query: vipId ? null : `${title} ${artist} Karaoke`,
            mode: vipId ? 'youtube_direct' : 'youtube_search'
        };
    };

    const handlePlayNow = (termOrSong) => {
        const songData = prepareSongData(termOrSong);
        playNow(songData);
        navigate('/player/current');
    };

    const handleAddToQueue = (termOrSong) => {
        const songData = prepareSongData(termOrSong);
        addToQueue(songData);
        showNotification(`"${songData.title}" adicionada à fila! 🎵`);
    };

    return (
        <div className="p-8 max-w-7xl mx-auto space-y-12 min-h-screen relative">
            {/* Notification Toast */}
            {notification && (
                <div className="fixed top-24 right-8 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in-down flex items-center gap-3 font-bold border border-green-400">
                    <ListMusic /> {notification}
                </div>
            )}

            {/* Hero Section Premium */}
            <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-violet-900/40 to-fuchsia-900/40 border border-white/10 p-12 text-center shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=2070&auto=format&fit=crop')] opacity-20 bg-cover bg-center mix-blend-overlay"></div>

                <div className="relative z-10 flex flex-col items-center animate-fade-in-up">
                    <div className="mb-6 p-4 bg-white/5 rounded-full border border-white/10 backdrop-blur shadow-[0_0_30px_rgba(255,255,255,0.1)]">
                        <h2 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500 tracking-tight drop-shadow-2xl">
                            ANDERTECH KARAOKÊ
                        </h2>
                    </div>

                    <p className="text-xl text-slate-300 mb-10 max-w-2xl font-light">
                        A maior biblioteca de karaokê do mundo, alimentada pelo YouTube. <br />
                        <span className="text-white font-semibold">Sem voz. Letras sincronizadas. Grátis.</span>
                    </p>

                    <div className="w-full max-w-2xl relative group">
                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 to-purple-600 blur-xl opacity-30 group-hover:opacity-60 transition-opacity duration-500 rounded-full"></div>
                        <div className="relative flex items-center bg-black/60 backdrop-blur-xl border border-white/20 rounded-full p-2 shadow-2xl focus-within:ring-2 focus-within:ring-cyan-500/50 transition-all">
                            <Search className="text-slate-400 ml-4 mr-2" size={24} />
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyDown={(e) => e.key === 'Enter' && handlePlayNow(searchTerm)}
                                placeholder="Qual música vamos cantar? (Ex: Evidências)"
                                className="bg-transparent border-none outline-none text-white text-lg w-full placeholder:text-slate-500 h-10 px-2"
                            />
                            <button
                                onClick={() => handlePlayNow(searchTerm)}
                                className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white px-8 py-3 rounded-full font-bold transition-all hover:scale-105 shadow-lg flex items-center gap-2"
                            >
                                <Play size={18} fill="currentColor" />
                                CANTAR
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* Trending Grid */}
            <section>
                <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                        <TrendingUp className="text-cyan-400" size={28} />
                        <h3 className="text-2xl font-bold text-white">Hits do Momento</h3>
                    </div>
                    {queue.length > 0 && (
                        <div className="text-slate-400 text-sm font-mono bg-white/5 px-4 py-2 rounded-lg border border-white/5">
                            {queue.length} músicas na fila
                        </div>
                    )}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {trending.map((item) => (
                        <div
                            key={item.id}
                            className="group relative bg-slate-900/50 border border-white/5 rounded-2xl overflow-hidden hover:-translate-y-2 hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] transition-all duration-300 flex flex-col"
                        >
                            <div className="aspect-square relative overflow-hidden cursor-pointer" onClick={() => handlePlayNow(item)}>
                                <img
                                    src={item.img}
                                    alt={item.title}
                                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 group-hover:scale-110 transition-all duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                                    <div className="w-14 h-14 bg-white/10 backdrop-blur rounded-full flex items-center justify-center border border-white/20 hover:scale-110 transition-transform">
                                        <Play className="text-white ml-1" size={24} fill="white" />
                                    </div>
                                </div>
                            </div>
                            <div className="p-5 flex-1 flex flex-col">
                                <h4 className="font-bold text-white truncate text-lg">{item.title}</h4>
                                <p className="text-sm text-slate-400 truncate font-medium mb-4">{item.artist}</p>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleAddToQueue(item);
                                    }}
                                    className="mt-auto w-full bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white py-2 rounded-lg text-sm font-bold transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus size={16} /> Fila
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
}
