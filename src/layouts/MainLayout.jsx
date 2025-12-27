import Sidebar from '../components/Sidebar';
import PlayerBar from '../components/PlayerBar';
import { Outlet } from 'react-router-dom';

export default function MainLayout() {
    return (
        <div className="flex h-screen w-screen bg-bgMain overflow-hidden font-sans text-white">
            <Sidebar />
            <div className="flex-1 flex flex-col relative">
                <main className="flex-1 overflow-y-auto pb-[100px] scroll-smooth">
                    <Outlet />
                </main>
                <PlayerBar />
            </div>

            {/* Background Ambient Effects */}
            <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>
            <div className="fixed bottom-0 left-[260px] w-[500px] h-[500px] bg-secondary/5 blur-[100px] rounded-full pointer-events-none z-0 mix-blend-screen"></div>
        </div>
    );
}
