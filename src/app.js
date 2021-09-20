import * as yup from 'yup';
import _ from 'lodash';
import parseRSS from './parserRSS.js';
import watch from './watcher.js';

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

const addNewPosts = (feeds, posts) => feeds.forEach((feed) => {
  const { url, id } = feed;
  parseRSS(url).then((data) => {
    const [, newPosts] = data;
    const oldPosts = posts.flatMap((post) => post).filter((post) => post.postId === id);

    const oldPostsNormalize = oldPosts.map((post) => ({
      title: post.title,
      link: post.link,
      description: post.description,
      uiStateRead: post.uiStateRead,
    }));

    const diff = _.differenceBy(oldPostsNormalize, newPosts, 'title');
    const diffItems = diff.map((item) => ({ ...item, id }));

    console.log(...diffItems);

    if (diffItems.length !== 0) {
      posts.push(diffItems);
    }
  });
});

export default () => {
  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');

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
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.error = null;
    watchedState.form.valid = true;
    watchedState.form.value = input.value;
    // console.log(e.target.value);

    validate(watchedState.form.value, watchedState.feedList)
      .then((url) => {
        parseRSS(url);
        watchedState.form.processState = 'sending';
      })
      .then((data) => {
        const [feed, posts] = data;

        feed.id = watchedState.feedList.length;
        feed.url = watchedState.form.value;
        const postWithId = posts.map((item) => ({ ...item, postId: feed.id }));

        watchedState.form.processState = 'sent';
        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(watchedState.form.value);
        watchedState.feeds.push(feed);
        watchedState.posts.push(postWithId);

        setTimeout(function check() {
          addNewPosts(watchedState.feeds, watchedState.posts);
          setTimeout(check, 5000);
        }, 5000);
      }).catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
};
