'use strict';

(function () {
  var MIN_X = 0;
  var MAX_X = 1200;
  var MIN_Y = 130;
  var MAX_Y = 630;
  var mainPin = {
    WIDTH: 65,
    HEIGHT: 87,
    TOP: 375,
    LEFT: 570
  };
  var MAX_PIN_QUANTITY = 5;
  var map = document.querySelector('.map');
  var mainMapPin = document.querySelector('.map__pin--main');
  var isPageActive = false;
  var housingTypeFilter = document.querySelector('#housing-type');

  var activatePage = function () {
    window.form.switchFormControls(window.form.adForm, false);

    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
  };

  window.form.deactivatePage = function () {
    cleanMap();
    mainMapPin.style.left = mainPin.LEFT + 'px';
    mainMapPin.style.top = mainPin.TOP + 'px';
    map.classList.add('map--faded');
    window.form.adForm.reset();
    window.form.adForm.classList.add('ad-form--disabled');
  };

  window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + mainPin.WIDTH / 2))
  + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + mainPin.HEIGHT / 2));
  window.form.addressInput.disabled = true;

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

      window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + mainPin.WIDTH / 2))
      + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + mainPin.HEIGHT));
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (!isPageActive) {
        activatePage();
        isPageActive = true;
      }

      if (parseInt(mainMapPin.style.top, 10) > (MAX_Y - mainPin.HEIGHT)) {
        mainMapPin.style.top = (MAX_Y - mainPin.HEIGHT) + 'px';
      } else if (parseInt(mainMapPin.style.top, 10) < (MIN_Y - mainPin.HEIGHT)) {
        mainMapPin.style.top = (MIN_Y - mainPin.HEIGHT) + 'px';
      }

      if (parseInt(mainMapPin.style.left, 10) > (MAX_X - mainPin.WIDTH / 2)) {
        mainMapPin.style.left = (MAX_X - mainPin.WIDTH / 2) + 'px';
      } else if (parseInt(mainMapPin.style.left, 10) < (MIN_X - mainPin.WIDTH / 2)) {
        mainMapPin.style.left = (MIN_X - mainPin.WIDTH / 2) + 'px';
      }

      window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + mainPin.WIDTH / 2))
      + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + mainPin.HEIGHT));

      window.load(onLoad, window.util.errorHandler);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
