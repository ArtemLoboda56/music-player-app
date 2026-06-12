import { useTranslation } from 'react-i18next';
import styles from './VolumeControl.module.css';

const VolumeIcon = ({ level }) => {
  if (level === 0) return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25A6.97 6.97 0 0 1 14 18.98v2.06A9 9 0 0 0 17.54 19l2.73 2.73L21.46 20.27 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
    </svg>
  );
  if (level < 0.5) return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.5 12A4.5 4.5 0 0 0 16 7.97v8.05A4.5 4.5 0 0 0 18.5 12zM5 9v6h4l5 5V4L9 9H5z"/>
    </svg>
  );
  return (
    <svg viewBox="0 0 24 24" fill="currentColor">
      <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05A4.5 4.5 0 0 0 16.5 12zM14 3.23v2.06A6.99 6.99 0 0 1 19 12c0 2.89-1.76 5.38-4.32 6.41v2.07A9 9 0 0 0 21 12 9 9 0 0 0 14 3.23z"/>
    </svg>
  );
};

export default function VolumeControl({ volume, onChange }) {
  const { t } = useTranslation();
  const pct = volume * 100;

  return (
    <div className={styles.wrap} title={t('volume')}>
      <VolumeIcon level={volume} />
      <input
        type="range"
        className={styles.bar}
        min={0} max={1} step={0.01}
        value={volume}
        style={{ '--pct': `${pct}%` }}
        onChange={e => onChange(parseFloat(e.target.value))}
      />
      <span className={styles.pct}>{Math.round(pct)}%</span>
    </div>
  );
}
