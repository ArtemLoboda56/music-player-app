import { useTranslation } from 'react-i18next';
import styles from './PlayerControls.module.css';

/* ── SVG icons ── */
const ShuffleIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 3 21 3 21 8"/>
    <line x1="4" y1="20" x2="21" y2="3"/>
    <polyline points="21 16 21 21 16 21"/>
    <line x1="15" y1="15" x2="21" y2="21"/>
    <line x1="4" y1="4" x2="9" y2="9"/>
  </svg>
);

const PrevIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 6h2v12H6zm3.5 6 8.5 6V6z"/>
  </svg>
);

const NextIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M6 18l8.5-6L6 6v12zm2-8.14 5.5 3.64L8 15.14V9.86zM16 6h2v12h-2z"/>
  </svg>
);

const PlayIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
);

const PauseIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>
);

const RepeatIcon = ({ mode }) => {
  if (mode === 'one') return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
      <text x="10" y="14" fontSize="7" fill="currentColor" stroke="none">1</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="17 1 21 5 17 9"/>
      <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
      <polyline points="7 23 3 19 7 15"/>
      <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
    </svg>
  );
};

export default function PlayerControls({
  isPlaying, isShuffled, repeatMode,
  onPlay, onPrev, onNext,
  onShuffle, onRepeat,
}) {
  const { t } = useTranslation();

  return (
    <div className={styles.controls}>
      <button
        className={`${styles.ctrl} ${isShuffled ? styles.active : ''}`}
        onClick={onShuffle}
        title={t('shuffle')}
      >
        <ShuffleIcon />
      </button>

      <button className={`${styles.ctrl} ${styles.nav}`} onClick={onPrev} title={t('previous')}>
        <PrevIcon />
      </button>

      <button className={styles.playBtn} onClick={onPlay} title={isPlaying ? t('pause') : t('play')}>
        {isPlaying ? <PauseIcon /> : <PlayIcon />}
      </button>

      <button className={`${styles.ctrl} ${styles.nav}`} onClick={onNext} title={t('next')}>
        <NextIcon />
      </button>

      <button
        className={`${styles.ctrl} ${repeatMode !== 'none' ? styles.active : ''}`}
        onClick={onRepeat}
        title={repeatMode === 'one' ? t('repeatOne') : repeatMode === 'all' ? t('repeatAll') : t('repeat')}
      >
        <RepeatIcon mode={repeatMode} />
      </button>
    </div>
  );
}
