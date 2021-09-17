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

const handleProcessState = () => {
  feedback.classList.add('text-success');
  i18n.then((t) => {
    feedback.textContent = t('processStatus.sent');
  });
  input.value = '';
  input.focus();
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
  const postsItems = postData.map((data) => {
    const item = renderPostItem(data);

    i18n.then((t) => {
      item.querySelector('button').textContent = t('buttons.view');
    });

    return item;
  });

  const postBlock = posts.querySelector('ul');

  postBlock.append(...postsItems);
};

// Переписать на диспечерезацию
const render = (path, value) => {
  console.log(path);
  switch (path) {
    case 'form.processState':
      handleProcessState();
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

    case 'feeds':
      renderFeed(value);
      break;

    case 'form.value':
      break;

    case 'feedList':
      break;

    case 'posts':
      renderPosts(value);
      break;

    default:
      throw new Error(`Unknown state at ${path} for ${value}`);
  }
};

export default (state) => onChange(state, render);
