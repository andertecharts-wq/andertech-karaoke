import { useRef, useEffect } from 'react';

export default function AudioVisualizer({ audioContext, sourceNode, isPlaying }) {
    const canvasRef = useRef(null);
    const analyserRef = useRef(null);
    const rafRef = useRef(null);

    useEffect(() => {
        if (!audioContext || !sourceNode || !isPlaying) return;

        // Configurar Analyser se ainda não existe
        if (!analyserRef.current) {
            const analyser = audioContext.createAnalyser();
            analyser.fftSize = 256;
            sourceNode.connect(analyser);
            analyserRef.current = analyser;
        }

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const analyser = analyserRef.current;
        const bufferLength = analyser.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            if (!isPlaying) return;

            rafRef.current = requestAnimationFrame(draw);

            analyser.getByteFrequencyData(dataArray);

            ctx.clearRect(0, 0, canvas.width, canvas.height);

            const barWidth = (canvas.width / bufferLength) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                barHeight = dataArray[i] / 2; // Escala

                // Gradiente bonito
                const gradient = ctx.createLinearGradient(0, canvas.height - barHeight, 0, canvas.height);
                gradient.addColorStop(0, '#a855f7'); // Roxo
                gradient.addColorStop(1, '#3b82f6'); // Azul

                ctx.fillStyle = gradient;
                ctx.fillRect(x, canvas.height - barHeight, barWidth, barHeight);

                x += barWidth + 1;
            }
        };

        draw();

        return () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, [audioContext, sourceNode, isPlaying]);

    return (
        <canvas
            ref={canvasRef}
            width={800}
            height={200}
            className="absolute bottom-0 left-0 w-full h-[30vh] opacity-50 pointer-events-none z-0 mix-blend-screen"
        />
    );
}
