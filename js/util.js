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

  var switchFormControls = function (form, isDisabled) {
    var inputs = form.querySelectorAll('input');
    var selects = form.querySelectorAll('select');
    var textareas = form.querySelectorAll('textarea');
    var submit = form.querySelector('[type="submit"]');
    var addressInput = document.querySelector('#address');

    for (var i = 0; i < inputs.length; i++) {
      if (inputs[i] !== addressInput) {
        inputs[i].disabled = isDisabled;
      }
    }
    for (i = 0; i < selects.length; i++) {
      selects[i].disabled = isDisabled;
    }
    for (i = 0; i < textareas.length; i++) {
      textareas[i].disabled = isDisabled;
    }
    if (submit) {
      submit.disabled = isDisabled;
    }
  };

  window.util = {
    escPressHandlerMaker: escPressHandlerMaker,
    errorHandler: errorHandler,
    switchFormControls: switchFormControls
  };
})();