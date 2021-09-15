import onChange from 'on-change';
import i18next from 'i18next';
import _ from 'lodash';
import ru from './locales/ru.js';
import { renderBlock, renderFeedItem, renderPostItem } from './renderElements.js';

const input = document.getElementById('url-input');
const feedback = document.querySelector('p.feedback');
const feeds = document.querySelector('.feeds');
const posts = document.querySelector('.posts');

const i18n = i18next.createInstance().init({
  lng: 'ru',
  debug: true,
  resources: ru,
});

const handleProcessState = (processState) => {
  // sent
  switch (processState) {
    case 'sent':
      feedback.classList.add('text-success');
      i18n.then((t) => {
        feedback.textContent = t('processStatus.sent');
      });
      input.value = '';
      input.focus();

      // Отобразить 1 раз контейнеры для фидов и поста
      // добавлять новые тайтлы и дексрпишены
      break;
  }
};

const handleError = (error) => {
  if (error === null) {
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
  } else {
    feedback.classList.add('text-danger');
    i18n.then((t) => {
      feedback.textContent = t(error);
    });
  }
};

const initRender = () => {
  feeds.append(renderBlock('Фиды'));
  posts.append(renderBlock('Посты'));
};

const renderFeed = (value) => {
  const feedItem = renderFeedItem(_.last(value));
  const feedBlock = feeds.querySelector('ul');
  feedBlock.append(feedItem);
};

const renderPosts = (value) => {
  const postData = _.last(value);
  const postsItems = postData.map((data) => renderPostItem(data));
  const postBlock = posts.querySelector('ul');

  postBlock.append(...postsItems);
};

//
// const renderPosts = (value) => {
//   // const feedItem = renderFeedItem(_.last(value));
//   // const feedBlock = feeds.querySelector('ul');
//   // feedBlock.append(feedItem);
// };

// Переписать на диспечерезацию
const render = (path, value) => {
  // --- стейты приложения ---

  switch (path) {
    case 'form.processState':
      handleProcessState(value);
      break;

    // Форма не прошла валидацию (не корректный урл, дубль) - подсвечиваем красной рамкой
    case 'form.valid':
      input.classList.toggle('is-invalid', !value);
      break;

    // Возникла ошибка (Ошибка сети, Ресурс не содержит валидный RSS) - высвечиваем текст
    case 'form.error':
      handleError(value);
      break;

    case 'init':
      initRender();
      break;

      // TODO
    case 'feeds':
      renderFeed(value);

      break;

      // TODO
    case 'posts':
      renderPosts(value);
      break;

    // default:
    //   throw new Error(`Unknow state at ${path} for ${value}`);
  }
};

export default (state) => onChange(state, render);

// ----
// TODO: добавить 3 тип ошибки - Ресурс не содержит валидный RSS
// const renderErrors = (error) => {
//   const errorElement = document.querySelector('p.feedback');
//   const input = document.getElementById('url-input');
//
//   errorElement.classList.add('text-danger');
//   errorElement.textContent = error;
//   input.classList.add('is-invalid');
// };
//
// const handleProcessState = (processState) => {
//   if (processState === 'sent') {
//     const feedBack = document.querySelector('p.feedback');
//     feedBack.classList.remove('text-danger');
//     feedBack.classList.add('text-success');
//     feedBack.textContent = 'RSS успешно загружен';
//   }
// };
//
// const renderFeed = (feed) => {
//   // TODO: заголовок фиды создается 1 раз
//   const feeds = document.querySelector('.feeds');
//
//   const cardBorder = document.createElement('div');
//   cardBorder.classList.add('card', 'border-0');
//
//   const cardBody = document.createElement('div');
//   cardBody.classList.add('card-body');
//
//   const cardTitle = document.createElement('h2');
//   cardTitle.classList.add('card-title', 'h4');
//   cardTitle.innerText = 'Фиды';
//
//   const feedGroup = document.createElement('ul');
//   feedGroup.classList.add('list-group', 'border-0', 'rounded-0');
//
//   const feedItem = document.createElement('li');
//   feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');
//
//   const feedItemTitle = document.createElement('h3');
//   feedItemTitle.classList.add('h6', 'm-0');
//   feedItemTitle.textContent = feed[0].title;
//
//   const feedItemDescription = document.createElement('p');
//   feedItemDescription.classList.add('m-0', 'small', 'text-black-50');
//   feedItemDescription.textContent = feed[0].description;
//
//   feedItem.append(feedItemTitle, feedItemDescription);
//   feedGroup.append(feedItem);
//   cardBody.append(cardTitle);
//   cardBorder.append(cardBody, feedGroup);
//   feeds.append(cardBorder);
// };
//
// const renderPost = (postsObj) => {
//   // TODO: заголовок Посты создается 1 раз
//   const posts = document.querySelector('.posts');
//
//   const cardBorder = document.createElement('div');
//   cardBorder.classList.add('card', 'border-0');
//
//   const cardBody = document.createElement('div');
//   cardBody.classList.add('card-body');
//
//   const cardTitle = document.createElement('h2');
//   cardTitle.classList.add('card-title', 'h4');
//   cardTitle.innerText = 'Посты';
//
//   const feedGroup = document.createElement('ul');
//   feedGroup.classList.add('list-group', 'border-0', 'rounded-0');
//
//   const postsElements = postsObj.map((post) => {
//     const postItem = document.createElement('li');
//     postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between',
//     'align-items-start', 'border-0', 'border-end-0');
//
//     const postUrl = document.createElement('a');
//     postUrl.classList.add('w-bold');
//     postUrl.href = post.link;
//     postUrl.textContent = post.name;
//
//     postItem.append(postUrl);
//
//     console.log(postItem);
//
//     return postItem;
//   });
//
//   postsElements.forEach((el) => feedGroup.append(el));
//
//   cardBody.append(cardTitle);
//   cardBorder.append(cardBody, feedGroup);
//   posts.append(cardBorder);
// };
//
// // мб диспечерезация
// const render = (path, value, prevValue) => {
//   if (path === 'form.errorMessage') {
//     renderErrors(value);
//     return;
//   }
//
//   // TODO: вынести элементы отдельно
//   if (path === 'feedsList') {
//     const input = document.getElementById('url-input');
//     const feedBack = document.querySelector('p.feedback');
//     feedBack.textContent = '';
//     input.classList.remove('is-invalid');
//     input.value = '';
//     input.focus();
//     return;
//   }
//
//   if (path === 'form.processState') {
//     handleProcessState(value);
//   }
//
//   if (path === 'feeds') {
//     renderFeed(value);
//   }
//
//   if (path === 'posts') {
//     renderPost(value);
//   }
// };
//
// // 2 параметр: function (path, value, previousValue, applyData)
//

// <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
//   href="https://ru.hexlet.io/courses/java-oop/lessons/patterns-continuation/theory_unit" className="fw-bold" data-id="2"
//   target="_blank" rel="noopener noreferrer">Паттерны (продолжение) / Java: ООП</a>
//   <button type="button" className="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal"
//           data-bs-target="#modal">Просмотр
//   </button>
// </li>

// <li className="list-group-item border-0 border-end-0">
// <h3 className="h6 m-0">Новые уроки на Хекслете</h3>
// <p> className="m-0 small text-black-50">Практические уроки по программированию</p>
// </li>
