'use strict';

(function () {
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var MAX_PIN_QUANTITY = 5;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var filterForm = document.querySelector('.map__filters');
  var housingTypeFilter = filterForm.querySelector('#housing-type');

  window.util.switchFormControls(filterForm, true);

  var successLoadHandler = function (data) {
    window.util.switchFormControls(filterForm, false);
    var filteredNotices = filterNotices(data);
    window.pin.renderPin(filteredNotices);

    housingTypeFilter.addEventListener('change', function () {
      cleanMap();
      window.pin.renderPin(filterNotices(data));
    });
  };

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

  var renderPin = function (pinData) {
    var fragment = document.createDocumentFragment();
    pinData.forEach(function (it, i) {
      var pin = mapPinTemplate.cloneNode(true);
      pin.style.left = (it.location.x - pinSize.WIDTH / 2) + 'px';
      pin.style.top = (it.location.y - pinSize.HEIGHT) + 'px';
      pin.querySelector('img').src = it.author.avatar;
      pin.querySelector('img').alt = it.offer.description;
      pin.addEventListener('click', function () {
        var cardActive = document.querySelector('.map .map__card');
        if (cardActive) {
          cardActive.remove();
        }
        window.card.renderCard(pinData[i]);
      });
      fragment.appendChild(pin);
    });
    pinList.appendChild(fragment);
  };

  window.pin = {
    filterForm: filterForm,
    successLoadHandler: successLoadHandler,
    cleanMap: cleanMap,
    renderPin: renderPin
  };
})();
