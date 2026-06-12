import { useTranslation } from 'react-i18next';
import styles from './LanguageToggle.module.css';

export default function LanguageToggle() {
  const { i18n } = useTranslation();
  const current = i18n.language;

  const toggle = () => {
    const next = current === 'uk' ? 'en' : 'uk';
    i18n.changeLanguage(next);
    localStorage.setItem('vibes-lang', next);
  };

  return (
    <button className={styles.btn} onClick={toggle} title="Change language">
      <span className={`${styles.option} ${current === 'uk' ? styles.active : ''}`}>UA</span>
      <span className={styles.sep}>/</span>
      <span className={`${styles.option} ${current === 'en' ? styles.active : ''}`}>EN</span>
    </button>
  );
}
