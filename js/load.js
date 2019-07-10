'use strict';

(function () {
  window.load = function (onLoad, onError) {
    var URL = 'https://js.dump.academy/keksobooking/data';
    var xhr = new XMLHttpRequest();

    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case 200:
          onLoad(xhr.response);
          break;

        case 400:
          onError('Ошибка ' + xhr.status + ': Неверный запрос');
          break;

        case 401:
          onError('Ошибка ' + xhr.status + ': Пользователь не авторизован');
          break;

        case 404:
          onError('Ошибка ' + xhr.status + ': Ничего не найдено');
          break;

        default:
          onError('Ошибка ' + xhr.status + ': ' + xhr.statusText);
      }
    });

    xhr.open('GET', URL);
    xhr.send();
  };
})();