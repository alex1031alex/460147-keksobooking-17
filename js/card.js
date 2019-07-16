'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var pinList = document.querySelector('.map__pins');
  var engToRus = {
    'flat': 'Квартира',
    'house': 'Дом',
    'bungalo': 'Бунгало',
    'palace': 'Дворец',
    'wifi': 'Вай Фай',
    'dishwasher': 'Посудомоечная машина',
    'parking': 'Парковка',
    'washer': 'Стиральная машина',
    'elevator': 'Лифт',
    'conditioner': 'Кондиционер'
  };

  var renderPin = function (pinData) {
    var fragment = document.createDocumentFragment();
    pinData.forEach(function (it) {
      var pin = mapPinTemplate.cloneNode(true);
      pin.style.left = (it.location.x - PIN_WIDTH / 2) + 'px';
      pin.style.top = (it.location.y - PIN_HEIGHT) + 'px';
      pin.querySelector('img').src = it.author.avatar;
      pin.querySelector('img').alt = it.offer.description;
      fragment.appendChild(pin);
    });
    pinList.appendChild(fragment);
  };

  var renderCard = function (cardData) {
    var card = cardTemplate.cloneNode(true);

    card.querySelector('.popup__title').textContent = cardData.offer.title;
    card.querySelector('.popup__text--address').textContent = cardData.offer.address;
    card.querySelector('.popup__text--price').innerHTML = cardData.offer.price + '&#8381' + '/ночь';
    card.querySelector('.popup__type').textContent = cardData.offer.type;
    card.querySelector('.popup__type').textContent = engToRus[cardData.offer.type];
    card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms +
    ' комнаты для ' + cardData.offer.guests + ' гостей.'
    card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin +
    ', выезд до ' + cardData.offer.checkout + '.';
    cardData.offer.features.forEach(function (it) {
      card.querySelector('.popup__feature--' + it).textContent = engToRus[it];
    });
    card.querySelector('.popup__description').textContent = cardData.offer.description;
    cardData.offer.photos.forEach(function (it, i) {
      if (i === 0) {
        card.querySelector('.popup__photo').src = it;
      } else {
        var newImg = card.querySelector('.popup__photo').cloneNode(true);
        newImg.src = it;
        card.querySelector('.popup__photos').appendChild(newImg);
      }
    });
    card.querySelector('.popup__avatar').src = cardData.author.avatar;

    var filtersContainer = document.querySelector('.map__filters-container');
    filtersContainer.insertAdjacentElement('beforeBegin', card);
  };

  window.card = {
    renderPin: renderPin,
    renderCard: renderCard
  };
})();
