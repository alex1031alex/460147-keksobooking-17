'use strict';

(function () {
  var MAIN_PIN_WIDTH = 65;
  var MAIN_PIN_HEIGHT = 87;
  var map = document.querySelector('.map');
  var mainMapPin = document.querySelector('.map__pin--main');
  var mapPinList = document.querySelector('.map__pins');
  var isPageActive = false;

  var activatePage = function () {
    window.form.switchFormControls(window.form.adForm, false);
    window.form.switchFormControls(window.form.filterForm, false);
    map.classList.remove('map--faded');
    window.form.adForm.classList.remove('ad-form--disabled');
  };

  window.form.addressInput.value = Math.round((parseInt(mainMapPin.style.left, 10) + MAIN_PIN_WIDTH / 2))
  + ', ' + Math.round((parseInt(mainMapPin.style.top, 10) + MAIN_PIN_HEIGHT / 2));

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

      var similarNotices = window.data.getRandomNotices(8);
      window.card.fillNoticeList(mapPinList, similarNotices);

      document.removeEventListener('mousemove', mouseMoveHandler);
      document.removeEventListener('mouseup', mouseUpHandler);
    };

    document.addEventListener('mousemove', mouseMoveHandler);
    document.addEventListener('mouseup', mouseUpHandler);
  });
})();
