'use strict';

(function () {
  window.load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();
    var Code = {
      SUCCESS: 200,
      BAD_REQUEST: 400,
      UNAUTHORIZED: 401,
      NOT_FOUND: 404,
      SERVER_ERROR: 500
    };
    xhr.responseType = 'json';

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case Code.SUCCESS:
          onLoad(xhr.response);
          break;

        case Code.BAD_REQUEST:
          onError('Ошибка ' + xhr.status + ': Неверный запрос');
          break;

        case Code.UNAUTHORIZED:
          onError('Ошибка ' + xhr.status + ': Пользователь не авторизован');
          break;

        case Code.NOT_FOUND:
          onError('Ошибка ' + xhr.status + ': Ничего не найдено');
          break;

        case Code.SERVER_ERROR:
          onError('Ошибка ' + xhr.status + ': Внутренная ошибка сервера');
          break;

        default:
          onError('Ошибка ' + xhr.status + ': ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError('Произошла ошибка соединения');
    });

    xhr.addEventListener('timeout', function () {
      onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
    });

    xhr.timeout = 10000;

    xhr.open('GET', URL);
    xhr.send();
  };
})();
