import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './watcher.js';
import ru from './locales/ru.js';
import parseRSS from './parserRSS.js';

yup.setLocale({
  string: {
    url: 'incorrectURL',
  },
});

const schema = yup.string().url().matches(/.rss/);

const i18n = i18next.createInstance().init({
  lng: 'ru',
  debug: true,
  defaultNS: 'validationErrors',
  resources: ru,
});

const isInFeedList = (feedsList, feed) => {
  if (feedsList.includes(feed)) {
    throw new Error('doubleURL');
  }
  feedsList.push(feed);
  return feed;
};

const makeFeed = (state, rss) => {
  const title = rss.querySelector('title');
  const description = rss.querySelector('description');

  return {
    id: state.feeds.length,
    url: state.form.url,
    title: title.textContent,
    description: description.textContent,
  };
};

const makePosts = (state, rss) => {
  const itemCol = rss.getElementsByTagName('item');
  const items = Array.from(itemCol);

  return items.map((item) => {
    const name = item.querySelector('title');
    const link = item.querySelector('link');
    return {
      id: state.feeds.length,
      link: link.textContent,
      name: name.textContent,
    };
  });
};

export default () => {
  const state = {
    feedsList: [],
    feeds: [],
    posts: [],
    form: {
      valid: true,
      processState: 'filling',
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

    // TODO: _.findIndex(feeds, (feed) => feed.url == url; }); если нашел -то ошибка (дубуль)
    i18n.then((t) => {
      schema.validate(watchedState.form.url)
        .then((url) => isInFeedList(watchedState.feedsList, url))
        .catch((err) => {
          watchedState.form.errorMessage = t(err.message);
        })
        .then((url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`))
        .then((response) => parseRSS(response.data.contents))
        .then((rss) => {
          console.log(rss);
          const feed = makeFeed(state, rss);
          watchedState.feeds.push(feed);

          const posts = makePosts(state, rss);
          watchedState.posts.push(...posts);

          watchedState.form.processState = 'sent';
        })
        .catch((err) => {
          console.log(err.message);
          watchedState.form.processState = 'error';
          watchedState.form.errorMessage = t('networkErr');
        });
    });
  });
};

// children - возращает только Element, а childNodes - все узлы (вкл текст и комменты)

// Скачать поток и обработать ошибку

// Распарсить полученные данные (выбрать только необходимые)

/* Отобразить эти данные во вью

 У фида должен выводиться заголовок (title) и описание (description) из RSS
 Кроме того, на странице должен быть список постов, загруженных из каждого потока.
 Он заполняется после успешного добавления нового потока
 Каждый элемент в этом списке представляет собой ссылку на пост, где текст ссылки название поста
 */
