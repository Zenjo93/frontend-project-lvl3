import * as yup from 'yup';
import i18next from 'i18next';
import watch from './watcher.js';
import ru from './locales/ru.js';

yup.setLocale({
  string: {
    url: 'incorrectURL',
  },
});

const schema = yup.string().url().matches(/.rss/);

const i18n = i18next.createInstance().init({
  lng: 'ru',
  debug: true,
  defaultNS: 'validationErrors',
  resources: ru,
});

const addToFeedList = (state, feed, t) => {
  if (state.feedsList.includes(feed)) {
    state.form.errorMessage = t('doubleURL');
  } else {
    state.feedsList.push(feed);
    console.log(`feedsList: ${state.feedsList.toString()}`);
  }
};

export default () => {
  const state = {
    feedsList: [],
    form: {
      valid: true,
      url: '',
      errorMessage: null,
    },
  };

  const watchedState = watch(state);

  const form = document.querySelector('form');
  const input = form.url;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    watchedState.form.url = input.value;

    i18n.then((t) => {
      schema.validate(watchedState.form.url)
        .then((url) => addToFeedList(watchedState, url, t))
        .catch((err) => watchedState.form.errorMessage = t(err.errors));
    });
  });
};
