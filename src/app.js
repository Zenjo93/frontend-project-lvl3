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

const isInFeedList = (feeds, feed) => {
  if (feeds.includes(feed)) {
    throw new Error('doubleURL');
  }
  feeds.push(feed);
  return feed;
};

const makeFeed = (state, rss) => {
  const title = rss.querySelector('title');
  const description = rss.querySelector('description');

  return {
    id: state.feeds.length,
    url: state.form.url,
    title,
    description,
  };
};

const makePosts = (state, rss) => {
  const itemCol = rss.getElementsByTagName('item');
  const items = Array.from(itemCol);

  return items.map((item) => {
    console.log(item);
    const name = item.querySelector('title');
    const link = item.querySelector('link');
    return {
      id: state.feeds.length - 1,
      link,
      name,
    };
  });
};

export default () => {
  const state = {
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
        .then((url) => isInFeedList(watchedState.feeds, url))
        .catch((err) => {
          watchedState.form.errorMessage = t(err.message);
        })
        .then((url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`))
        .then((response) => parseRSS(response.data.contents))
        .then((rss) => {
          const feed = makeFeed(state, rss);
          watchedState.feeds.push(feed);

          const posts = makePosts(state, rss);
          watchedState.posts.push(posts);
        })
        .catch(() => {
          watchedState.form.processState = 'error';
          watchedState.form.errorMessage = t('networkErr');
        });
    });
  });
};

// children - возращает только Element, а childNodes - все узлы (вкл текст и комменты)

// i18n.then((t) => {
//   schema.validate(watchedState.form.url)
//     .then((url) => addToFeedList(watchedState, url, t))
//     .catch((err) => watchedState.form.errorMessage = t(err.errors))
//     .then((result) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${result}`))
//     .then((response) => {
//       console.log(`RESPONSE DATA: ${JSON.stringify(response.data.contents, null, 4)}`);
//       return parser.parseFromString(response.data.contents, 'text/xml');
//     })
//     .then((document) => {
//       console.log(document);
//       //  который добавляется в стейт
//       // айтемы, с освоими названиями или линками

//       const title = document.querySelector('title');
//       const description = document.querySelector('description');
//       console.log(title);
//       console.log(description);
//     });
// });

// Скачать поток и обработать ошибку

// Распарсить полученные данные (выбрать только необходимые)

/* Отобразить эти данные во вью

 У фида должен выводиться заголовок (title) и описание (description) из RSS
 Кроме того, на странице должен быть список постов, загруженных из каждого потока.
 Он заполняется после успешного добавления нового потока
 Каждый элемент в этом списке представляет собой ссылку на пост, где текст ссылки название поста
 */
