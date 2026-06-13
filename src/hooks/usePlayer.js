import { useState, useRef, useEffect, useCallback } from 'react';
import { DEFAULT_TRACKS, DEFAULT_PLAYLISTS } from '../data/tracks';
import { putFile, getFile, deleteFile } from '../utils/idbStore';

const LS_TRACKS    = 'vibes-tracks';
const LS_PLAYLISTS = 'vibes-playlists';
const LS_VOLUME    = 'vibes-volume';

function loadLS(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

function saveLS(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch {}
}

// Strip blob: URLs before persisting (they don't survive reload)
function stripBlobs(tracks) {
  return tracks.map(t => ({
    ...t,
    file:  t.file  && t.file.startsWith('blob:')  ? null : t.file,
    cover: t.cover && t.cover.startsWith('blob:') ? null : t.cover,
  }));
}

export function usePlayer() {
  const [tracks, setTracks]         = useState(() => {
    const stored = loadLS(LS_TRACKS, null);
    return stored && stored.length ? stored : DEFAULT_TRACKS;
  });
  const [playlists, setPlaylists]   = useState(() => loadLS(LS_PLAYLISTS, DEFAULT_PLAYLISTS));
  const [currentId, setCurrentId]   = useState(tracks[0]?.id ?? null);
  const [isPlaying, setIsPlaying]   = useState(false);
  const [progress, setProgress]     = useState(0);
  const [duration, setDuration]     = useState(0);
  const [volume, setVolume]         = useState(() => loadLS(LS_VOLUME, 0.8));
  const [isShuffled, setIsShuffled] = useState(false);
  const [repeatMode, setRepeatMode] = useState('none'); // none | one | all
  const [hydrated, setHydrated]     = useState(false);

  const audioRef = useRef(null);

  const current = tracks.find(t => t.id === currentId) || tracks[0] || null;

  // Hydrate blob URLs from IndexedDB on mount
  useEffect(() => {
    (async () => {
      const hydratedTracks = await Promise.all(tracks.map(async t => {
        let file = t.file, cover = t.cover;
        if (!file && t.fileKey) {
          const blob = await getFile(t.fileKey);
          if (blob) file = URL.createObjectURL(blob);
        }
        if (!cover && t.coverKey) {
          const blob = await getFile(t.coverKey);
          if (blob) cover = URL.createObjectURL(blob);
        }
        return { ...t, file, cover };
      }));
      setTracks(hydratedTracks);
      setHydrated(true);
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist tracks (without blob URLs) whenever they change
  useEffect(() => {
    if (!hydrated) return;
    saveLS(LS_TRACKS, stripBlobs(tracks));
  }, [tracks, hydrated]);

  useEffect(() => {
    saveLS(LS_PLAYLISTS, playlists);
  }, [playlists]);

  useEffect(() => {
    saveLS(LS_VOLUME, volume);
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
    if (!current) return;
    if (!audioRef.current || !current.file) {
      setIsPlaying(p => !p);
      return;
    }
    if (isPlaying) audioRef.current.pause();
    else           audioRef.current.play();
    setIsPlaying(p => !p);
  }, [isPlaying, current]);

  const playPause = useCallback((forcePlay) => {
    if (!current || !audioRef.current) return;
    if (forcePlay) audioRef.current.play();
    else audioRef.current.pause();
    setIsPlaying(forcePlay);
  }, [current]);

  const getNextId = useCallback((list) => {
    const src = list || tracks;
    const idx = src.findIndex(t => t.id === currentId);
    if (isShuffled) {
      let ni;
      do { ni = Math.floor(Math.random() * src.length); } while (ni === idx && src.length > 1);
      return src[ni].id;
    }
    return src[(idx + 1) % src.length].id;
  }, [tracks, currentId, isShuffled]);

  const getPrevId = useCallback((list) => {
    const src = list || tracks;
    const idx = src.findIndex(t => t.id === currentId);
    return src[(idx - 1 + src.length) % src.length].id;
  }, [tracks, currentId]);

  const handleNext = useCallback((list) => loadTrack(getNextId(list)), [loadTrack, getNextId]);
  const handlePrev = useCallback((list) => loadTrack(getPrevId(list)), [loadTrack, getPrevId]);

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

  const seekBy = useCallback((deltaSeconds) => {
    if (!audioRef.current) return;
    const next = Math.min(Math.max(0, audioRef.current.currentTime + deltaSeconds), duration || Infinity);
    audioRef.current.currentTime = next;
    setProgress(next);
  }, [duration]);

  // Add track — stores blobs in IDB if provided as File objects
  const addTrack = useCallback(async (track) => {
    const id = Date.now();
    let { fileBlob, coverBlob, ...rest } = track;
    let fileKey = null, coverKey = null, file = null, cover = null;

    if (fileBlob) {
      fileKey = `audio-${id}`;
      await putFile(fileKey, fileBlob);
      file = URL.createObjectURL(fileBlob);
    }
    if (coverBlob) {
      coverKey = `cover-${id}`;
      await putFile(coverKey, coverBlob);
      cover = URL.createObjectURL(coverBlob);
    }

    setTracks(p => [...p, {
      ...rest, id, file, cover, fileKey, coverKey,
      playlistIds: rest.playlistIds || [],
      lyrics: rest.lyrics || '',
      addedAt: id,
    }]);
  }, []);

  const deleteTrack = useCallback((id) => {
    setTracks(p => {
      const target = p.find(t => t.id === id);
      if (target?.fileKey)  deleteFile(target.fileKey);
      if (target?.coverKey) deleteFile(target.coverKey);
      const next = p.filter(t => t.id !== id);
      if (currentId === id) setCurrentId(next[0]?.id ?? null);
      return next;
    });
    setPlaylists(pl => pl.map(p => ({ ...p, trackIds: p.trackIds.filter(tid => tid !== id) })));
  }, [currentId]);

  const updateTrack = useCallback((id, patch) => {
    setTracks(p => p.map(t => t.id === id ? { ...t, ...patch } : t));
  }, []);

  const cycleRepeat = () =>
    setRepeatMode(m => m === 'none' ? 'all' : m === 'all' ? 'one' : 'none');

  // ── Playlists ──
  const createPlaylist = useCallback((name) => {
    const id = Date.now();
    setPlaylists(p => [...p, { id, name, trackIds: [] }]);
    return id;
  }, []);

  const deletePlaylist = useCallback((id) => {
    setPlaylists(p => p.filter(pl => pl.id !== id));
  }, []);

  const toggleTrackInPlaylist = useCallback((trackId, playlistId) => {
    setPlaylists(p => p.map(pl => {
      if (pl.id !== playlistId) return pl;
      const has = pl.trackIds.includes(trackId);
      return { ...pl, trackIds: has ? pl.trackIds.filter(id => id !== trackId) : [...pl.trackIds, trackId] };
    }));
  }, []);

  return {
    tracks, current, currentId, playlists,
    isPlaying, progress, duration, volume,
    isShuffled, repeatMode, audioRef,
    setVolume, togglePlay, playPause, handleNext, handlePrev,
    handleTimeUpdate, handleSeek, handleEnded, seekBy,
    loadTrack, addTrack, deleteTrack, updateTrack,
    setIsShuffled, cycleRepeat,
    createPlaylist, deletePlaylist, toggleTrackInPlaylist,
    getNextId, getPrevId,
  };
}
