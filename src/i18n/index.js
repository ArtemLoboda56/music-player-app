import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      appTitle: 'Vibes',
      library: 'Library',
      search: 'Search tracks...',
      allGenres: 'All Genres',
      noTracks: 'No tracks found',
      noTrackSelected: 'Select a track',

      shuffle: 'Shuffle',
      previous: 'Previous',
      play: 'Play',
      pause: 'Pause',
      next: 'Next',
      repeat: 'Repeat',
      repeatOne: 'Repeat one',
      repeatAll: 'Repeat all',
      volume: 'Volume',

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
      lyricsPlaceholder: 'Lyrics / description (optional)',
      dragHint: 'You can also drag & drop audio or image files here',
      dropHere: 'Drop audio or image here',

      genres: {
        pop: 'Pop', rock: 'Rock', jazz: 'Jazz', electronic: 'Electronic',
        classical: 'Classical', hiphop: 'Hip-Hop', rnb: 'R&B',
        lofi: 'Lo-Fi', ambient: 'Ambient', other: 'Other',
      },

      sort: {
        default: 'Date added', title: 'Title', artist: 'Artist', genre: 'Genre',
      },
      sortBy: 'Sort by',

      allTracks: 'All Tracks',
      playlist: 'Playlist',
      playlists: 'Playlists',
      newPlaylist: 'New playlist',
      playlistName: 'Playlist name',
      addToPlaylist: 'Add to playlist',
      noPlaylists: 'No playlists yet',

      showLyrics: 'Show lyrics',
      hideLyrics: 'Hide lyrics',
      hasLyrics: 'Has lyrics',

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
      lyricsPlaceholder: 'Текст пісні / опис (необов’язково)',
      dragHint: 'Також можна перетягнути аудіо чи зображення сюди',
      dropHere: 'Кидай аудіо чи зображення тут',

      genres: {
        pop: 'Поп', rock: 'Рок', jazz: 'Джаз', electronic: 'Електронна',
        classical: 'Класична', hiphop: 'Хіп-Хоп', rnb: 'R&B',
        lofi: 'Ло-Фай', ambient: 'Амбієнт', other: 'Інше',
      },

      sort: {
        default: 'Дата додавання', title: 'Назва', artist: 'Артист', genre: 'Жанр',
      },
      sortBy: 'Сортування',

      allTracks: 'Всі треки',
      playlist: 'Плейлист',
      playlists: 'Плейлисти',
      newPlaylist: 'Новий плейлист',
      playlistName: 'Назва плейлиста',
      addToPlaylist: 'Додати в плейлист',
      noPlaylists: 'Поки немає плейлистів',

      showLyrics: 'Показати текст',
      hideLyrics: 'Сховати текст',
      hasLyrics: 'Є текст',

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
