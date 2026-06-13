import { useEffect, useRef } from 'react';
import styles from './Visualizer.module.css';

const BAR_COUNT = 24;

export default function Visualizer({ getFrequencyData, isPlaying, color }) {
  const canvasRef = useRef(null);
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      const data = isPlaying ? getFrequencyData() : null;
      const barWidth = width / BAR_COUNT;
      const gap = barWidth * 0.35;

      for (let i = 0; i < BAR_COUNT; i++) {
        let v;
        if (data) {
          // sample across the frequency spectrum
          const idx = Math.floor((i / BAR_COUNT) * data.length);
          v = data[idx] / 255;
        } else {
          // idle gentle wave
          v = 0.08 + 0.04 * Math.sin(Date.now() / 400 + i);
        }
        const barH = Math.max(3, v * height);
        const x = i * barWidth + gap / 2;
        const y = height - barH;

        ctx.fillStyle = color || '#f9a8d4';
        ctx.globalAlpha = 0.55 + v * 0.45;
        const w = barWidth - gap;
        const r = Math.min(3, w / 2);
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(x, y, w, barH, r);
        } else {
          ctx.rect(x, y, w, barH);
        }
        ctx.fill();
      }
      ctx.globalAlpha = 1;

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [getFrequencyData, isPlaying, color]);

  return <canvas ref={canvasRef} className={styles.canvas} width={280} height={48} />;
}
