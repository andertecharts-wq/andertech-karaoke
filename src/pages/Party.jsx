import { useState, useEffect } from 'react';
import { useKaraoke } from '../context/KaraokeContext';
import { QrCode, Smartphone, Wifi, Music4 } from 'lucide-react';

export default function PartyMode() {
    const { queue } = useKaraoke();
    const [qrValue, setQrValue] = useState('');

    useEffect(() => {
        // Gera o link para a raiz do site atual
        const host = window.location.href.replace('/party', '/remote');
        setQrValue(host);
    }, []);

    return (
        <div className="fixed inset-0 bg-black text-white overflow-hidden font-sans">
            {/* Background Animado */}
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-900 via-purple-900 to-black animate-pulse-slow"></div>
            <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

            <div className="relative z-10 flex h-full">
                {/* Lado Esquerdo: Chamada para Ação */}
                <div className="flex-1 flex flex-col justify-center items-center p-12 text-center border-r border-white/10 bg-black/20 backdrop-blur-sm">
                    <div className="mb-8 p-4 bg-white/10 rounded-full animate-bounce">
                        <Smartphone size={64} className="text-cyan-400" />
                    </div>

                    <h1 className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 mb-6 drop-shadow-2xl">
                        MODO FESTA
                    </h1>

                    <p className="text-2xl text-slate-300 mb-12 max-w-lg leading-relaxed">
                        Não precisa brigar pelo controle!<br />
                        <span className="text-white font-bold">Escaneie o QR Code</span> com seu celular para pedir músicas direto da pista.
                    </p>

                    <div className="bg-white p-4 rounded-xl shadow-2xl relative group transform hover:scale-105 transition-transform duration-500">
                        {/* QR Code via API */}
                        {qrValue && (
                            <img
                                src={`https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=${encodeURIComponent(qrValue)}&color=000000&bgcolor=ffffff`}
                                alt="QR Code para conectar"
                                className="w-64 h-64"
                            />
                        )}
                        <div className="absolute -bottom-4 right-[-10px] bg-green-500 text-white p-2 rounded-full shadow-lg animate-bounce">
                            <Wifi size={24} />
                        </div>
                    </div>

                    <p className="mt-8 text-sm text-slate-500 font-mono">
                        Certifique-se de estar na mesma rede Wi-Fi que este computador.
                    </p>
                </div>

                {/* Lado Direito: Fila de Espera */}
                <div className="w-[40%] bg-zinc-900/80 backdrop-blur-md p-8 flex flex-col border-l border-white/10">
                    <div className="flex items-center gap-4 mb-8 pb-4 border-b border-white/10">
                        <Music4 size={32} className="text-purple-400" />
                        <h2 className="text-3xl font-bold">Próximas Músicas</h2>
                    </div>

                    {queue.length === 0 ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-slate-500 opacity-50 gap-4">
                            <QrCode size={48} />
                            <p className="text-xl">A fila está vazia...</p>
                            <p>Seja o primeiro a pedir!</p>
                        </div>
                    ) : (
                        <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                            {queue.map((song, i) => (
                                <div key={i} className="bg-white/5 p-4 rounded-xl border border-white/5 flex items-center gap-4 hover:bg-white/10 transition-colors">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center font-bold text-lg shadow-lg">
                                        {i + 1}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h3 className="font-bold text-lg truncate">{song.title}</h3>
                                        <p className="text-slate-400 truncate">{song.artist}</p>
                                        <p className="text-xs text-cyan-400 mt-1 uppercase font-bold tracking-wider">
                                            Cantor: {song.singer || 'Anônimo'}
                                        </p>
                                    </div>
                                    {i === 0 && (
                                        <span className="text-xs font-bold bg-purple-500/20 text-purple-300 px-2 py-1 rounded-md border border-purple-500/30">
                                            A SEGUIR
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
