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

export const renderItem = () => {

};

// feedItem.append(feedItemTitle, feedItemDescription);
//   feedGroup.append(feedItem);
//   cardBody.append(cardTitle);
//   cardBorder.append(cardBody, feedGroup);
//   feeds.append(cardBorder);
