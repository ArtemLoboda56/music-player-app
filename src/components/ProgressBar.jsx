import { useWaveform } from '../hooks/useWaveform';
import styles from './ProgressBar.module.css';

function fmt(s) {
  if (!s || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function ProgressBar({ progress, duration, onSeek, fileUrl, color }) {
  const peaks = useWaveform(fileUrl);
  const pct = duration ? (progress / duration) * 100 : 0;

  const handleClick = (e) => {
    if (!duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const ratio = (e.clientX - rect.left) / rect.width;
    onSeek(Math.max(0, Math.min(1, ratio)) * duration);
  };

  return (
    <div className={styles.wrap}>
      <span className={styles.time}>{fmt(progress)}</span>

      {peaks ? (
        <div className={styles.waveWrap} onClick={handleClick}>
          {peaks.map((v, i) => {
            const barPct = (i / peaks.length) * 100;
            const played = barPct < pct;
            return (
              <div
                key={i}
                className={styles.waveBar}
                style={{
                  height: `${Math.max(12, v * 100)}%`,
                  background: played ? (color || 'var(--pink)') : '#f0e0ec',
                }}
              />
            );
          })}
          <input
            type="range"
            className={styles.hiddenRange}
            min={0} max={duration || 100} step={0.01}
            value={progress}
            onChange={e => onSeek(parseFloat(e.target.value))}
          />
        </div>
      ) : (
        <input
          type="range"
          className={styles.bar}
          min={0} max={duration || 100} step={0.01}
          value={progress}
          style={{ '--pct': `${pct}%` }}
          onChange={e => onSeek(parseFloat(e.target.value))}
        />
      )}

      <span className={styles.time}>{fmt(duration)}</span>
    </div>
  );
}
