import styles from './ProgressBar.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function ProgressBar({ progress, duration, onSeek }) {
  const pct = duration ? (progress / duration) * 100 : 0;

  return (
    <div className={styles.wrap}>
      <span className={styles.time}>{fmt(progress)}</span>
      <input
        type="range"
        className={styles.bar}
        min={0}
        max={duration || 100}
        step={0.01}
        value={progress}
        style={{ '--pct': `${pct}%` }}
        onChange={e => onSeek(parseFloat(e.target.value))}
      />
      <span className={styles.time}>{fmt(duration)}</span>
    </div>
  );
}
