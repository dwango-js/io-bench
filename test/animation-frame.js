var expect = require('expect.js');
var AnimationFrame = require('../lib/animation-frame');

describe('AnimationFrame', function() {
  describe('#request()', function() {
    it('should continues to emit events', function(done) {
      var animationFrame = new AnimationFrame(60);
      var start = Date.now();
      var count = 0;

      animationFrame.request(function tick(time) {
        expect(time).to.be.greaterThan(0);
        count++;
        if (count < 10) {
          animationFrame.request(tick)
          return;
        }

        var elapsed = Date.now() - start;
        expect(elapsed).to.be.above(149);
        done();
      });
    });
  });

  describe('#cancel()', function() {
    it('should remove callbacks from queue', function(done) {
      var animationFrame = new AnimationFrame(60);

      function cb1() { cb1.called = true; }
      function cb2() { cb2.called = true; }
      function cb3() { cb3.called = true; }

      var handle1 = animationFrame.request(cb1);
      expect(handle1).to.be.ok();
      var handle2 = animationFrame.request(cb2);
      expect(handle2).to.be.ok();
      var handle3 = animationFrame.request(cb3);
      expect(handle3).to.be.ok();

      animationFrame.cancel(handle2);

      animationFrame.request(function() {
        expect(cb1.called).to.be.ok();
        expect(cb2.called).not.to.be.ok();
        expect(cb3.called).to.be.ok();
        done();
      });
    });
  });
});
