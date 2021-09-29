import onChange from 'on-change';
import _ from 'lodash';
import { renderBlock, buildFeedItem, buildPostItem } from './renderElements';

const handleProcessState = (value, translate) => {
  const input = document.getElementById('url-input');
  const feedback = document.querySelector('p.feedback');
  const button = document.querySelector('button[type=submit]');

  switch (value) {
    case 'sent':
      input.removeAttribute('readonly');
      button.disabled = false;

      feedback.classList.remove('text-danger');
      feedback.classList.add('text-success');
      feedback.textContent = translate('processStatus.sent');

      input.value = '';
      input.classList.remove('is-invalid');
      input.focus();
      break;

    case 'sending':
      input.setAttribute('readonly', 'true');
      button.disabled = true;
      break;

    default:
      throw new Error('Unknown processState');
  }
};

const handleError = (error, translate) => {
  const feedback = document.querySelector('p.feedback');
  const button = document.querySelector('button[type=submit]');
  const input = document.getElementById('url-input');

  input.removeAttribute('readonly');
  button.disabled = false;

  if (error === null) {
    feedback.classList.remove('text-danger');
    feedback.textContent = '';
  } else {
    feedback.classList.add('text-danger');
    feedback.textContent = translate(error);
  }
};

const initRender = () => {
  const posts = document.querySelector('.posts');
  const feeds = document.querySelector('.feeds');

  feeds.append(renderBlock('Фиды'));
  posts.append(renderBlock('Посты'));
};

const renderFeed = (value) => {
  const feeds = document.querySelector('.feeds');

  const feedItem = buildFeedItem(_.last(value));
  const feedBlock = feeds.querySelector('ul');
  feedBlock.append(feedItem);
};

const renderPosts = (value, translate) => {
  const posts = document.querySelector('.posts');

  const postData = _.last(value);
  const postsItems = postData.map((data) => {
    const item = buildPostItem(data);
    item.querySelector('button').textContent = translate('buttons.view');

    return item;
  });

  const postBlock = posts.querySelector('ul');

  postBlock.append(...postsItems);
};

const render = (translate) => (path, value) => {
  const input = document.getElementById('url-input');
  console.log(path);
  switch (path) {
    case 'form.processState':
      handleProcessState(value, translate);
      break;

    case 'form.valid':
      input.classList.toggle('is-invalid', !value);
      break;

    case 'form.error':
      handleError(value, translate);
      break;

    case 'init':
      initRender();
      break;

    case 'feeds':
      renderFeed(value);
      break;

    case 'posts':
      renderPosts(value, translate);
      break;

    case 'feedList':
      break;

    case 'form':
      break;

    default:
      throw new Error(`Unknown state at ${path} for ${value}`);
  }
};

export default (state, translate) => onChange(state, render(translate));
