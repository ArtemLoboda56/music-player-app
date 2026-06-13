import { useTranslation } from 'react-i18next';
import styles from './LyricsPanel.module.css';

export default function LyricsPanel({ lyrics, open, onToggle }) {
  const { t } = useTranslation();
  if (!lyrics) return null;

  return (
    <div className={styles.wrap}>
      <button className={styles.toggle} onClick={onToggle}>
        {open ? t('hideLyrics') : t('showLyrics')}
      </button>
      {open && <div className={styles.lyrics}>{lyrics}</div>}
    </div>
  );
}
