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

const renderFeed = (feed) => {
  // TODO: заголовок фиды создается 1 раз
  const feeds = document.querySelector('.feeds');

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerText = 'Фиды';

  const feedGroup = document.createElement('ul');
  feedGroup.classList.add('list-group', 'border-0', 'rounded-0');

  const feedItem = document.createElement('li');
  feedItem.classList.add('list-group-item', 'border-0', 'border-end-0');

  const feedItemTitle = document.createElement('h3');
  feedItemTitle.classList.add('h6', 'm-0');
  feedItemTitle.textContent = feed[0].title;

  const feedItemDescription = document.createElement('p');
  feedItemDescription.classList.add('m-0', 'small', 'text-black-50');
  feedItemDescription.textContent = feed[0].description;

  feedItem.append(feedItemTitle, feedItemDescription);
  feedGroup.append(feedItem);
  cardBody.append(cardTitle);
  cardBorder.append(cardBody, feedGroup);
  feeds.append(cardBorder);
};

const renderPost = (postsObj) => {
  // TODO: заголовок Посты создается 1 раз
  const posts = document.querySelector('.posts');

  const cardBorder = document.createElement('div');
  cardBorder.classList.add('card', 'border-0');

  const cardBody = document.createElement('div');
  cardBody.classList.add('card-body');

  const cardTitle = document.createElement('h2');
  cardTitle.classList.add('card-title', 'h4');
  cardTitle.innerText = 'Посты';

  const feedGroup = document.createElement('ul');
  feedGroup.classList.add('list-group', 'border-0', 'rounded-0');

  const postsElements = postsObj.map((post) => {
    const postItem = document.createElement('li');
    postItem.classList.add('list-group-item', 'd-flex', 'justify-content-between', 'align-items-start', 'border-0', 'border-end-0');

    const postUrl = document.createElement('a');
    postUrl.classList.add('w-bold');
    postUrl.href = post.link;
    postUrl.textContent = post.name;

    postItem.append(postUrl);

    console.log(postItem);

    return postItem;
  });

  postsElements.forEach((el) => feedGroup.append(el));

  cardBody.append(cardTitle);
  cardBorder.append(cardBody, feedGroup);
  posts.append(cardBorder);
};

// мб диспечерезация
const render = (path, value, prevValue) => {
  if (path === 'form.errorMessage') {
    renderErrors(value);
    return;
  }

  // TODO: вынести элементы отдельно
  if (path === 'feedsList') {
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

  if (path === 'feeds') {
    renderFeed(value);
  }

  if (path === 'posts') {
    renderPost(value);
  }
};

// 2 параметр: function (path, value, previousValue, applyData)
export default (state) => onChange(state, render);

/*
<div className="col-md-10 col-lg-8 order-1 mx-auto posts">
  <div className="card border-0">
    <div className="card-body"><h2 className="card-title h4">Посты</h2></div>
    <ul className="list-group border-0 rounded-0">
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0">
      <a
        href="https://ru.hexlet.io/courses/java-web/lessons/http/theory_unit" className="fw-bold" data-id="2"
        target="_blank" rel="noopener noreferrer">HTTP / Java: Веб-технологии</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="2" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-real/lessons/nested-forms/theory_unit" className="fw-bold" data-id="3"
        target="_blank" rel="noopener noreferrer">Nested Forms / Ruby: Реальный Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="3" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-real/lessons/search-forms/theory_unit" className="fw-bold" data-id="4"
        target="_blank" rel="noopener noreferrer">Search Forms / Ruby: Реальный Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="4" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-real/lessons/fsm/theory_unit" className="fw-bold" data-id="5"
        target="_blank" rel="noopener noreferrer">FSM / Ruby: Реальный Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="5" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-real/lessons/system-tests/theory_unit" className="fw-bold" data-id="6"
        target="_blank" rel="noopener noreferrer">Системные тесты / Ruby: Реальный Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="6" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-real/lessons/security/theory_unit" className="fw-bold" data-id="7"
        target="_blank" rel="noopener noreferrer">Security / Ruby: Реальный Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="7" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/rails-basics/lessons/rake/theory_unit" className="fw-bold" data-id="8"
        target="_blank" rel="noopener noreferrer">Rake / Основы Ruby on Rails</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="8" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/css-transform/lessons/2d-skew/theory_unit" className="fw-bold" data-id="9"
        target="_blank" rel="noopener noreferrer">2D трансформации. Наклон / CSS: Transform</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="9" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/java-oop/lessons/code-generation/theory_unit" className="fw-bold"
        data-id="10" target="_blank" rel="noopener noreferrer">Генерация кода / Java: ООП</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="10" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
      <li className="list-group-item d-flex justify-content-between align-items-start border-0 border-end-0"><a
        href="https://ru.hexlet.io/courses/java-oop/lessons/reflections/theory_unit" className="fw-bold" data-id="11"
        target="_blank" rel="noopener noreferrer">Reflections / Java: ООП</a>
        <button type="button" className="btn btn-outline-primary btn-sm" data-id="11" data-bs-toggle="modal"
                data-bs-target="#modal">Просмотр
        </button>
      </li>
    </ul>
  </div>
</div>
*/
