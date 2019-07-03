var homeTypes = ['palace', 'flat', 'house', 'bungalo'];
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
