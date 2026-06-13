import { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GradientCover from './GradientCover';
import { GENRE_KEYS, ACCENT_COLORS } from '../data/tracks';
import styles from './AddTrackModal.module.css';

const EMPTY = { title: '', artist: '', genre: 'other', lyrics: '', color: '#f9a8d4' };

export default function AddTrackModal({ onClose, onAdd }) {
  const { t } = useTranslation();
  const [form, setForm]                 = useState(EMPTY);
  const [coverPreview, setCoverPreview] = useState(null);
  const [coverBlob, setCoverBlob]       = useState(null);
  const [fileBlob, setFileBlob]         = useState(null);
  const [fileName, setFileName]         = useState(null);
  const [dragOver, setDragOver]         = useState(null); // 'cover' | 'audio' | 'any' | null

  const fileRef  = useRef(null);
  const coverRef = useRef(null);

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const acceptCover = (file) => {
    if (!file || !file.type.startsWith('image/')) return false;
    setCoverBlob(file);
    setCoverPreview(URL.createObjectURL(file));
    return true;
  };

  const acceptAudio = (file) => {
    if (!file || !file.type.startsWith('audio/')) return false;
    setFileBlob(file);
    setFileName(file.name);
    if (!form.title.trim()) {
      const guess = file.name.replace(/\.[^.]+$/, '');
      set('title', guess);
    }
    return true;
  };

  const handleCoverInput  = e => acceptCover(e.target.files[0]);
  const handleAudioInput  = e => acceptAudio(e.target.files[0]);

  // Generic drop zone covering whole modal: route by file type
  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(null);
    const files = Array.from(e.dataTransfer.files || []);
    for (const f of files) {
      if (f.type.startsWith('image/')) acceptCover(f);
      else if (f.type.startsWith('audio/')) acceptAudio(f);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver('any');
  };
  const handleDragLeave = () => setDragOver(null);

  const submit = () => {
    if (!form.title.trim()) return;
    onAdd({ ...form, fileBlob, coverBlob });
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div
        className={`${styles.modal} ${dragOver ? styles.dragActive : ''}`}
        onClick={e => e.stopPropagation()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <h2 className={styles.heading}>{t('addTrack')}</h2>

        {dragOver && (
          <div className={styles.dropOverlay}>{t('dropHere')}</div>
        )}

        {/* Cover picker */}
        <div className={styles.coverRow}>
          <div className={styles.coverPick} onClick={() => coverRef.current.click()}>
            {coverPreview
              ? <img src={coverPreview} alt="cover" className={styles.coverImg} />
              : <GradientCover color={form.color} title={form.title || '?'} size={80} />
            }
            <span className={styles.coverLabel}>{t('addCover')}</span>
            <input ref={coverRef} type="file" accept="image/*" hidden onChange={handleCoverInput} />
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

        {/* Lyrics */}
        <textarea
          className={styles.textarea}
          placeholder={t('lyricsPlaceholder')}
          value={form.lyrics}
          onChange={e => set('lyrics', e.target.value)}
          rows={3}
        />

        {/* Audio file */}
        <button className={styles.fileBtn} onClick={() => fileRef.current.click()}>
          <span className={styles.fileBtnText}>
            {fileName ? `🎵 ${fileName}` : t('chooseAudio')}
          </span>
          <span className={styles.fileMeta}>{fileBlob ? '✓' : '📁'}</span>
        </button>
        <input ref={fileRef} type="file" accept="audio/*" hidden onChange={handleAudioInput} />

        <p className={styles.hint}>{t('dragHint')}</p>

        <div className={styles.actions}>
          <button className={styles.cancel} onClick={onClose}>{t('cancel')}</button>
          <button className={styles.confirm} onClick={submit} disabled={!form.title.trim()}>{t('add')}</button>
        </div>
      </div>
    </div>
  );
}
