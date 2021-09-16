import * as yup from 'yup';
import _ from 'lodash';
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

const addNewPosts = (feeds, posts) => feeds.forEach((feed) => {
  console.log('ВЫЗОВ!');
  const { url, id } = feed;
  parseRSS(url).then((data) => {
    const [, newPosts] = data;
    const oldPosts = posts.flatMap((post) => post).filter((post) => post.postId === id);

    const oldPostsNormalize = oldPosts.map((post) => ({
      title: post.title,
      link: post.link,
    }));

    const diff = _.differenceBy(oldPostsNormalize, newPosts, 'title');

    if (diff.length !== 0) {
      posts.push(diff);
    }
  });
});

// http://lorem-rss.herokuapp.com/feed?unit=second

// let timerId = setTimeout(function request() {
// ...отправить запрос...
//
//   if (ошибка запроса из-за перегрузки сервера) {
//     // увеличить интервал для следующего запроса
//     delay *= 2;
//   }
//
//   timerId = setTimeout(request, delay);
//
// }, delay);

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
        feed.url = watchedState.form.value;
        posts.forEach((item) => item.postId = feed.id);

        watchedState.form.processState = 'sent';
        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(watchedState.form.value);
        watchedState.feeds.push(feed);
        watchedState.posts.push(posts);

        setTimeout(function check() {
          addNewPosts(watchedState.feeds, watchedState.posts);
          setTimeout(check, 5000);
        }, 5000);
      }).catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });

    // if (watchedState.init) {
    //   checkFeedUpdate(watchedState.feeds, watchedState.posts);
    // }
  });
};

// feedList - идем по списку урлов, парсим данные, берем только посты
// сравнить новые список постов со старым по тайтлу
// если тайтл отличается -> новый пост, добавляем в список постов, присваиваем id фида,
//

// const feed: {
//   title:,
//   description:,
//   id:,
// }
//
// const posts = [
//   {
//     title:,
//     link:,
//     postid:,
//   }
// ]
