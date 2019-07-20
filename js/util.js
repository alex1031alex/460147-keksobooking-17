'use strict';

(function () {
  var ESC_KEY_CODE = 27;

  var escPressHandlerMaker = function (element) {
    var escPressHandler = function (evt) {
      if (evt.keyCode === ESC_KEY_CODE) {
        element.remove();
        document.removeEventListener('keydown', escPressHandler);
      }
    };
    return escPressHandler;
  };

  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorModal = errorTemplate.cloneNode(true);
    var errorButton = errorModal.querySelector('.error__button');
    errorButton.textContent = message;
    document.querySelector('main').appendChild(errorModal);
    errorButton.addEventListener('click', function () {
      errorModal.remove();
    });
    document.addEventListener('keydown', escPressHandlerMaker(errorModal));
  };

  window.util = {
    escPressHandlerMaker: escPressHandlerMaker,
    errorHandler: errorHandler
  };
})();
