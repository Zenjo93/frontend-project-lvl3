import * as yup from 'yup';
import parseRSS from './parserRSS.js';

import watch from './watcher.js';
// import parseRSS from './parserRSS.js';
const form = document.querySelector('form');
const input = document.getElementById('url-input');

yup.setLocale({
  string: {
    url: 'processStatus.errors.invalidURL',
  },
  mixed: {
    notOneOf: 'processStatus.errors.duplicatedURL',
  },
});

const validate = (url, feedList) => {
  const validationSchema = yup.string().url().notOneOf(feedList).required();
  return validationSchema.validate(url);
};

export default () => {
  const state = {
    init: false,
    feedList: [],
    feeds: [],
    posts: [],
    form: {
      processState: 'filling', // init, filling, sent, error
      valid: true, // красная рамка
      error: null, // ключ ошибки
      value: '',
    },
  };

  const watchedState = watch(state);

  input.addEventListener('input', () => {

  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.error = null;
    watchedState.form.valid = true;
    watchedState.form.value = form.url.value;

    validate(watchedState.form.value, watchedState.feedList)
      .then((url) => parseRSS(url))
      .then((data) => {
        const [feed, posts] = data;

        feed.id = watchedState.feedList.length;
        posts.forEach((item) => item.postId = feed.id);

        watchedState.form.processState = 'sent';
        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(watchedState.form.value);
        watchedState.feeds.push(feed);
        watchedState.posts.push(posts);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
};
