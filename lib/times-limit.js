var async = require('async');

module.exports = function timesLimit(count, limit, iterator, callback) {
  var counter = [];
  for (var i = 0; i < count; i++) {
    counter.push(i);
  }
  return async.mapLimit(counter, limit, iterator, callback);
};
