import { useState, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import GradientCover from './GradientCover';
import { GENRE_KEYS, SORT_KEYS } from '../data/tracks';
import styles from './Sidebar.module.css';

export default function Sidebar({
  tracks, currentId, onSelect, onAdd, onDelete,
  playlists, activePlaylistId, onSelectPlaylist,
  onCreatePlaylist, onDeletePlaylist, onToggleTrackInPlaylist,
}) {
  const { t } = useTranslation();
  const [query, setQuery]             = useState('');
  const [activeGenre, setActiveGenre] = useState('all');
  const [sortKey, setSortKey]         = useState('default');
  const [showPlaylistInput, setShowPlaylistInput] = useState(false);
  const [newPlaylistName, setNewPlaylistName]      = useState('');
  const [openMenuFor, setOpenMenuFor] = useState(null);

  const baseList = useMemo(() => {
    if (!activePlaylistId) return tracks;
    const pl = playlists.find(p => p.id === activePlaylistId);
    if (!pl) return tracks;
    return tracks.filter(t => pl.trackIds.includes(t.id));
  }, [tracks, playlists, activePlaylistId]);

  const filtered = useMemo(() => {
    let list = baseList.filter(tr => {
      const matchQ = !query.trim() ||
        tr.title.toLowerCase().includes(query.toLowerCase()) ||
        tr.artist.toLowerCase().includes(query.toLowerCase());
      const matchG = activeGenre === 'all' || tr.genre === activeGenre;
      return matchQ && matchG;
    });

    if (sortKey === 'title')  list = [...list].sort((a, b) => a.title.localeCompare(b.title));
    if (sortKey === 'artist') list = [...list].sort((a, b) => a.artist.localeCompare(b.artist));
    if (sortKey === 'genre')  list = [...list].sort((a, b) => a.genre.localeCompare(b.genre));
    if (sortKey === 'default') list = [...list].sort((a, b) => (a.addedAt || 0) - (b.addedAt || 0));

    return list;
  }, [baseList, query, activeGenre, sortKey]);

  const presentGenres = useMemo(() =>
    GENRE_KEYS.filter(g => baseList.some(tr => tr.genre === g)),
    [baseList]
  );

  const submitPlaylist = () => {
    if (!newPlaylistName.trim()) return;
    onCreatePlaylist(newPlaylistName.trim());
    setNewPlaylistName('');
    setShowPlaylistInput(false);
  };

  return (
    <aside className={styles.sidebar}>
      {/* Header */}
      <div className={styles.header}>
        <span className={styles.title}>{t('library')}</span>
        <button className={styles.addBtn} onClick={onAdd} title={t('addTrack')}>+</button>
      </div>

      {/* Playlists row */}
      <div className={styles.playlistRow}>
        <button
          className={`${styles.plChip} ${!activePlaylistId ? styles.plChipActive : ''}`}
          onClick={() => onSelectPlaylist(null)}
        >
          {t('allTracks')}
        </button>
        {playlists.map(pl => (
          <span key={pl.id} className={styles.plWrap}>
            <button
              className={`${styles.plChip} ${activePlaylistId === pl.id ? styles.plChipActive : ''}`}
              onClick={() => onSelectPlaylist(pl.id)}
            >
              {pl.name}
            </button>
            <button className={styles.plDelete} onClick={() => onDeletePlaylist(pl.id)}>×</button>
          </span>
        ))}
        {showPlaylistInput ? (
          <input
            className={styles.plInput}
            autoFocus
            placeholder={t('playlistName')}
            value={newPlaylistName}
            onChange={e => setNewPlaylistName(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && submitPlaylist()}
            onBlur={submitPlaylist}
          />
        ) : (
          <button className={styles.plAdd} onClick={() => setShowPlaylistInput(true)} title={t('newPlaylist')}>
            + {t('playlist')}
          </button>
        )}
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

      {/* Genre chips + sort */}
      <div className={styles.filterRow}>
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

        <select
          className={styles.sortSelect}
          value={sortKey}
          onChange={e => setSortKey(e.target.value)}
          title={t('sortBy')}
        >
          {SORT_KEYS.map(k => (
            <option key={k} value={k}>{t(`sort.${k}`)}</option>
          ))}
        </select>
      </div>

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
                <span className={styles.name}>
                  {track.title}
                  {track.lyrics && <span className={styles.lyricsDot} title={t('hasLyrics')}>♪</span>}
                </span>
                <span className={styles.artist}>{track.artist}</span>
              </div>

              <div className={styles.itemActions}>
                <button
                  className={styles.menuBtn}
                  onClick={e => { e.stopPropagation(); setOpenMenuFor(openMenuFor === track.id ? null : track.id); }}
                  title={t('addToPlaylist')}
                >⋮</button>
                <button
                  className={styles.deleteBtn}
                  onClick={e => { e.stopPropagation(); onDelete(track.id); }}
                >×</button>
              </div>

              {openMenuFor === track.id && (
                <div className={styles.menu} onClick={e => e.stopPropagation()}>
                  <div className={styles.menuLabel}>{t('addToPlaylist')}</div>
                  {playlists.length === 0 && <div className={styles.menuEmpty}>{t('noPlaylists')}</div>}
                  {playlists.map(pl => (
                    <label key={pl.id} className={styles.menuItem}>
                      <input
                        type="checkbox"
                        checked={pl.trackIds.includes(track.id)}
                        onChange={() => onToggleTrackInPlaylist(track.id, pl.id)}
                      />
                      {pl.name}
                    </label>
                  ))}
                </div>
              )}
            </li>
          ))
        )}
      </ul>
    </aside>
  );
}
