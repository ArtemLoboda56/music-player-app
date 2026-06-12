import { useState, useRef, useEffect, useCallback } from 'react';
import { DEFAULT_TRACKS } from '../data/tracks';

export function usePlayer() {
  const [tracks, setTracks]         = useState(DEFAULT_TRACKS);
  const [currentId, setCurrentId]   = useState(DEFAULT_TRACKS[0].id);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(0.8);
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none | one | all

  const audioRef = useRef(null);

  const current = tracks.find(t => t.id === currentId) || tracks[0];

  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const loadTrack = useCallback((id) => {
    setCurrentId(id);
    setProgress(0);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, []);

  const togglePlay = useCallback(() => {
    if (!audioRef.current || !current.file) {
      setIsPlaying(p => !p);
      return;
    }
    if (isPlaying) audioRef.current.pause();
    else           audioRef.current.play();
    setIsPlaying(p => !p);
  }, [isPlaying, current.file]);

  const getNextId = useCallback(() => {
    const idx = tracks.findIndex(t => t.id === currentId);
    if (isShuffled) {
      let ni;
      do { ni = Math.floor(Math.random() * tracks.length); } while (ni === idx && tracks.length > 1);
      return tracks[ni].id;
    }
    return tracks[(idx + 1) % tracks.length].id;
  }, [tracks, currentId, isShuffled]);

  const getPrevId = useCallback(() => {
    const idx = tracks.findIndex(t => t.id === currentId);
    return tracks[(idx - 1 + tracks.length) % tracks.length].id;
  }, [tracks, currentId]);

  const handleNext = useCallback(() => loadTrack(getNextId()), [loadTrack, getNextId]);
  const handlePrev = useCallback(() => loadTrack(getPrevId()), [loadTrack, getPrevId]);

  const handleEnded = useCallback(() => {
    if (repeatMode === 'one') {
      audioRef.current.currentTime = 0;
      audioRef.current.play();
    } else if (repeatMode === 'all' || isShuffled) {
      loadTrack(getNextId());
    } else {
      const idx = tracks.findIndex(t => t.id === currentId);
      if (idx < tracks.length - 1) loadTrack(getNextId());
      else setIsPlaying(false);
    }
  }, [repeatMode, isShuffled, loadTrack, getNextId, tracks, currentId]);

  const handleTimeUpdate = () => {
    if (!audioRef.current) return;
    setProgress(audioRef.current.currentTime);
    setDuration(audioRef.current.duration || 0);
  };

  const handleSeek = (val) => {
    setProgress(val);
    if (audioRef.current) audioRef.current.currentTime = val;
  };

  const addTrack = useCallback((track) => {
    const id = Date.now();
    setTracks(p => [...p, { ...track, id }]);
  }, []);

  const deleteTrack = useCallback((id) => {
    setTracks(p => {
      const next = p.filter(t => t.id !== id);
      if (currentId === id && next.length) setCurrentId(next[0].id);
      return next;
    });
  }, [currentId]);

  const cycleRepeat = () =>
    setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none');

  return {
    tracks, current, currentId,
    isPlaying, progress, duration, volume,
    isShuffled, repeatMode,
    audioRef,
    setVolume,
    togglePlay, handleNext, handlePrev,
    handleTimeUpdate, handleSeek, handleEnded,
    loadTrack, addTrack, deleteTrack,
    setIsShuffled, cycleRepeat,
  };
}
