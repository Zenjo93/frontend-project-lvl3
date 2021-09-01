import * as yup from 'yup';

const schema = yup.string().matches(/.rss/).url();

const validate = (state) =>
  // Возвращает промис
  schema.validate(state.form.url).then((result) => !state.feedsList.includes(result)).catch((err) => console.log(err));

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
    validate(state).then((result) => state.form.valid = result);
    console.log(`state.form.valid: ${state.form.valid}`);
    state.feedsList.push(state.form.url);

    // validate(state).then((result) => state.valid = result); // scheme validate  проверить
  });
};

// onChange - следит за стейтом, применяет функцию рендер для изменения вью
// yup - собирает схему валидации поля
