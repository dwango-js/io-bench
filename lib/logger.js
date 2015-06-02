var util = require('util');
var Table = require('cli-table');
var utils = require('./utils');

module.exports = function(stream) {
  return new Logger(stream);
};

function Logger(stream) {
  this.stream = stream || process.stdout;
  this.start = process.hrtime();
}

Logger.prototype.intro = function(url, opts) {
  var out = [];
  out.push(util.format('Opens %d socket(s) %d at a time per worker (%d worker(s) available, %d % is polling)',
    opts.connections,
    opts.concurrency,
    opts.workers,
    opts.pollingRate * 100
  ));
  out.push(util.format('Sends %d message(s) per socket, %s per second (%d in total, max %d bytes)',
    opts.messages,
    opts.messageRate,
    opts.connections * opts.workers * opts.messages,
    opts.buffer
  ));
  out.push(opts.sync ? 'Waits for all connections are established' : 'Starts testing on each connection');
  out.push('');
  out.push(util.format('Connecting to %s', url));
  this.stream.write(out.join('\n') + '\n\n');
};

Logger.prototype.progress = function(data, msg) {
  var elapsed = utils.toSecond(this.elapse());
  var out = util.format('connecting=%d, connected=%d, finished=%d, connectErrors=%d, errors=%d (%d sec elapsed%s)',
    utils.sum(data.connecting),
    utils.sum(data.connected),
    utils.sum(data.finished),
    utils.sum(data.connectErrors),
    utils.sum(data.errors),
    Math.floor(elapsed * 1e3) / 1e3,
    msg ? ', ' + msg : ''
  );
  this.stream.write(out + '\n');
};

Logger.prototype.result = function(messageRates) {
  var concat = function(a, b) { return a.concat(b); };
  var rates = messageRates.reduce(concat);
  var table = new Table({ head: ['', 'Avg', 'Min', 'Max'] });
  table.push([
    'Messages sent per second/socket',
    rates.length ? utils.avg(rates) : 'N/A',
    rates.length ? utils.min(rates) : 'N/A',
    rates.length ? utils.max(rates) : 'N/A'
  ]);
  this.stream.write('\n');
  this.stream.write(table.toString() + '\n');
  this.stream.write('\n');
};

Logger.prototype.outro = function() {
  var out = util.format('Finished after %d sec', utils.toSecond(this.elapse()));
  this.stream.write(out + '\n');
};

Logger.prototype.elapse = function() {
  return process.hrtime(this.start);
};
