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
  var priceFilter = filterForm.querySelector('#housing-price');
  var roomFilter = filterForm.querySelector('#housing-rooms');
  var guestFilter = filterForm.querySelector('#housing-guests');
  var mapFilters = filterForm.querySelectorAll('.map__filter');
  var wifiFilter = filterForm.querySelector('[value="wifi"]');
  var checkboxes = Array.from(filterForm.querySelectorAll('.map__features .map__checkbox'));

  window.util.switchFormControls(filterForm, true);

  var successLoadHandler = function (data) {
    window.util.switchFormControls(filterForm, false);
    var filteredNotices = filterNotices(data);
    window.pin.renderPin(filteredNotices);

    housingTypeFilter.addEventListener('change', function () {
      cleanMap();
      renderPin(filterNotices(data));
    });
    priceFilter.addEventListener('change', function () {
      cleanMap();
      renderPin(filterNotices(data));
    });
    roomFilter.addEventListener('change', function () {
      cleanMap();
      renderPin(filterNotices(data));
    });
    guestFilter.addEventListener('change', function () {
      cleanMap();
      renderPin(filterNotices(data));
    });
    // checkboxes[0].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    // checkboxes[1].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    // checkboxes[2].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    // checkboxes[3].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    // checkboxes[4].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    // checkboxes[5].addEventListener('change', function () {
    //   cleanMap();
    //   renderPin(filterNotices(data));
    // });
    checkboxes.forEach(function (it) {
      it.addEventListener('change', function () {
        cleanMap();
        renderPin(filterNotices(data));
      })
    });
  };

  var cleanMap = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    pins.forEach(function (it) {
      it.remove();
    });
  };

  var filterNotices = function (notices) {
    // Фильтрация по типу жилья
    var filterByHousing = function (it) {
      if (housingTypeFilter.value === 'any') {
        return true;
      } else {
        return housingTypeFilter.value === it.offer.type;
      }
    };
    // Фильтрация по цене
    var filterByPrice = function (it) {
      if (priceFilter.value === 'any') {
        return true;
      } else if (priceFilter.value === 'middle') {
         return it.offer.price >= 10000 && it.offer.price < 50000;
      } else if (priceFilter.value === 'low') {
         return it.offer.price < 10000;
      } else if (priceFilter.value === 'high'){
        return it.offer.price >= 50000;
      }
    };
    // Фильтрация по числу комнат
    var filterByRoom = function (it) {
      if (roomFilter.value === 'any') {
        return true;
      } else {
        return Number(roomFilter.value) === it.offer.rooms;
      }
    };
    // Фильтрация по числу гостей
    var filterByGuest = function (it) {
      if (guestFilter.value === 'any') {
        return true;
      } else {
        return Number(guestFilter.value) === it.offer.guests;
      }
    };

    // Фильтрация по количеству отрисованных пинов
    var filterByPinQuantity = function (it, i) {
      return i < MAX_PIN_QUANTITY;
    };
    // Массив фильтров по дополнительным удобствам
    var featFilters = checkboxes.map(function (cbx) {
      return function (it) {
        if (cbx.checked) {
          return it.offer.features.some(function (feat) {
            return feat === cbx.value;
          });
        } else {
          return true;
        }
      };
    });

    var filteredNotices =
    notices.filter(filterByHousing)
    .filter(filterByPrice)
    .filter(filterByRoom)
    .filter(filterByGuest);

    for (var i = 0; i < featFilters.length; i++) {
      filteredNotices = filteredNotices.filter(featFilters[i]);
    }

    filteredNotices = filteredNotices.filter(filterByPinQuantity);
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
