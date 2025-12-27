import { createContext, useState, useContext, useEffect } from 'react';

const KaraokeContext = createContext();

export function KaraokeProvider({ children }) {
    // Inicializa estado do localStorage se existir
    const [queue, setQueue] = useState(() => {
        const saved = localStorage.getItem('karaoke_queue');
        return saved ? JSON.parse(saved) : [];
    });

    const [history, setHistory] = useState(() => {
        const saved = localStorage.getItem('karaoke_history');
        return saved ? JSON.parse(saved) : [];
    });

    const [currentSong, setCurrentSong] = useState(null);

    // Salva no localStorage sempre que mudar
    useEffect(() => {
        localStorage.setItem('karaoke_queue', JSON.stringify(queue));
    }, [queue]);

    useEffect(() => {
        localStorage.setItem('karaoke_history', JSON.stringify(history));
    }, [history]);

    // Adicionar música à fila
    const addToQueue = (song) => {
        // Se não tem nada tocando e fila vazia, define como atual
        if (!currentSong) {
            setCurrentSong(song);
        } else {
            setQueue((prev) => [...prev, song]);
        }
    };

    // Tocar imediatamente (fura fila ou inicia)
    const playNow = (song) => {
        if (currentSong) {
            // Se já tem uma tocando, coloca a atual no histórico e troca
            addToHistory(currentSong);
        }
        setCurrentSong(song);
    };

    // Próxima música
    const nextSong = () => {
        if (currentSong) {
            addToHistory(currentSong);
        }

        if (queue.length > 0) {
            const [next, ...rest] = queue;
            setCurrentSong(next);
            setQueue(rest);
        } else {
            setCurrentSong(null); // Fim da fila
        }
    };

    const addToHistory = (song) => {
        setHistory(prev => [song, ...prev].slice(0, 50)); // Guarda as últimas 50
    };

    const removeFromQueue = (index) => {
        setQueue((prev) => prev.filter((_, i) => i !== index));
    };

    return (
        <KaraokeContext.Provider value={{
            queue,
            addToQueue,
            removeFromQueue,
            currentSong,
            setCurrentSong, // Para controle manual se necessário
            playNow,
            nextSong,
            history
        }}>
            {children}
        </KaraokeContext.Provider>
    );
}

export function useKaraoke() {
    return useContext(KaraokeContext);
}
