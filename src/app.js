import * as yup from 'yup';
import { isEmpty } from 'lodash';
import watch from './watcher.js';

// const schema = yup.string().url().matches(/.rss/);
const schema = yup.string().url().matches(/.rss/);

/* ошибки:

1. Ссылка должна быть валидным URL
2. RSS уже существует

3. Ресурс не содержит валидный RSS (по адресу его нет)
 */

const validate = (url, errorMessage, feedsList) => {
  schema.validate(url)
    .then((result) => {
      if (feedsList.includes(result)) {
        errorMessage.push('RSS уже существует');
      }
    }).catch(() => errorMessage.push('Ссылка должна быть валидным URL'));
};

export default () => {
  const state = {
    feedsList: [],
    form: {
      valid: true,
      url: '',
      errorMessage: [],
    },
  };

  const watchedState = watch(state);

  const form = document.querySelector('form');
  const input = form.url;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    console.log(`input.value: ${input.value}`);
    // watchedState.form.url = input.value
    watchedState.form.url = input.value;

    // валидируем на ошибки, добавляем в errors ошибку если есть
    validate(watchedState.form.url, watchedState.form.errorMessage, watchedState.feedsList);

    // форма валидная если нет ошибок
    watchedState.form.valid = isEmpty(watchedState.form.errorMessage);

    // Если валидация пройдена, добавил фид и очистил все
    setTimeout(() => watchedState.feedsList.push(input.value), 2000);
  });
};
