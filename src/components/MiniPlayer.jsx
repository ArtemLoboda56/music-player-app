import GradientCover from './GradientCover';
import styles from './MiniPlayer.module.css';

const PlayIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>;
const PauseIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z"/></svg>;
const NextIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 18l8.5-6L6 6v12zm2-8.14 5.5 3.64L8 15.14V9.86zM16 6h2v12h-2z"/></svg>;
const ExpandIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 3 21 3 21 9"/><polyline points="9 21 3 21 3 15"/>
    <line x1="21" y1="3" x2="14" y2="10"/><line x1="3" y1="21" x2="10" y2="14"/>
  </svg>
);

export default function MiniPlayer({ track, isPlaying, progress, duration, onToggle, onNext, onExpand }) {
  if (!track) return null;
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className={styles.mini}>
      <div className={styles.thumb}>
        {track.cover
          ? <img src={track.cover} alt={track.title} />
          : <GradientCover color={track.color} title={track.title} size={40} />
        }
      </div>
      <div className={styles.info}>
        <span className={styles.title}>{track.title}</span>
        <span className={styles.artist}>{track.artist}</span>
        <div className={styles.progressTrack}>
          <div className={styles.progressFill} style={{ width: `${pct}%`, background: track.color }} />
        </div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btn} onClick={onToggle}>{isPlaying ? <PauseIcon/> : <PlayIcon/>}</button>
        <button className={styles.btn} onClick={onNext}><NextIcon/></button>
        <button className={styles.btn} onClick={onExpand}><ExpandIcon/></button>
      </div>
    </div>
  );
}
