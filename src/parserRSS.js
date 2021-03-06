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
    };
  });
};

const isValidRSS = (xmlDOM) => !xmlDOM.getElementsByTagName('parsererror').length;

export default (xml) => {
  const parser = new DOMParser();
  const xmlData = parser.parseFromString(xml.data.contents, 'text/xml');

  if (!isValidRSS(xmlData)) {
    const error = new Error('parsing error');
    error.isParsingError = true;
    throw error;
  }

  const feed = getFeed(xmlData);
  const posts = getPosts(xmlData);

  return { feed, parsedPosts: posts };
};
