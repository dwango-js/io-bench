var http = require('http');
var spawn = require('child_process').spawn;
var io = require('socket.io');

describe('socket.io transport', function(done) {
  this.timeout(10000);

  before(function(done) {
    this.http = http.createServer();
    this.server = io(this.http);
    this.server.on('connection', function(socket) {
      socket.on('message', function(data, callback) {
        callback(data);
      });
    });
    this.http.listen(8000, done);
  });

  after(function() {
    this.http.close(done);
    try {
      this.server.close();
    } catch (e) {
      // pass through
      // an error throwen on node 0.10
    }
  });

  it('should run bench', function(done) {
    var bench = spawn(__dirname + '/../bin/io-bench', ['http://localhost:8000'], { stdio: 'inherit' });
    bench.on('close', function(code) {
      done(code === 0 ? null : new Error('io-bench process exited with code: ' + code));
    });
  });
});
