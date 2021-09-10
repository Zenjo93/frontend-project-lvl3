export default (content) => {
  console.log('INSIDE PARSE');
  const parser = new DOMParser();
  return parser.parseFromString(content, 'text/xml');
};

const feeds = [
  {
    id: 1,
    url: '',
    title: '',
    description: '',
  },
];

const posts = [
  {
    id: 1,
    url: '',
    name: '',
  },
];

const state = {
  feedsList: [
    {
      id: 1,
      url: '',
      title: '',
      description: '',
    },
    {
      id: 1,
      url: '',
      title: '',
      description: '',
    },
    {
      id: 1,
      url: '',
      title: '',
      description: '',
    },
  ],
  posts: [
    {
      id: 1,
      url: '',
      name: '',
    },
    {
      id: 1,
      url: '',
      name: '',
    },
    {
      id: 1,
      url: '',
      name: '',
    },

  ],
  form: {
    valid: true,
    processState: 'filling',
    url: '',
    errorMessage: null,
  },
};
