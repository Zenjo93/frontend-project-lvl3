import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parse from './parserRSS.js';

const validate = (url, { feedList }) => {
  const validationSchema = yup.string().url().notOneOf(feedList).required();
  return validationSchema.validate(url);
};

const buildProxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;

const addNewPosts = ({ feeds, posts }) => {
  const promises = feeds.map((feed) => {
    const { url, id } = feed;
    const proxyUrl = buildProxyUrl(url);
    return axios.get(proxyUrl)
      .then((xml) => {
        const { parsedPosts: newPosts } = parse(xml);
        const newPostTitles = newPosts.map((post) => post.title);
        const olsPostTitles = posts.filter((post) => post.postId === id).map((post) => post.title);

        const diffTitles = _.difference(newPostTitles, olsPostTitles);

        const diffPosts = newPosts
          .filter((post) => _.includes(diffTitles, post.title))
          .map((post) => ({ ...post, postId: id }));

        if (diffPosts.length !== 0) {
          posts.unshift(...diffPosts);
        }
      });
  });
  return Promise.all(promises);
};

const getErrorMessage = (error) => {
  if (error.isAxiosError) {
    return 'processStatus.errors.networkError';
  }
  if (error.isParsingError) {
    return 'processStatus.errors.invalidRSS';
  }
  return error.message;
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
        return axios.get(proxyUrl);
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

        setTimeout(function check() {
          addNewPosts(watchedState)
            .finally(() => setTimeout(check, 5000));
        }, 5000);
      })
      .catch((error) => {
        watchedState.form.valid = false;
        watchedState.form.error = getErrorMessage(error);
      });
  });
};
