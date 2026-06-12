import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GradientCover from './GradientCover';
import { GENRE_KEYS } from '../data/tracks';
import styles from './Sidebar.module.css';

export default function Sidebar({ tracks, currentId, onSelect, onAdd, onDelete }) {
  const { t } = useTranslation();
  const [query, setQuery]         = useState('');
  const [activeGenre, setActiveGenre] = useState('all');

  const filtered = useMemo(() => {
    return tracks.filter(tr => {
      const matchQ = !query.trim() ||
        tr.title.toLowerCase().includes(query.toLowerCase()) ||
        tr.artist.toLowerCase().includes(query.toLowerCase());
      const matchG = activeGenre === 'all' || tr.genre === activeGenre;
      return matchQ && matchG;
    });
  }, [tracks, query, activeGenre]);

  // Only show genres that exist in current library
  const presentGenres = useMemo(() =>
    GENRE_KEYS.filter(g => tracks.some(tr => tr.genre === g)),
    [tracks]
  );

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>{t('library')}</span>
        <button className={styles.addBtn} onClick={onAdd} title={t('addTrack')}>+</button>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <svg className={styles.searchIcon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
        </svg>
        <input
          className={styles.searchInput}
          type="text"
          placeholder={t('search')}
          value={query}
          onChange={e => setQuery(e.target.value)}
        />
        {query && (
          <button className={styles.clearBtn} onClick={() => setQuery('')}>×</button>
        )}
      </div>

      {/* Genre chips */}
      {presentGenres.length > 0 && (
        <div className={styles.genreRow}>
          <button
            className={`${styles.chip} ${activeGenre === 'all' ? styles.chipActive : ''}`}
            onClick={() => setActiveGenre('all')}
          >
            {t('allGenres')}
          </button>
          {presentGenres.map(g => (
            <button
              key={g}
              className={`${styles.chip} ${activeGenre === g ? styles.chipActive : ''}`}
              onClick={() => setActiveGenre(g)}
            >
              {t(`genres.${g}`)}
            </button>
          ))}
        </div>
      )}

      {/* Track list */}
      <ul className={styles.list}>
        {filtered.length === 0 ? (
          <li className={styles.empty}>{t('noTracks')}</li>
        ) : (
          filtered.map(track => (
            <li
              key={track.id}
              className={`${styles.item} ${track.id === currentId ? styles.active : ''}`}
              onClick={() => onSelect(track.id)}
            >
              <div className={styles.thumb}>
                {track.cover
                  ? <img src={track.cover} alt={track.title} />
                  : <GradientCover color={track.color} title={track.title} size={44} />
                }
              </div>
              <div className={styles.info}>
                <span className={styles.name}>{track.title}</span>
                <span className={styles.artist}>{track.artist}</span>
              </div>
              <button
                className={styles.deleteBtn}
                onClick={e => { e.stopPropagation(); onDelete(track.id); }}
              >×</button>
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
