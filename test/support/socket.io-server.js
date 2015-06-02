var io = require('socket.io');
var server = io(process.env.PORT || 3000);

server.on('connection', function(socket) {
  socket.on('message', function(data, callback) {
    if (callback) {
      callback(data);
    } else {
      socket.send(data);
    }
  });
});
