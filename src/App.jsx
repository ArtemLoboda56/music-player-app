import '../src/i18n/index.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePlayer }            from './hooks/usePlayer';
import { useTheme }             from './hooks/useTheme';
import { useAudioAnalyser }     from './hooks/useAudioAnalyser';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';

import Sidebar          from './components/Sidebar';
import GradientCover     from './components/GradientCover';
import PlayerControls    from './components/PlayerControls';
import ProgressBar        from './components/ProgressBar';
import VolumeControl      from './components/VolumeControl';
import AddTrackModal       from './components/AddTrackModal';
import LanguageToggle      from './components/LanguageToggle';
import ThemeToggle         from './components/ThemeToggle';
import Visualizer           from './components/Visualizer';
import LyricsPanel           from './components/LyricsPanel';
import MiniPlayer             from './components/MiniPlayer';

import './App.css';

export default function App() {
  const { t } = useTranslation();
  const { theme, toggle: toggleTheme } = useTheme();

  const [showModal, setShowModal]       = useState(false);
  const [activePlaylistId, setActivePlaylistId] = useState(null);
  const [lyricsOpen, setLyricsOpen]     = useState(false);
  const [miniMode, setMiniMode]         = useState(false);

  const {
    tracks, current, playlists,
    isPlaying, progress, duration, volume,
    isShuffled, repeatMode,
    audioRef,
    setVolume, togglePlay, handleNext, handlePrev,
    handleTimeUpdate, handleSeek, handleEnded, seekBy,
    loadTrack, addTrack, deleteTrack,
    setIsShuffled, cycleRepeat,
    createPlaylist, deletePlaylist, toggleTrackInPlaylist,
  } = usePlayer();

  const { getFrequencyData } = useAudioAnalyser(audioRef);

  useKeyboardShortcuts({ togglePlay, seekBy, setVolume, volume, handleNext, handlePrev });

  if (!current) {
    return (
      <div className="app">
        <Sidebar
          tracks={tracks} currentId={null} onSelect={loadTrack}
          onAdd={() => setShowModal(true)} onDelete={deleteTrack}
          playlists={playlists} activePlaylistId={activePlaylistId}
          onSelectPlaylist={setActivePlaylistId}
          onCreatePlaylist={createPlaylist} onDeletePlaylist={deletePlaylist}
          onToggleTrackInPlaylist={toggleTrackInPlaylist}
        />
        <main className="player">
          <p>{t('noTrackSelected')}</p>
        </main>
        {showModal && <AddTrackModal onClose={() => setShowModal(false)} onAdd={addTrack} />}
      </div>
    );
  }

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src={current.file || undefined}
        crossOrigin="anonymous"
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleTimeUpdate}
        onEnded={handleEnded}
      />

      <Sidebar
        tracks={tracks}
        currentId={current.id}
        onSelect={loadTrack}
        onAdd={() => setShowModal(true)}
        onDelete={deleteTrack}
        playlists={playlists}
        activePlaylistId={activePlaylistId}
        onSelectPlaylist={setActivePlaylistId}
        onCreatePlaylist={createPlaylist}
        onDeletePlaylist={deletePlaylist}
        onToggleTrackInPlaylist={toggleTrackInPlaylist}
      />

      <main className="player">
        {/* Top bar */}
        <div className="topBar">
          <h1 className="vibesTitle">{t('appTitle')}</h1>
          <div className="topBarActions">
            <button className="miniBtn" onClick={() => setMiniMode(m => !m)} title="Mini player">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2"/>
                <rect x="13" y="13" width="6" height="6" rx="1"/>
              </svg>
            </button>
            <ThemeToggle theme={theme} onToggle={toggleTheme} />
            <LanguageToggle />
          </div>
        </div>

        {/* Spinning cover */}
        <div className={`coverWrap ${isPlaying ? 'spinning' : ''}`}>
          {current.cover
            ? <img src={current.cover} alt={current.title} className="coverImg" />
            : <GradientCover color={current.color} title={current.title} size={220} />
          }
          <div className="coverGlow" style={{ background: current.color }} />
        </div>

        {/* Track info */}
        <div className="nowPlaying">
          <p className="npTitle">{current.title}</p>
          <p className="npArtist">{current.artist}</p>
        </div>

        {/* Equalizer visualizer */}
        <Visualizer getFrequencyData={getFrequencyData} isPlaying={isPlaying} color={current.color} />

        <ProgressBar
          progress={progress}
          duration={duration}
          onSeek={handleSeek}
          fileUrl={current.file}
          color={current.color}
        />

        <PlayerControls
          isPlaying={isPlaying}
          isShuffled={isShuffled}
          repeatMode={repeatMode}
          onPlay={togglePlay}
          onPrev={handlePrev}
          onNext={handleNext}
          onShuffle={() => setIsShuffled(s => !s)}
          onRepeat={cycleRepeat}
        />

        <VolumeControl volume={volume} onChange={setVolume} />

        <LyricsPanel lyrics={current.lyrics} open={lyricsOpen} onToggle={() => setLyricsOpen(o => !o)} />
      </main>

      {showModal && (
        <AddTrackModal
          onClose={() => setShowModal(false)}
          onAdd={addTrack}
        />
      )}

      {miniMode && (
        <MiniPlayer
          track={current}
          isPlaying={isPlaying}
          progress={progress}
          duration={duration}
          onToggle={togglePlay}
          onNext={handleNext}
          onExpand={() => setMiniMode(false)}
        />
      )}
    </div>
  );
}
