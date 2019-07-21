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
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');

  var setMinPrice = function (minPrice) {
    priceInput.min = String(minPrice);
    priceInput.placeholder = String(minPrice);
  };

  window.util.switchFormControls(adForm, true);

  homeTypeField.addEventListener('input', function () {
    switch (homeTypeField.value) {
      case 'bungalo':
        setMinPrice(0);
        break;
      case 'flat':
        setMinPrice(1000);
        break;
      case 'house':
        setMinPrice(5000);
        break;
      case 'palace':
        setMinPrice(10000);
    }
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

  var successSaveHandler = function () {
    var successModal = successMessageTemplate.cloneNode(true);
    document.querySelector('main').appendChild(successModal);
    successModal.addEventListener('click', function () {
      successModal.remove();
    });
    document.addEventListener('keydown', window.util.escPressHandlerMaker(successModal));
    window.form.deactivatePage();
  };

  adForm.addEventListener('submit', function (evt) {
    window.form.addressInput.disabled = false;
    window.save(new FormData(adForm), successSaveHandler, window.util.errorHandler);
    evt.preventDefault();
  });

  window.form = {
    adForm: adForm,
    addressInput: addressInput,
    deactivatePage: deactivatePage
  };

  return window.form.deactivatePage;
})();
