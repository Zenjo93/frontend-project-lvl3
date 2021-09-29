import i18next from 'i18next';
import ru from './locales/ru';
import app from './app.js';
import watch from './watcher.js';

export default () => {
  const state = {
    init: false,
    feedList: [],
    feeds: [],
    posts: [],
    form: {
      processState: 'filling',
      valid: true,
      error: null,
    },
  };

  i18next.createInstance().init({
    lng: 'ru',
    debug: true,
    resources: ru,
  }).then((t) => {
    const watchedState = watch(state, t);
    app(watchedState);
  });
};
