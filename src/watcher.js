import onChange from 'on-change';
import { isEmpty } from 'lodash';

const renderErrors = (error, prevError) => {
  const errorElement = document.querySelector('p.feedback');
  errorElement.textContent = error;
};

// TODO: мб диспечерезация
const render = (path, value, prevValue) => {
  console.log(`path: ${path}`);
  if (path === 'form.errorMessage') {
    renderErrors(value, prevValue);
  }
};

// 2 параметр: function (path, value, previousValue, applyData)
export default (state) => onChange(state, render);

/* ошибки:

1. Ссылка должна быть валидным URL
2. RSS уже существует
3. Ресурс не содержит валидный RSS

 */
