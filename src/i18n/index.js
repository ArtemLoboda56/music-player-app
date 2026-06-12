import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // App
      appTitle: 'Vibes',
      // Sidebar
      library: 'Library',
      search: 'Search tracks...',
      allGenres: 'All Genres',
      noTracks: 'No tracks found',
      // Player
      noTrackSelected: 'Select a track',
      // Controls
      shuffle: 'Shuffle',
      previous: 'Previous',
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
      repeat: 'Repeat',
      repeatOne: 'Repeat one',
      repeatAll: 'Repeat all',
      volume: 'Volume',
      // Modal
      addTrack: 'Add Track',
      addCover: 'Add Cover',
      trackTitle: 'Track title *',
      artist: 'Artist',
      genre: 'Genre',
      chooseAudio: 'Choose audio file',
      audioSelected: '✓ Audio selected',
      cancel: 'Cancel',
      add: 'Add',
      accentColor: 'Accent color',
      // Genres
      genres: {
        pop: 'Pop',
        rock: 'Rock',
        jazz: 'Jazz',
        electronic: 'Electronic',
        classical: 'Classical',
        hiphop: 'Hip-Hop',
        rnb: 'R&B',
        lofi: 'Lo-Fi',
        ambient: 'Ambient',
        other: 'Other',
      },
      // Language toggle
      language: 'Language',
    },
  },
  uk: {
    translation: {
      appTitle: 'Vibes',
      library: 'Бібліотека',
      search: 'Пошук треків...',
      allGenres: 'Всі жанри',
      noTracks: 'Треки не знайдено',
      noTrackSelected: 'Оберіть трек',
      shuffle: 'Перемішати',
      previous: 'Попередній',
      play: 'Грати',
      pause: 'Пауза',
      next: 'Наступний',
      repeat: 'Повтор',
      repeatOne: 'Повтор одного',
      repeatAll: 'Повтор всіх',
      volume: 'Гучність',
      addTrack: 'Додати трек',
      addCover: 'Додати обкладинку',
      trackTitle: 'Назва треку *',
      artist: 'Артист',
      genre: 'Жанр',
      chooseAudio: 'Обрати аудіо файл',
      audioSelected: '✓ Аудіо обрано',
      cancel: 'Скасувати',
      add: 'Додати',
      accentColor: 'Колір акценту',
      genres: {
        pop: 'Поп',
        rock: 'Рок',
        jazz: 'Джаз',
        electronic: 'Електронна',
        classical: 'Класична',
        hiphop: 'Хіп-Хоп',
        rnb: 'R&B',
        lofi: 'Ло-Фай',
        ambient: 'Амбієнт',
        other: 'Інше',
      },
      language: 'Мова',
    },
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('vibes-lang') || 'uk',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
