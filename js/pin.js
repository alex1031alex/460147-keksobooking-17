'use strict';

(function () {
  var pinSize = {
    WIDTH: 50,
    HEIGHT: 70
  };
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');

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
    renderPin: renderPin
  };
})();
