io-bench
========

[![Build Status](https://travis-ci.org/dwango-js/io-bench.svg)](https://travis-ci.org/dwango-js/io-bench)

A benchmark tool fo socket.io, engine.io and websocket server.

```js
// socket.io server to test
var io = require('socket.io');
var server = io(8080);

server.on('connection', function(socket) {
  socket.on('message', function(data) {
    // echo data so that we can benchmark response time.
    socket.send(data);
  });
});
```

Running benchmark.

```sh
$ io-bench http://localhost:8080
```

## Installation

```sh
npm install -g io-bench
```

## Usage

```
Usage: io-bench [options] <url>

Options:

  -h, --help                       output usage information
  -n, --connections <connections>  number of connections to perform per worker
  -c, --concurrency <connections>  number of new connections to establish at a time per worker
  -m, --messages <messages>        messages to be sent per connection
  -R, --message-rate <rate>        number of messages to be sent per second
  -b, --buffer <size>              max size of a message
  -w, --workers <workers>          number of workers, default to numbers of CPU
  -p, --polling-rate <rate>        rate of polling (only for socket.io and engine.io)
  -s, --sync                       whether to wait all connections are established before sending messages
  -t, --transport <type>           transport type, one of socket.io, engine.io or websocket. default to socket.io
```

### Examples

Set number of connections and messages.

```sh
$ io-bench -n 100 -c 10 -m 1000 -R 30 http://localhost:8080
```

Change transport to use.

```sh
$ io-bench -t websocket http://localhost:8080
```

## License

MIT
