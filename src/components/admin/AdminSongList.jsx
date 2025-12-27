import { useState } from 'react';
import { Plus, Upload, Trash2, Edit2, CheckCircle } from 'lucide-react';

export default function AdminSongList() {
    const [songs, setSongs] = useState([
        { id: 1, title: "Tempo Perdido", artist: "Legião Urbana", status: "Pronto" },
        { id: 2, title: "Evidências", artist: "Chitãozinho & Xororó", status: "Pronto" },
        { id: 3, title: "Anna Júlia", artist: "Los Hermanos", status: "Processando..." },
    ]);

    return (
        <div className="bg-bgCard rounded-xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5 flex justify-between items-center">
                <h3 className="text-lg font-bold text-white">Minhas Músicas</h3>
                <button className="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-bold transition-colors">
                    <Plus size={16} />
                    Nova Música
                </button>
            </div>

            <table className="w-full text-left border-collapse">
                <thead className="bg-white/5 text-xs uppercase text-slate-400 font-semibold">
                    <tr>
                        <th className="p-4">Título</th>
                        <th className="p-4">Artista</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Ações</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {songs.map(song => (
                        <tr key={song.id} className="hover:bg-white/5 transition-colors">
                            <td className="p-4 font-medium text-white">{song.title}</td>
                            <td className="p-4 text-slate-400">{song.artist}</td>
                            <td className="p-4">
                                <span className={`px-2 py-1 rounded text-xs font-bold ${song.status === 'Pronto' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-yellow-500/20 text-yellow-400 animate-pulse'
                                    }`}>
                                    {song.status}
                                </span>
                            </td>
                            <td className="p-4 flex gap-2 justify-end">
                                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-white transition-colors">
                                    <Edit2 size={16} />
                                </button>
                                <button className="p-2 hover:bg-white/10 rounded text-slate-400 hover:text-red-400 transition-colors">
                                    <Trash2 size={16} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {songs.length === 0 && (
                <div className="p-12 text-center text-slate-500">
                    Nenhuma música adicionada ainda.
                </div>
            )}
        </div>
    );
}
