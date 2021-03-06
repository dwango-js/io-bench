var http = require('http');
var spawn = require('child_process').spawn;
var engine = require('engine.io');

describe('engine.io transport', function(done) {
  this.timeout(10000);

  before(function(done) {
    this.http = http.createServer();
    this.server = engine.attach(this.http);
    this.server.on('connection', function(socket) {
      socket.on('message', function(data) {
        socket.send(data);
      });
    });
    this.http.listen(8000, done);
  });

  after(function() {
    this.server.close();
    this.http.close(done);
  });

  it('should run bench', function(done) {
    var bench = spawn(__dirname + '/../bin/io-bench', ['-t', 'engine.io', 'http://localhost:8000'], { stdio: 'inherit' });
    bench.on('close', function(code) {
      done(code === 0 ? null : new Error('io-bench process exited with code: ' + code));
    });
  });
});
