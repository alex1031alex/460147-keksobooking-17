'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var addressInput = adForm.querySelector('#address');
  var homeTypeField = adForm.querySelector('#type');
  var priceInput = adForm.querySelector('#price');
  var timeinInput = adForm.querySelector('#timein');
  var timeoutInput = adForm.querySelector('#timeout');
  var roomInput = adForm.querySelector('#room_number');
  var guestInput = adForm.querySelector('#capacity');
  var resetButton = adForm.querySelector('.ad-form__reset');
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');
  var Price = {
    BUNGALO: 0,
    FLAT: 1000,
    HOUSE: 5000,
    PALACE: 10000
  };

  var setMinPrice = function () {
    var homeType = homeTypeField.value.toUpperCase();
    priceInput.min = Price[homeType];
    priceInput.placeholder = Price[homeType];
  };

  setMinPrice();
  window.util.switchFormControls(adForm, true);

  homeTypeField.addEventListener('input', function () {
    setMinPrice();
  });

  timeinInput.addEventListener('input', function () {
    timeoutInput.value = timeinInput.value;
  });

  timeoutInput.addEventListener('input', function () {
    timeinInput.value = timeoutInput.value;
  });

  var checkGuestNumber = function () {
    if (Number(roomInput.value) === 100 && Number(guestInput.value) !== 0) {
      guestInput.setCustomValidity('Если количество комнат равно 100 выберите вариант Не для гостей');
    } else if (Number(roomInput.value) < Number(guestInput.value)) {
      guestInput.setCustomValidity('Количество комнат не должно превышать количество гостей.' +
        'Выберите другой вариант');
    } else if (Number(roomInput.value) < 100 && Number(guestInput.value) === 0) {
      guestInput.setCustomValidity('Если Вы хотите указать количество мест "Не для гостей",' +
        ' выберите вариант 100 комнат в поле "Кол-во комнат". В противном случае укажите количество гостей.');
    } else {
      guestInput.setCustomValidity('');
    }
  };

  checkGuestNumber();

  roomInput.addEventListener('input', function () {
    checkGuestNumber();
  });
  guestInput.addEventListener('input', function () {
    checkGuestNumber();
  });

  var deactivatePage = function () {};

  var successHandler = function () {
    var successModal = successMessageTemplate.cloneNode(true);
    document.querySelector('main').appendChild(successModal);
    successModal.addEventListener('click', function () {
      successModal.remove();
    });
    document.addEventListener('keydown', window.util.escPressHandlerMaker(successModal));
    window.form.deactivatePage();
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
      window.save(new FormData(adForm), successHandler, errorHandler);
    });
    document.addEventListener('keydown', window.util.escPressHandlerMaker(errorModal));
  };

  adForm.addEventListener('submit', function (evt) {
    window.form.addressInput.disabled = false;
    window.save(new FormData(adForm), successHandler, errorHandler);
    evt.preventDefault();
  });

  resetButton.addEventListener('click', function (evt) {
    evt.preventDefault();
    window.form.deactivatePage();
  });

  window.form = {
    adForm: adForm,
    addressInput: addressInput,
    deactivatePage: deactivatePage
  };

  return window.form.deactivatePage;
})();
