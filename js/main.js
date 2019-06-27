'use strict';

var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;
var PIN_WIDTH = 50;
var PIN_HEIGHT = 70;
var MAIN_PIN_WIDTH = 65;
var MAIN_PIN_HEIGHT = 65;
var homeTypes = ['palace', 'flat', 'house', 'bungalo'];
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPinList = document.querySelector('.map__pins');
var map = document.querySelector('.map');
var mapPin = document.querySelector('.map__pin--main');
var adForm = document.querySelector('.ad-form');
var filterForm = document.querySelector('.map__filters');
var addressInput = adForm.querySelector('#address');

var getRandomNumber = function (min, max) {
  var number = Math.floor(min + Math.random() * (max + 1 - min));
  return number;
};

var getRandomNotices = function (quantity) {
  var randomNotices = [];

  for (var i = 0; i < quantity; i++) {
    randomNotices[i] = {author: {}, offer: {}, location: {}};
    randomNotices[i].author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
    randomNotices[i].offer.type = homeTypes[getRandomNumber(0, homeTypes.length - 1)];
    randomNotices[i].location.x = getRandomNumber(MIN_X, MAX_X);
    randomNotices[i].location.y = getRandomNumber(MIN_Y, MAX_Y);
  }

  return randomNotices;
};

var similarNotices = getRandomNotices(8);

var createNoticeElement = function (notice) {
  var noticeElement = mapPinTemplate.cloneNode(true);

  noticeElement.style.left = (notice.location.x - PIN_WIDTH / 2) + 'px';
  noticeElement.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
  noticeElement.querySelector('img').src = notice.author.avatar;
  noticeElement.querySelector('img').alt = 'объявление';

  return noticeElement;
};

var fillNoticeList = function (list, notices) {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < notices.length; j++) {
    fragment.appendChild(createNoticeElement(notices[j]));
  }

  list.appendChild(fragment);
};

var switchFormControls = function (form, isDisabled) {
  var inputs = form.querySelectorAll('input');
  var selects = form.querySelectorAll('select');
  var textareas = form.querySelectorAll('textarea');
  var submit = form.querySelector('[type="submit"]');

  for (var i = 0; i < inputs.length; i++) {
    if (inputs[i] !== addressInput) {
      inputs[i].disabled = isDisabled;
    }
  }

  for (i = 0; i < selects.length; i++) {
    selects[i].disabled = isDisabled;
  }

  for (i = 0; i < textareas.length; i++) {
    textareas[i].disabled = isDisabled;
  }

  if (submit) {
    submit.disabled = isDisabled;
  }
};

switchFormControls(adForm, true);
switchFormControls(filterForm, true);

mapPin.addEventListener('click', function () {
  map.classList.remove('map--faded');
  adForm.classList.remove('ad-form--disabled');
  switchFormControls(adForm, false);
  switchFormControls(filterForm, false);
  addressInput.value = Math.round((parseInt(mapPin.style.left, 10) + MAIN_PIN_WIDTH / 2))
  + ', ' + Math.round((parseInt(mapPin.style.top, 10) + MAIN_PIN_HEIGHT / 2));
  fillNoticeList(mapPinList, similarNotices);
});

// Валидация формы
var homeTypeField = adForm.querySelector('#type');
var priceInput = adForm.querySelector('#price');
var timeinInput = adForm.querySelector('#timein');
var timeoutInput = adForm.querySelector('#timeout');

var setMinPrice = function (minPrice) {
  priceInput.min = String(minPrice);
  priceInput.placeholder = String(minPrice);
};

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
