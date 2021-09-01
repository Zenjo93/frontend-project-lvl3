import * as yup from 'yup';

const schema = yup.string().matches(/.rss/).url();

const validate = (state) => {
  // дубли

  // некорректная урла
};

export default () => {
  const state = {
    feedsList: [],
    form: {
      valid: true,
      url: '',
      errors: {},
    },
  };

  const form = document.querySelector('form');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const value = formData.get('url');
    state.form.url = value;
    state.form.valid = validate(state);
  });
};

// onChange - следит за стейтом, применяет функцию рендер для изменения вью
// yup - собирает схему валидации поля
