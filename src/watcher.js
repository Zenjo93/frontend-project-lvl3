import onChange from 'on-change';

// TODO: добавить 3 тип ошибки - Ресурс не содержит валидный RSS
const renderErrors = (error) => {
  const errorElement = document.querySelector('p.feedback');
  const input = document.getElementById('url-input');

  errorElement.textContent = error;
  input.classList.add('is-invalid');
};

// мб диспечерезация
const render = (path, value, prevValue) => {
  if (path === 'form.errorMessage') {
    renderErrors(value, prevValue);
  }
  if (path === 'feedsList') {
    const input = document.getElementById('url-input');
    const errorElement = document.querySelector('p.feedback');
    errorElement.textContent = '';
    input.classList.remove('is-invalid');
    input.value = '';
    input.focus();
  }
};

// 2 параметр: function (path, value, previousValue, applyData)
export default (state) => onChange(state, render);
