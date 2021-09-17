import axios from 'axios';

const getFeed = (xmlData) => {
  const title = xmlData.querySelector('title').textContent;
  const description = xmlData.querySelector('description').textContent;
  return {
    title,
    description,
  };
};

const getPosts = (xmlData) => {
  const items = Array.from(xmlData.getElementsByTagName('item'));

  return items.map((item) => {
    const title = item.querySelector('title').textContent;
    const link = item.querySelector('link').textContent;
    const description = item.querySelector('description').textContent;
    return {
      title,
      link,
      description,
      uiStateRead: false,
    };
  });
};

const isValidRSS = (xmlDOM) => !xmlDOM.getElementsByTagName('parsererror').length;

const parseRSS = (rss) => {
  const parser = new DOMParser();
  const xmlData = parser.parseFromString(rss.data.contents, 'text/xml');

  if (!isValidRSS(xmlData)) {
    throw new Error('processStatus.errors.invalidRSS');
  }

  const feed = getFeed(xmlData);
  const posts = getPosts(xmlData);

  return [feed, posts];
};

export default (url) => axios.get(`https://hexlet-allorigins.herokuapp.com/get?disableCache=true&url=${url}`)
  .then((rss) => parseRSS(rss), () => new Error('processStatus.errors.networkError'));
