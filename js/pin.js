'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var pinList = document.querySelector('.map__pins');

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

  window.pin = {
    renderPin: renderPin
  };
})();
