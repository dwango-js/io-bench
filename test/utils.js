var expect = require('expect.js');
var utils = require('../lib/utils');

describe('utils', function() {
  describe('toSecond()', function() {
    it('should convert hrtime to second', function() {
      expect(utils.toSecond([0, 123456789])).to.be(0.123456789);
    });
  });

  describe('toMillisecond()', function() {
    it('should convert hrtime to millisecond', function() {
      expect(utils.toMillisecond([0, 123456789])).to.be(123.456789);
    });
  });

  describe('min()', function() {
    it('should return the min value', function() {
      expect(utils.min([1, 3, 0, -1, 2])).to.be(-1);
    });
  });

  describe('max()', function() {
    it('should return the max value', function() {
      expect(utils.max([1, 3, 0, -1, 2])).to.be(3);
    });
  });

  describe('sum()', function() {
    it('should return sum', function() {
      expect(utils.sum([1, 3, 0, -1, 2])).to.be(5);
    });
  });

  describe('avg()', function() {
    it('should return avg', function() {
      expect(utils.avg([1, 3, 0, -1, 2])).to.be(1);
    });
  });

  describe('invert()', function() {
    it('should invert an Object Array to an Array Object', function() {
      expect(utils.invert([
        { foo: 1, bar: 'hello' },
        { foo: 2, bar: 'world' }
      ])).to.eql({
        foo: [1, 2],
        bar: ['hello', 'world']
      });
    });
  });
});
