import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GradientCover from './GradientCover';
import { GENRE_KEYS, ACCENT_COLORS } from '../data/tracks';
import styles from './AddTrackModal.module.css';

const EMPTY = { title: '', artist: '', genre: 'other', cover: null, file: null, color: '#f9a8d4' };

export default function AddTrackModal({ onClose, onAdd }) {
  const { t } = useTranslation();
  const [form, setForm]             = useState(EMPTY);
  const [coverPreview, setCoverPreview] = useState(null);
  const fileRef  = useRef(null);
  const coverRef = useRef(null);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleCover = e => {
    const file = e.target.files[0];
    if (!file) return;
    const url = URL.createObjectURL(file);
    setCoverPreview(url);
    set('cover', url);
  };

  const handleAudio = e => {
    const file = e.target.files[0];
    if (!file) return;
    set('file', URL.createObjectURL(file));
  };

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd(form);
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <h2 className={styles.heading}>{t('addTrack')}</h2>

        {/* Cover picker */}
        <div className={styles.coverRow}>
          <div className={styles.coverPick} onClick={() => coverRef.current.click()}>
            {coverPreview
              ? <img src={coverPreview} alt="cover" className={styles.coverImg} />
              : <GradientCover color={form.color} title={form.title || '?'} size={80} />
            }
            <span className={styles.coverLabel}>{t('addCover')}</span>
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCover} />
          </div>

          <div className={styles.colorGrid}>
            {ACCENT_COLORS.map(c => (
              <button
                key={c}
                className={`${styles.dot} ${form.color === c ? styles.dotActive : ''}`}
                style={{ background: c }}
                onClick={() => set('color', c)}
              />
            ))}
          </div>
        </div>

        {/* Inputs */}
        <input className={styles.input} placeholder={t('trackTitle')} value={form.title} onChange={e => set('title', e.target.value)} />
        <input className={styles.input} placeholder={t('artist')}     value={form.artist} onChange={e => set('artist', e.target.value)} />

        {/* Genre select */}
        <select className={styles.select} value={form.genre} onChange={e => set('genre', e.target.value)}>
          {GENRE_KEYS.map(g => (
            <option key={g} value={g}>{t(`genres.${g}`)}</option>
          ))}
        </select>

        {/* Audio file */}
        <button className={styles.fileBtn} onClick={() => fileRef.current.click()}>
          {form.file ? t('audioSelected') : t('chooseAudio')}
          <span className={styles.fileMeta}>{form.file ? '🎵' : '📁'}</span>
        </button>
        <input ref={fileRef} type="file" accept="audio/*" hidden onChange={handleAudio} />

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>{t('cancel')}</button>
          <button className={styles.confirm} onClick={submit} disabled={!form.title.trim()}>{t('add')}</button>
        </div>
      </div>
    </div>
  );
}
