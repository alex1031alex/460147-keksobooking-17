'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;
  var MAX_PIN_QUANTITY = 5;
  var ESC_KEY_CODE = 27;
  var map = document.querySelector('.map');
  var mainMapPin = document.querySelector('.map__pin--main');
  var isPageActive = false;
  var errorTemplate = document.querySelector('#error').content.querySelector('.error');
  var housingTypeFilter = document.querySelector('#housing-type');

  var activatePage = function () {
    window.form.switchFormControls(window.form.adForm, false);
    window.form.switchFormControls(window.form.filterForm, false);
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

  var filterByHousing = function (notices) {
    return notices.filter(function (it) {
      if (housingTypeFilter.value === 'any') {
        return true;
      } else {
        return housingTypeFilter.value === it.offer.type;
      }
    });
  };

  var filterByQuantity = function (notices) {
    return notices.filter(function (it, i) {
      return i < MAX_PIN_QUANTITY;
    });
  };

  var onLoad = function (data) {
    var filteredNotices = filterByQuantity(data);
    window.card.fillNoticeList(filteredNotices);

    housingTypeFilter.addEventListener('change', function () {
      cleanMap();
      filteredNotices = filterByHousing(data);
      filteredNotices = filterByQuantity(filteredNotices);
      window.card.fillNoticeList(filteredNotices);
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
      if (evt.keyCode === ESC_KEY_CODE) {
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

      if (parseInt(mainMapPin.style.top, 10) > (window.data.MAX_Y - MAIN_PIN_HEIGHT)) {
        mainMapPin.style.top = (window.data.MAX_Y - MAIN_PIN_HEIGHT) + 'px';
      } else if (parseInt(mainMapPin.style.top, 10) < (window.data.MIN_Y - MAIN_PIN_HEIGHT)) {
        mainMapPin.style.top = (window.data.MIN_Y - MAIN_PIN_HEIGHT) + 'px';
      }

      if (parseInt(mainMapPin.style.left, 10) > (window.data.MAX_X - MAIN_PIN_WIDTH / 2)) {
        mainMapPin.style.left = (window.data.MAX_X - MAIN_PIN_WIDTH / 2) + 'px';
      } else if (parseInt(mainMapPin.style.left, 10) < (window.data.MIN_X - MAIN_PIN_WIDTH / 2)) {
        mainMapPin.style.left = (window.data.MIN_X - MAIN_PIN_WIDTH / 2) + 'px';
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
