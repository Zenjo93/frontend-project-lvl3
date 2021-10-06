import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parse from './parserRSS.js';

const validate = (url, { feedList }) => {
  const validationSchema = yup.string().url().notOneOf(feedList).required();
  return validationSchema.validate(url);
};

const buildProxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;

// TODO: излишняя логика. От вложенности избавляемся, нормализация не нужна. Можно сравнить по title
// TODO: попробовать через new Promise(resolve, reject)

const addNewPosts = ({ feeds, posts }) => {
  feeds.forEach((feed) => {
    const { url, id } = feed;
    const proxyUrl = buildProxyUrl(url);
    axios.get(proxyUrl)
      .then((xml) => {
        const { parsedPosts: newPosts } = parse(xml);

        const oldPosts = posts.flatMap((post) => post).filter((post) => post.postId === id);
        // const oldPostsTitles = posts.flatMap((post) => post).map((post) => post.title);

        // console.log(oldPosts);
        // console.log(oldPostsTitles);

        const oldPostsNormalize = oldPosts.map((post) => ({
          title: post.title,
          link: post.link,
          description: post.description,
          uiStateRead: post.uiStateRead,
        }));

        const diff = _.differenceBy(oldPostsNormalize, newPosts, 'title');
        const diffItems = diff.map((item) => ({ ...item, id }));

        if (diffItems.length !== 0) {
          posts.push(diffItems);
        }
      });
  });

  return Promise.resolve();
};

export default (state) => {
  const watchedState = state;
  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');

  yup.setLocale({
    string: {
      url: 'processStatus.errors.invalidURL',
    },
    mixed: {
      notOneOf: 'processStatus.errors.duplicatedURL',
    },
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const { value: inputValue } = input;
    watchedState.form = { ...watchedState.form, valid: true, error: null };

    validate(inputValue, watchedState)
      .then((url) => {
        watchedState.form.processState = 'sending';

        const proxyUrl = buildProxyUrl(url);

        return axios.get(proxyUrl)
        // TODO: axios возвращает в ошибке флаг isAxiosError
          .catch(() => { throw new Error('processStatus.errors.networkError'); });
      })
      .then((xml) => {
        watchedState.form.processState = 'sent';

        const { feed, parsedPosts } = parse(xml);
        feed.id = _.uniqueId();
        feed.url = inputValue;
        const posts = parsedPosts.map((item) => ({ ...item, postId: feed.id }));

        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(inputValue);
        watchedState.feeds.unshift(feed);
        watchedState.posts.unshift(...posts);

        // setTimeout(function check() {
        //   addNewPosts(watchedState)
        //     .finally(() => setTimeout(check, 5000));
        // }, 5000);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
};
