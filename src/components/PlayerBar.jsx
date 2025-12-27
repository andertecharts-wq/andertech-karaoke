import { Play, SkipBack, SkipForward, Volume2, Mic2, MonitorUp, ListMusic } from 'lucide-react';
import { useState } from 'react';

export default function PlayerBar() {
    const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(70);

    return (
        <div className="h-[90px] w-full bg-bgSecondary/95 backdrop-blur-xl border-t border-white/5 flex items-center px-6 justify-between fixed bottom-0 z-50">

            {/* Current Track Info */}
            <div className="flex items-center gap-4 w-[300px]">
                <div className="w-14 h-14 rounded-lg bg-slate-800 relative overflow-hidden group">
                    {/* Placeholder Album Art */}
                    <div className="absolute inset-0 bg-gradient-to-br from-indigo-500 to-purple-600 animate-pulse"></div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 bg-black/40 transition-opacity">
                        <MonitorUp size={20} className="text-white" />
                    </div>
                </div>
                <div>
                    <h4 className="text-white font-semibold text-sm line-clamp-1 hover:underline cursor-pointer">
                        Bohemian Rhapsody
                    </h4>
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-400">Queen</span>
                        <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded bg-white/10 text-slate-300 border border-white/5">
                            HI-RES
                        </span>
                    </div>
                </div>
            </div>

            {/* Controls */}
            <div className="flex flex-col items-center gap-2 flex-1 max-w-2xl">
                <div className="flex items-center gap-6">
                    <button className="text-slate-400 hover:text-white transition-colors">
                        <span title="Shuffle" className="text-xl">🔀</span>
                    </button>

                    <button className="text-slate-300 hover:text-white transition-colors hover:scale-110 active:scale-95">
                        <SkipBack size={24} fill="currentColor" />
                    </button>

                    <button
                        onClick={() => setIsPlaying(!isPlaying)}
                        className="w-12 h-12 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 active:scale-95 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                    >
                        {isPlaying ? <span className="font-bold text-xl">⏸</span> : <Play size={24} fill="currentColor" className="ml-1" />}
                    </button>

                    <button className="text-slate-300 hover:text-white transition-colors hover:scale-110 active:scale-95">
                        <SkipForward size={24} fill="currentColor" />
                    </button>

                    <button className="text-slate-400 hover:text-white transition-colors">
                        <span title="Repeat" className="text-xl">🔁</span>
                    </button>
                </div>

                {/* Progress Bar */}
                <div className="w-full flex items-center gap-3 text-xs text-slate-400 font-medium font-mono">
                    <span>1:24</span>
                    <div className="flex-1 h-1.5 bg-white/10 rounded-full relative cursor-pointer group">
                        <div className="absolute left-0 top-0 bottom-0 w-[35%] bg-gradient-to-r from-primary to-secondary rounded-full group-hover:from-primary group-hover:to-purple-400">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                    </div>
                    <span>5:55</span>
                </div>
            </div>

            {/* Volume & Extra Controls */}
            <div className="w-[300px] flex items-center justify-end gap-4">
                <button className="text-slate-400 hover:text-primary transition-colors flex items-center gap-2 px-3 py-1.5 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/5">
                    <Mic2 size={18} />
                    <span className="text-xs font-bold">VOCAL DESL</span>
                </button>

                <button className="text-slate-400 hover:text-white">
                    <ListMusic size={20} />
                </button>

                <div className="flex items-center gap-2 w-24 group">
                    <Volume2 size={20} className="text-slate-400 group-hover:text-white" />
                    <div className="flex-1 h-1 bg-white/10 rounded-full cursor-pointer overflow-hidden">
                        <div className="h-full bg-white w-[70%] rounded-full group-hover:bg-primary transition-colors"></div>
                    </div>
                </div>
            </div>

        </div>
    );
}
