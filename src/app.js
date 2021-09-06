import * as yup from 'yup';
import { isEmpty } from 'lodash';
import watch from './watcher.js';

const schema = yup.string().url().matches(/.rss/);

/* ошибки:

1. Ссылка должна быть валидным URL
2. RSS уже существует

3. Ресурс не содержит валидный RSS (по адресу его нет)
 */

const validate = (url) => schema.validate(url);

const addToFeedList = (state, feed) => {
  if (state.feedsList.includes(feed)) {
    state.form.errorMessage = 'RSS уже существует';
  } else {
    state.feedsList.push(feed);
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
    console.log(`watchedState.form.url ${watchedState.form.url}`);

    schema.validate(watchedState.form.url)
      .catch(() => watchedState.form.errorMessage = 'Ссылка должна быть валидным URL')
      .then((result) => addToFeedList(watchedState, result));

    // форма валидная если нет ошибок
  });
};
