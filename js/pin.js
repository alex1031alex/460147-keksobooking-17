'use strict';

(function () {
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var MIN_MIDDLE_PRICE = 10000;
  var MIN_HIGH_PRICE = 50000;
  var DEBOUNCE_INTERVAL = 500;
  var MAX_PIN_QUANTITY = 5;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');
  var filterForm = document.querySelector('.map__filters');
  var mapFilters = Array.from(filterForm.querySelectorAll('.map__filter'));
  var checkboxes = Array.from(filterForm.querySelectorAll('.map__features .map__checkbox'));
  var allFilters = mapFilters.concat(checkboxes);
  var housingTypeFilter = filterForm.querySelector('#housing-type');
  var priceFilter = filterForm.querySelector('#housing-price');
  var roomFilter = filterForm.querySelector('#housing-rooms');
  var guestFilter = filterForm.querySelector('#housing-guests');


  window.util.switchFormControls(filterForm, true);

  var successHandler = function (data) {
    window.util.switchFormControls(filterForm, false);
    var filteredNotices = filterNotices(data);
    render(filteredNotices);

    var changePins = function () {
      window.setTimeout(function () {
        cleanMap();
        render(filterNotices(data));
      }, DEBOUNCE_INTERVAL);
    };

    allFilters.forEach(function (it) {
      it.addEventListener('change', changePins);
      it.addEventListener('keydown', function (evt) {
        if (evt.keyCode === window.util.ENTER_KEY_CODE) {
          if (it.checked) {
            it.checked = false;
          } else {
            it.checked = true;
          }
          changePins();
        }
      });
    });
  };

  var errorHandler = function (message) {
    var errorTemplate = document.querySelector('#error').content.querySelector('.error');
    var errorModal = errorTemplate.cloneNode(true);
    var errorMessage = errorModal.querySelector('.error__message');
    var errorButton = errorModal.querySelector('.error__button');
    errorMessage.innerHTML += ('<br>' + message);
    document.querySelector('main').appendChild(errorModal);
    var closeModal = function () {
      errorModal.remove();
      document.removeEventListener('click', closeModal);
    };
    document.addEventListener('click', closeModal);
    errorButton.addEventListener('click', function () {
      errorModal.remove();
      window.load(successHandler, errorHandler);
    });
    document.addEventListener('keydown', window.util.createEscPressHandler(errorModal));
  };

  var cleanMap = function () {
    var pins = document.querySelectorAll('.map__pin:not(.map__pin--main)');
    if (pins) {
      pins.forEach(function (it) {
        it.remove();
      });
    }
    var activeCard = document.querySelector('.map .map__card');
    if (activeCard) {
      activeCard.remove();
    }
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
        return it.offer.price >= MIN_MIDDLE_PRICE && it.offer.price < MIN_HIGH_PRICE;
      } else if (priceFilter.value === 'low') {
        return it.offer.price < MIN_MIDDLE_PRICE;
      } else {
        return it.offer.price >= MIN_HIGH_PRICE;
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
    // Фильтрация по количеству отрисованных пинов
    var filterByPinQuantity = function (it, i) {
      return i < MAX_PIN_QUANTITY;
    };

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

  var render = function (pinData) {
    var fragment = document.createDocumentFragment();
    pinData.forEach(function (it, i) {
      var pin = mapPinTemplate.cloneNode(true);
      pin.style.left = (it.location.x - pinSize.WIDTH / 2) + 'px';
      pin.style.top = (it.location.y - pinSize.HEIGHT) + 'px';
      pin.querySelector('img').src = it.author.avatar;
      pin.querySelector('img').alt = it.offer.description;
      pin.addEventListener('click', function () {
        if (pinList.querySelector('.map__pin--active')) {
          pinList.querySelector('.map__pin--active').classList.remove('map__pin--active');
        }
        pin.classList.add('map__pin--active');
        var cardActive = document.querySelector('.map .map__card');
        if (cardActive) {
          cardActive.remove();
        }
        window.card.render(pinData[i]);
      });
      fragment.appendChild(pin);
    });
    pinList.appendChild(fragment);
  };

  window.pin = {
    filterForm: filterForm,
    successHandler: successHandler,
    errorHandler: errorHandler,
    cleanMap: cleanMap,
    render: render
  };
})();
