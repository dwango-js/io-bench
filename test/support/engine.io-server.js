var engine = require('engine.io');
var server = engine.listen(process.env.PORT || 3000);

server.on('connection', function(socket) {
  socket.on('message', function(data) {
    socket.send(data);
  });
});
