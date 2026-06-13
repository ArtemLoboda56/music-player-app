import { useEffect, useRef, useState } from 'react';

// Creates (once) an AnalyserNode connected to the given <audio> element
// and returns a ref + function to read frequency data each frame.
export function useAudioAnalyser(audioRef) {
  const ctxRef = useRef(null);
  const analyserRef = useRef(null);
  const sourceRef = useRef(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setup = () => {
      if (ctxRef.current) return;
      try {
        const Ctx = window.AudioContext || window.webkitAudioContext;
        const ctx = new Ctx();
        const source = ctx.createMediaElementSource(audio);
        const analyser = ctx.createAnalyser();
        analyser.fftSize = 64;
        source.connect(analyser);
        analyser.connect(ctx.destination);
        ctxRef.current = ctx;
        analyserRef.current = analyser;
        sourceRef.current = source;
        setReady(true);
      } catch (e) {
        // Already connected or unsupported
      }
    };

    // Must be created after a user gesture (play)
    const onPlay = () => {
      setup();
      if (ctxRef.current?.state === 'suspended') ctxRef.current.resume();
    };

    audio.addEventListener('play', onPlay);
    return () => audio.removeEventListener('play', onPlay);
  }, [audioRef]);

  const getFrequencyData = () => {
    if (!analyserRef.current) return null;
    const arr = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteFrequencyData(arr);
    return arr;
  };

  const getWaveformData = () => {
    if (!analyserRef.current) return null;
    const arr = new Uint8Array(analyserRef.current.frequencyBinCount);
    analyserRef.current.getByteTimeDomainData(arr);
    return arr;
  };

  return { ready, getFrequencyData, getWaveformData };
}
