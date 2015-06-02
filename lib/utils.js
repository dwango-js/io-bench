
exports.toSecond = function toSecond(hr) {
  return hr[0] + hr[1] / 1e9;
};

exports.toMillisecond = function toMillisecond(hr) {
  return hr[0] * 1e3 + hr[1] / 1e6;
};

exports.min = function min(arr) {
  var min = arr[0];
  var v;
  for (var i = 1, len = arr.length; i < len; i++) {
    v = arr[i];
    if (v < min) {
      min = v;
    }
  }
  return min;
};

exports.max = function min(arr) {
  var max = arr[0];
  var v;
  for (var i = 1, len = arr.length; i < len; i++) {
    v = arr[i];
    if (v > max) {
      max = v;
    }
  }
  return max;
};

exports.sum = function sum(arr) {
  return arr.reduce(function(a, b) {
    return a + b;
  }, 0);
};

exports.avg = function avg(arr) {
  var sum = exports.sum(arr);
  return sum / arr.length;
};

exports.invert = function invert(mapArr) {
  var obj = {};
  mapArr.forEach(function(map) {
    for (var k in map) {
      if (map.hasOwnProperty(k)) {
        (obj[k] = obj[k] || []).push(map[k]);
      }
    }
  });
  return obj;
};
