export const renderBlock = (name) => {
  const cardContainer = document.createElement('div');
  cardContainer.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerText = name;

  const cardListGroup = document.createElement('ul');
  cardListGroup.classList.add('list-group', 'border-0', 'rounded-0');

  cardContainer.append(cardBody, cardListGroup);
  cardBody.append(cardTitle);

  return cardContainer;
};

export const renderFeedItem = (data) => {
  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedTitle = document.createElement('h3');
  feedTitle.classList.add('h6', 'm-0');
  feedTitle.textContent = data.title;

  const feedDescription = document.createElement('p');
  feedDescription.classList.add('m-0', 'small', 'text-black-50');
  feedDescription.textContent = data.description;

  feedItem.append(feedTitle, feedDescription);

  return feedItem;
};

export const renderPostItem = (data) => {
  const modalTitle = document.querySelector('.modal-title');
  const modalBody = document.querySelector('.modal-body');
  const fullArticalBtn = document.querySelector('.full-article');

  const postItem = document.createElement('li');
  postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0',
    'border-end-0');

  const link = document.createElement('a');
  link.classList.add('fw-bold');
  link.href = data.link;
  link.textContent = data.title;

  const button = document.createElement('button');
  button.setAttribute('type', 'button');
  button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
  button.dataset.bsToggle = 'modal';
  button.dataset.bsTarget = '#modal';

  button.addEventListener('click', () => {
    modalTitle.textContent = data.title;
    modalBody.innerHTML = data.description;
    fullArticalBtn.href = data.link;
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal');
  });

  postItem.append(link);
  postItem.append(button);

  return postItem;
};
