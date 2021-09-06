import * as yup from 'yup';
import watch from './watcher.js';

const schema = yup.string().url().matches(/.rss/);

/* ошибки:

1. Ссылка должна быть валидным URL
2. RSS уже существует

3. Ресурс не содержит валидный RSS (по адресу его нет)
 */

const addToFeedList = (state, feed) => {
  if (state.feedsList.includes(feed)) {
    state.form.errorMessage = 'RSS уже существует';
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

    console.log(`watchedState.form.errorMessage: ${watchedState.form.errorMessage}`);
    watchedState.form.url = input.value;

    schema.validate(watchedState.form.url)
      .then((url) => addToFeedList(watchedState, url))
      .catch(() => watchedState.form.errorMessage = 'Ссылка должна быть валидным URL');
  });
};
