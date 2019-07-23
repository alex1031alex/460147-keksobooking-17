'use strict';

(function () {
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
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

  var renderCard = function (cardData) {
    var card = cardTemplate.cloneNode(true);

    if (cardData.offer.title) {
      card.querySelector('.popup__title').textContent = cardData.offer.title;
    } else {
      card.querySelector('.popup__title').remove();
    }

    if (cardData.offer.address) {
      card.querySelector('.popup__text--address').textContent = cardData.offer.address;
    } else {
      card.querySelector('.popup__text--address').remove();
    }

    if (cardData.offer.price) {
      card.querySelector('.popup__text--price').innerHTML = cardData.offer.price + '&#8381' + '/ночь';
    } else {
      card.querySelector('.popup__text--price').remove();
    }

    if (cardData.offer.type) {
      card.querySelector('.popup__type').textContent = engToRus[cardData.offer.type];
    } else {
      card.querySelector('.popup__type').remove();
    }

    if (cardData.offer.rooms && cardData.offer.guests) {
      card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms +
      ' комнаты для ' + cardData.offer.guests + ' гостей.';
    } else if (cardData.offer.rooms) {
      card.querySelector('.popup__text--capacity').textContent = cardData.offer.rooms + 'комнаты';
    } else {
      card.querySelector('.popup__text--capacity').remove();
    }

    if (cardData.offer.checkin && cardData.offer.checkout) {
      card.querySelector('.popup__text--time').textContent = 'Заезд после ' + cardData.offer.checkin +
      ', выезд до ' + cardData.offer.checkout + '.';
    } else {
      card.querySelector('.popup__text--time').remove();
    }

    cardData.offer.features.forEach(function (it) {
      card.querySelector('.popup__feature--' + it).textContent = engToRus[it];
    });

    var featureItems = Array.from(card.querySelectorAll('.popup__feature'));
    featureItems.forEach(function (it) {
      if (! it.textContent) {
        it.remove();
      }
    });

    if (cardData.offer.description) {
      card.querySelector('.popup__description').textContent = cardData.offer.description;
    } else {
      card.querySelector('.popup__description').remove();
    }

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

    var popupClose = card.querySelector('.popup__close');

    popupClose.addEventListener('click', function () {
      card.remove();
    });

    document.addEventListener('keydown', window.util.escPressHandlerMaker(card));
  };

  window.card = {
    renderCard: renderCard
  };
})();
