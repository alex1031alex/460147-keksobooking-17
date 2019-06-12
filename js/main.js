document.querySelector('.map').classList.remove('map--faded');

var MIN_X = 0;
var MAX_X = 1200;
var MIN_Y = 130;
var MAX_Y = 630;
var PIN_WIDTH = 65;
var PIN_HEIGHT = 87;
var homeTypes = ['palace', 'flat', 'house', 'bungalo'];
var mapPinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');
var mapPinList = document.querySelector('.map__pins')

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

  noticeElement.style.left = (notice.location.x - PIN_WIDTH/2) + 'px';
  noticeElement.style.top = (notice.location.y - PIN_HEIGHT) + 'px';
  noticeElement.querySelector('img').src = notice.author.avatar;
  noticeElement.alt = 'объявление';

  return noticeElement;
};

var fillNoticeList = function (list, notices) {
  var fragment = document.createDocumentFragment();

  for (var j = 0; j < notices.length; j++) {
    fragment.appendChild(createNoticeElement(notices[j]));
  }

  list.appendChild(fragment);
};

fillNoticeList(mapPinList, similarNotices);
