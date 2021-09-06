import onChange from 'on-change';
import { isEmpty } from 'lodash';

const renderErrors = (error, prevError) => {
  const [errorMessage] = error;

  console.log(`errorMessage: ${errorMessage}`);

  const errorElement = document.querySelector('p.feedback');
  // если это новая ошибка, и до этого не было

  if (isEmpty(prevError)) {
    errorElement.textContent = errorMessage;
    // eslint-disable-next-line brace-style
  }

  // кейс: ошибки были и появились новые
  else {
    errorElement.textContent = errorMessage;
  }
};

// TODO: мб диспечерезация
const render = (path, value, prevValue) => {
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
