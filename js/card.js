'use strict';

(function () {
  var PIN_WIDTH = 50;
  var PIN_HEIGHT = 70;
  var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
  var noticeList = document.querySelector('.map__pins');

  var createNoticeElement = function (notice) {
    var noticeElement = mapPinTemplate.cloneNode(true);

    noticeElement.style.left = (notice.location.x - PIN_WIDTH / 2) + 'px';
    noticeElement.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
    noticeElement.querySelector('img').src = notice.author.avatar;
    noticeElement.querySelector('img').alt = 'объявление';

    return noticeElement;
  };

  var fillNoticeList = function (notices) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < notices.length; i++) {
      fragment.appendChild(createNoticeElement(notices[i]));
    }

    noticeList.appendChild(fragment);
  };

  window.card = {
    fillNoticeList: fillNoticeList,
  };
})();
