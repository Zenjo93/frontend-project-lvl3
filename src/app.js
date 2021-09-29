import * as yup from 'yup';
import _ from 'lodash';
import parseRSS from './parserRSS.js';

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

const addNewPosts = (feeds, posts) => {
  feeds.forEach((feed) => {
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
        return parseRSS(url);
      })
      .then((data) => {
        watchedState.form.processState = 'sent';
        const [feed, posts] = data;

        feed.id = watchedState.feedList.length;
        feed.url = value;
        const postWithId = posts.map((item) => ({ ...item, postId: feed.id }));

        watchedState.init = watchedState.init || true;
        watchedState.feedList.push(value);
        watchedState.feeds.push(feed);
        watchedState.posts.push(postWithId);

        setTimeout(function check() {
          addNewPosts(watchedState.feeds, watchedState.posts)
            .then(() => setTimeout(check, 5000));
        }, 5000);
      })
      .catch((err) => {
        watchedState.form.valid = false;
        watchedState.form.error = err.message;
      });
  });
};
