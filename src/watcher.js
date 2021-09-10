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

// мб диспечерезация
const render = (path, value, prevValue) => {
  if (path === 'form.errorMessage') {
    renderErrors(value);
    return;
  }

  // TODO: вынести элементы отдельно
  if (path === 'feeds') {
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
};

// 2 параметр: function (path, value, previousValue, applyData)
export default (state) => onChange(state, render);
