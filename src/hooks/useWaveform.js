import { useEffect, useState, useRef } from 'react';

const cache = new Map();

export function useWaveform(url, samples = 80) {
  const [peaks, setPeaks] = useState(null);
  const ctxRef = useRef(null);

  useEffect(() => {
    setPeaks(null);
    if (!url) return;

    if (cache.has(url)) {
      setPeaks(cache.get(url));
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        if (!ctxRef.current) ctxRef.current = new Ctx();
        const res = await fetch(url);
        const buf = await res.arrayBuffer();
        const audioBuf = await ctxRef.current.decodeAudioData(buf);
        const channel = audioBuf.getChannelData(0);
        const blockSize = Math.floor(channel.length / samples);
        const result = [];
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          const start = i * blockSize;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(channel[start + j] || 0);
          }
          result.push(sum / blockSize);
        }
        const max = Math.max(...result, 0.0001);
        const normalized = result.map(v => v / max);
        if (!cancelled) {
          cache.set(url, normalized);
          setPeaks(normalized);
        }
      } catch {
        if (!cancelled) setPeaks(null);
      }
    })();

    return () => { cancelled = true; };
  }, [url, samples]);

  return peaks;
}
