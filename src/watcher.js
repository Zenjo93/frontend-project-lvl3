import onChange from 'on-change';

// TODO: добавить 3 тип ошибки - Ресурс не содержит валидный RSS
const renderErrors = (error) => {
  const errorElement = document.querySelector('p.feedback');
  const input = document.getElementById('url-input');

  errorElement.classList.add('text-danger');
  errorElement.textContent = error;
  input.classList.add('is-invalid');
};

const handleProcessState = (processState) => {
  if (processState === 'sent') {
    const feedBack = document.querySelector('p.feedback');
    feedBack.classList.remove('text-danger');
    feedBack.classList.add('text-success');
    feedBack.textContent = 'RSS успешно загружен';
  }
};

const renderFeed = (feed) => {
  // TODO: заголовок фиды создается 1 раз
  const feeds = document.querySelector('.feeds');

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerText = 'Фиды';

  const feedGroup = document.createElement('ul');
  feedGroup.classList.add('list-group', 'border-0', 'rounded-0');

  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedItemTitle = document.createElement('h3');
  feedItemTitle.classList.add('h6', 'm-0');
  feedItemTitle.textContent = feed[0].title;
  console.log(`feed title: ${feed[0].title}`);

  const feedItemDescription = document.createElement('p');
  feedItemDescription.classList.add('m-0', 'small', 'text-black-50');
  feedItemDescription.textContent = feed[0].description;

  feedItem.append(feedItemTitle, feedItemDescription);
  feedGroup.append(feedItem);
  cardBody.append(cardTitle);
  cardBorder.append(cardBody, feedGroup);
  feeds.append(cardBorder);
};

// мб диспечерезация
const render = (path, value, prevValue) => {
  if (path === 'form.errorMessage') {
    renderErrors(value);
    return;
  }

  // TODO: вынести элементы отдельно
  if (path === 'feedsList') {
    const input = document.getElementById('url-input');
    const feedBack = document.querySelector('p.feedback');
    feedBack.textContent = '';
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
    return;
  }

  if (path === 'form.processState') {
    handleProcessState(value);
  }

  if (path === 'feeds') {
    renderFeed(value);
  }

  if (path === 'posts') {

  }
};

// 2 параметр: function (path, value, previousValue, applyData)
export default (state) => onChange(state, render);
