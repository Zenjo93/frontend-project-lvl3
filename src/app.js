import * as yup from 'yup';
import _ from 'lodash';
import axios from 'axios';
import parse from './parserRSS.js';

const validate = (url, feedList) => {
  const validationSchema = yup.string().url().notOneOf(feedList).required();
  return validationSchema.validate(url);
};

const buildProxyUrl = (url) => `https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`;

const addNewPosts = ({ feeds, posts }) => {
  feeds.forEach((feed) => {
    const { url, id } = feed;
    const proxyUrl = buildProxyUrl(url);
    axios.get(proxyUrl)
      .then((xml) => {
        const { posts: newPosts } = parse(xml);

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

// TODO: Пока не забыл, ты добавляешь все новые посты и фиды в конец, но логично добавлять в начало

export default (state) => {
  yup.setLocale({
    string: {
      url: 'processStatus.errors.invalidURL',
    },
    mixed: {
      notOneOf: 'processStatus.errors.duplicatedURL',
    },
  });

  const watchedState = state;
  const form = document.querySelector('form');
  const input = document.querySelector('#url-input');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const { value } = input;

    watchedState.form = {
      ...watchedState.form,
      valid: true,
      error: null,
    };

    validate(value, watchedState.feedList)
      .then((url) => {
        watchedState.form.processState = 'sending';
        const proxyUrl = buildProxyUrl(url);
        return axios.get(proxyUrl)
          .catch(() => { throw new Error('processStatus.errors.networkError'); });
      })
      .then((xml) => {
        watchedState.form.processState = 'sent';

        const { feed, posts } = parse(xml);

        feed.id = _.uniqueId();
        feed.url = value;
        const postsWithId = posts.map((item) => ({ ...item, postId: feed.id, uiStateRead: false }));

        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(value);
        watchedState.feeds.push(feed);
        watchedState.posts.push(postsWithId);

        setTimeout(function check() {
          addNewPosts(watchedState)
            .finally(() => setTimeout(check, 5000));
        }, 5000);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
};
