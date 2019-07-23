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
  var map = document.querySelector('.map');
  var mainMapPin = document.querySelector('.map__pin--main');
  var isPageActive = false;

  var fillAddressInput = function () {
    window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + mainPin.WIDTH / 2))
    + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + mainPin.HEIGHT / 2));
  };

  var activatePage = function () {
    window.util.switchFormControls(window.form.adForm, false);
    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
    isPageActive = true;
  };

  window.form.deactivatePage = function () {
    window.pin.cleanMap();
    mainMapPin.style.left = mainPin.LEFT + 'px';
    mainMapPin.style.top = mainPin.TOP + 'px';
    map.classList.add('map--faded');
    window.form.adForm.reset();
    window.util.switchFormControls(window.form.adForm, true);
    window.pin.filterForm.reset();
    window.util.switchFormControls(window.pin.filterForm, true);
    fillAddressInput();
    window.form.adForm.classList.add('ad-form--disabled');
    window.form.addressInput.disabled = true;
    isPageActive = false;
  };

  fillAddressInput();
  window.form.addressInput.disabled = true;

  var Coordinate = function (x, y) {
    this.x = x;
    this.y = y;
  };

  mainMapPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = new Coordinate(evt.clientX, evt.clientY);

    var mouseMoveHandler = function (moveEvt) {
      moveEvt.preventDefault();
      var shift = new Coordinate(startCoords.x - moveEvt.clientX, startCoords.y - moveEvt.clientY);
      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainMapPin.style.top = (mainMapPin.offsetTop - shift.y) + 'px';
      mainMapPin.style.left = (mainMapPin.offsetLeft - shift.x) + 'px';

      fillAddressInput();
    };

    var mouseUpHandler = function (upEvt) {
      upEvt.preventDefault();

      if (!isPageActive) {
        activatePage();
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

      fillAddressInput();
      window.load(window.pin.successLoadHandler, window.util.errorHandler);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });

  mainMapPin.addEventListener('keydown', function (keyEvt) {
    if (keyEvt.keyCode === window.util.ENTER_KEY_CODE) {
      if (!isPageActive) {
        activatePage();
      }
      fillAddressInput();
      window.load(window.pin.successLoadHandler, window.util.errorHandler);
    }
  });
})();
