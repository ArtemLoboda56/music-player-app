import '../src/i18n/index.js';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

import { usePlayer }       from './hooks/usePlayer';
import Sidebar             from './components/Sidebar';
import GradientCover       from './components/GradientCover';
import PlayerControls      from './components/PlayerControls';
import ProgressBar         from './components/ProgressBar';
import VolumeControl       from './components/VolumeControl';
import AddTrackModal       from './components/AddTrackModal';
import LanguageToggle      from './components/LanguageToggle';

import './App.css';

export default function App() {
  const { t } = useTranslation();
  const [showModal, setShowModal] = useState(false);

  const {
    tracks, current,
    isPlaying, progress, duration, volume,
    isShuffled, repeatMode,
    audioRef,
    setVolume, togglePlay, handleNext, handlePrev,
    handleTimeUpdate, handleSeek, handleEnded,
    loadTrack, addTrack, deleteTrack,
    setIsShuffled, cycleRepeat,
  } = usePlayer();

  return (
    <div className="app">
      <audio
        ref={audioRef}
        src={current.file || undefined}
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
      />

      <main className="player">
        {/* Top bar */}
        <div className="topBar">
          <h1 className="vibesTitle">{t('appTitle')}</h1>
          <LanguageToggle />
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

        <ProgressBar progress={progress} duration={duration} onSeek={handleSeek} />

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
      </main>

      {showModal && (
        <AddTrackModal
          onClose={() => setShowModal(false)}
          onAdd={addTrack}
        />
      )}
    </div>
  );
}
