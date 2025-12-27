import { Mic2, Music, Home, FolderHeart, Settings, Disc } from 'lucide-react';
import { NavLink } from 'react-router-dom';

const SIZE = 24;

export default function Sidebar() {
    return (
        <div className="w-[260px] h-full bg-bgSecondary border-r border-white/5 flex flex-col p-6 z-20">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-10 px-2">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center shadow-lg shadow-primary/20 overflow-hidden">
                    <img src="/logo_karaoke.jpg" alt="Logo" className="w-full h-full object-cover" />
                </div>
                <div>
                    <h1 className="text-lg font-bold tracking-tight text-white leading-tight">
                        AnderTech
                    </h1>
                    <span className="text-xs text-secondary font-medium tracking-wider uppercase">
                        Karaoke Pro
                    </span>
                </div>
            </div>

            {/* Menu Navigation */}
            <nav className="flex-1 space-y-2">
                <NavItem to="/" icon={<Home size={SIZE} />} label="Início" />
                <NavItem to="/library" icon={<Music size={SIZE} />} label="Minha Biblioteca" />
                <NavItem to="/party" icon={<Disc size={SIZE} />} label="Modo Festa" />
                <NavItem to="/favorites" icon={<FolderHeart size={SIZE} />} label="Favoritos" />
            </nav>

            {/* Footer / Settings */}
            <div className="pt-6 border-t border-white/5">
                <NavItem to="/admin" icon={<Settings size={SIZE} />} label="Estúdio Admin" />

                <div className="mt-6 p-4 rounded-2xl bg-gradient-to-br from-bgCard to-transparent border border-white/5">
                    <p className="text-xs text-slate-400 mb-2">Upgrade para Premium</p>
                    <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white text-sm font-bold rounded-lg transition-colors shadow-lg shadow-primary/20">
                        Assinar Agora
                    </button>
                </div>
            </div>
        </div>
    );
}

function NavItem({ to, icon, label }) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) => `
        flex items-center gap-4 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive
                    ? 'bg-primary/10 text-primary font-semibold shadow-[0_0_15px_rgba(139,92,246,0.15)] border border-primary/20'
                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                }
      `}
        >
            <div className="transition-transform group-hover:scale-110 duration-200">
                {icon}
            </div>
            <span className="text-sm">{label}</span>
        </NavLink>
    );
}
