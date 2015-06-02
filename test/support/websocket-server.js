var WebSocketServer  = require('ws').Server;
var server = new WebSocketServer({ port: process.env.PORT || 3000 });

server.on('connection', function(socket) {
  socket.on('message', function(data) {
    socket.send(data);
  });
});
