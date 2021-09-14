export default {
  ru: {
    processStatus: {
      success: 'RSS успешно загружен',
      errors: {
        invalidURL: 'Ссылка должна быть валидным URL',
        duplicatedURL: 'RSS уже существует',
        networkError: 'Ошибка сети',
        invalidRSS: 'Ресурс не содержит валидный RSS',
      },
    },
    buttons: {
      view: 'Просмотр',
    },
  },
};

// TODO тексты интерфейсов:
// 1. RSS успешно загружен,
// 2. RSS уже существует,
// 3. Не должно быть пустым - добавить в валидатор requred
// 4. Ссылка должна быть валидным URL,

// 5, Ресурс не содержит валидный RSS - если парсер падает с ошибкой
// const parser = new DOMParser();
//
// const xmlString = "<warning>Beware of the missing closing tag";
// const doc = parser.parseFromString(xmlString, "application/xml");
// // XML Parsing Error: no root element found

// 6. Просмотр - кнопка

// 7, Ошибка сети.
