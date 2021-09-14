import * as yup from 'yup';
import i18next from 'i18next';
import axios from 'axios';
import watch from './watcher.js';
import ru from './locales/ru.js';
import parseRSS from './parserRSS.js';

const form = document.querySelector('form');

yup.setLocale({
  url: 'processStatus.errors.invalidURL',
  notOneOf: 'processStatus.errors.duplicatedURL',
});

const validate = (url, feedList) => {
  const validationSchema = yup.string().url().notOneOf(feedList).required();
  return validationSchema.validate(url);
};

export default () => {
  const state = {
    feedList: [],
    form: {
      processState: 'filling', // filling, sent, error
      valid: true, // красная рамка
      error: null, // ключ ошибки
      value: '',
    },
  };

  const watchedState = watch(state);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    watchedState.form.value = form.url.value;

    validate(watchedState.form.value, watchedState.feedList)
      .then((url) => watchedState.feedList.push(url))
      .catch((err) => {
        watchedState.form.processState = 'error';
        watchedState.form.error = err.message;
      });
  });
};

// --------------

//
// // TODO:  добавить required https://github.com/jquense/yup#array
// const schema = yup.string().url().matches(/.rss/);
//
// const i18n = i18next.createInstance().init({
//   lng: 'ru',
//   debug: true,
//   defaultNS: 'validationErrors',
//   resources: ru,
// });
//
// const isInFeedList = (feedsList, feed) => {
//   if (feedsList.includes(feed)) {
//     throw new Error('doubleURL');
//   }
//   feedsList.push(feed);
//   return feed;
// };
//
// const makeFeed = (state, rss) => {
//   const title = rss.querySelector('title');
//   const description = rss.querySelector('description');
//
//   return {
//     id: state.feeds.length,
//     url: state.form.url,
//     title: title.textContent,
//     description: description.textContent,
//   };
// };
//
// const makePosts = (state, rss) => {
//   const itemCol = rss.getElementsByTagName('item');
//   const items = Array.from(itemCol);
//
//   return items.map((item) => {
//     const name = item.querySelector('title');
//     const link = item.querySelector('link');
//     return {
//       id: state.feeds.length,
//       link: link.textContent,
//       name: name.textContent,
//     };
//   });
// };
//
// const makeRssRequest = (url) => {
//   axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
//     .then((response) => parseRSS(response.data.contents));
// };
//
// export default () => {
//   const state = {
//     feedsList: [], // yup про дубли
//     feeds: [],
//     posts: [],
//     form: {
//       valid: true,
//       processState: 'filling',
//       url: '',
//       errorMessage: null,
//     },
//   };
//
//   const watchedState = watch(state);
//
//   const form = document.querySelector('form');
//   const input = form.url;
//
//   form.addEventListener('submit', (e) => {
//     e.preventDefault();
//     watchedState.form.url = input.value;
//
//     // TODO: установить рекурсивный setTimeout для обращения к серверу раз в 5 сек
//     // TODO: _.findIndex(feeds, (feed) => feed.url == url; }); если нашел -то ошибка (дубуль)
//
//     // В стейсте хранятся ключи, а перевод осуществялется на рендере
//     i18n.then((t) => {
//       // 1 фукнция валидации (валиадция урл + дубль)
//       schema.validate(watchedState.form.url)
//         .then((url) => isInFeedList(watchedState.feedsList, url))
//         .catch((err) => {
//           watchedState.form.errorMessage = t(err.message);
//         })
//         // axios + parsing rss объединить
//         // parser в отедльный модуль
//         .then((url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`))
//         .then((response) => parseRSS(response.data.contents))
//         .then((rss) => {
//           console.log(rss);
//           const feed = makeFeed(state, rss);
//           watchedState.feeds.push(feed);
//
//           const posts = makePosts(state, rss);
//           watchedState.posts.push(...posts);
//
//           watchedState.form.processState = 'sent';
//         })
//         .catch((err) => {
//           console.log(err.message);
//           watchedState.form.processState = 'error';
//           watchedState.form.errorMessage = t('networkErr');
//         });
//     });
//   });
// };

// children - возращает только Element, а childNodes - все узлы (вкл текст и комменты)

// Скачать поток и обработать ошибку

// Распарсить полученные данные (выбрать только необходимые)

/* Отобразить эти данные во вью

 У фида должен выводиться заголовок (title) и описание (description) из RSS
 Кроме того, на странице должен быть список постов, загруженных из каждого потока.
 Он заполняется после успешного добавления нового потока
 Каждый элемент в этом списке представляет собой ссылку на пост, где текст ссылки название поста
 */

// TODO тексты интерфейсов:
// 1. RSS успешно загружен,
// 2. RSS уже существует,
// 3. Не должно быть пустым - добавить в валидатор requred
// 4. Ссылка должна быть валидным URL,

// 5, Ресурс не содержит валидный RSS - если парсер падает с ошибкой
// const parser = new DOMParser();
//
// const xmlString = "<warning>Beware of the missing closing tag";
// const doc = parser.parseFromString(xmlString, "application/xml");
// // XML Parsing Error: no root element found

// 6. Просмотр - кнопка

// 7, Ошибка сети.
