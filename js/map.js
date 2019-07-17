'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;
  var MAX_PIN_QUANTITY = 5;
  var map = document.querySelector('.map');
  var mainMapPin = document.querySelector('.map__pin--main');
  var isPageActive = false;
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var housingTypeFilter = document.querySelector('#housing-type');

  var activatePage = function () {
    window.form.switchFormControls(window.form.adForm, false);

    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
  };

  window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + MAIN_PIN_WIDTH / 2))
  + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + MAIN_PIN_HEIGHT / 2));

  var cleanMap = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (it) {
      it.remove();
    });
  };

  var filterNotices = function (notices) {
    var filteredNotices = notices.filter(function (it) {
      if (housingTypeFilter.value === 'any') {
        return true;
      } else {
        return housingTypeFilter.value === it.offer.type;
      }
    });

    filteredNotices = filteredNotices.filter(function (it, i) {
      return i < MAX_PIN_QUANTITY;
    });

    return filteredNotices;
  };

  var onLoad = function (data) {
    window.form.switchFormControls(window.form.filterForm, false);
    var filteredNotices = filterNotices(data);
    window.pin.renderPin(filteredNotices);

    housingTypeFilter.addEventListener('change', function () {
      cleanMap();
      window.pin.renderPin(filterNotices(data));
    });

    if (document.querySelector('main .error')) {
      document.querySelector('main .error').remove();
    }
  };

  var onError = function (message) {
    var errorModal = errorTemplate.cloneNode(true);

    errorModal.querySelector('.error__message').textContent = message;
    errorModal.querySelector('.error__button').addEventListener('click', function () {
      window.load(onLoad, onError);
    });
    document.querySelector('main').appendChild(errorModal);

    var closeErrorModal = function (evt) {
      if (evt.keyCode === window.card.ESC_KEY_CODE) {
        errorModal.remove();
        document.removeEventListener('keydown', closeErrorModal);
      }
    };

    document.addEventListener('keydown', closeErrorModal);
  };

  mainMapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainMapPin.style.top = (mainMapPin.offsetTop - shift.y) + 'px';
      mainMapPin.style.left = (mainMapPin.offsetLeft - shift.x) + 'px';

      window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + MAIN_PIN_WIDTH / 2))
      + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + MAIN_PIN_HEIGHT));
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (!isPageActive) {
        activatePage();
        isPageActive = true;
      }

      if (parseInt(mainMapPin.style.top, 10) > (MAX_Y - MAIN_PIN_HEIGHT)) {
        mainMapPin.style.top = (MAX_Y - MAIN_PIN_HEIGHT) + 'px';
      } else if (parseInt(mainMapPin.style.top, 10) < (MIN_Y - MAIN_PIN_HEIGHT)) {
        mainMapPin.style.top = (MIN_Y - MAIN_PIN_HEIGHT) + 'px';
      }

      if (parseInt(mainMapPin.style.left, 10) > (MAX_X - MAIN_PIN_WIDTH / 2)) {
        mainMapPin.style.left = (MAX_X - MAIN_PIN_WIDTH / 2) + 'px';
      } else if (parseInt(mainMapPin.style.left, 10) < (MIN_X - MAIN_PIN_WIDTH / 2)) {
        mainMapPin.style.left = (MIN_X - MAIN_PIN_WIDTH / 2) + 'px';
      }

      window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + MAIN_PIN_WIDTH / 2))
      + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + MAIN_PIN_HEIGHT));

      window.load(onLoad, onError);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
