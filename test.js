const expect = require('chai').expect;
const index = require('./index')

describe('Parallelize', function() {
  this.timeout(60000)
  var counter = 0;

  const tasks = [1,2,3,4,5,6].map(function(value, index) {
    return function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          counter++;
          resolve(index);
        }, 1000 * (index % 3 + 1));
      });
    };
  })

  describe('BATCH MODE', function() {
    beforeEach(function() {
      counter = 0;
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) with concurrency of 3 : elapsed time should be of 6 seconds', async function() {
      const start = Date.now();
      await index.parallelize(tasks, "BATCH", 3);
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(6);
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) with concurrency of 3 : counter should have been incremented 6 times', async function() {  
      await index.parallelize(tasks, "BATCH", 3);
      expect(counter).to.equal(6)
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) with concurrency of 3 : results should be accurates', async function() {  
      const result = await index.parallelize(tasks, "BATCH", 3);
      expect(result).to.deep.equal({ started:6, ended:6 });
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) with concurrency of 3 and 2 seconds delay elapsed time should be of 8 seconds', async function() {  
      const start = Date.now();
      await index.parallelize(tasks, "BATCH", 3, 2);
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(8);
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) with concurrency of 3 and callback : callback should have been called 2 times', async function() {
      let calls = 0;
      await index.parallelize(tasks, "BATCH", 3, 0, () => {
        calls++;
      });
      expect(calls).to.equal(2);
    });
  });

  describe('STREAMING MODE', function() {
    beforeEach(function() {
      counter = 0;
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) with concurrency of 3 : elapsed time should be of 5 seconds', async function() {
      const start = Date.now();
      await index.parallelize(tasks, "STREAMING", 3);
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(5);
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) with concurrency of 3  : counter should have been incremented 6 times', async function() {  
      await index.parallelize(tasks, "STREAMING", 3);
      expect(counter).to.equal(6)
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) with concurrency of 3  : results should be accurates', async function() {  
      const result = await index.parallelize(tasks, "STREAMING", 3);
      expect(result).to.deep.equal({ started:6, ended:6 });
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) with concurrency of 3 and 2 seconds delay : elapsed time should be of 6 seconds', async function() {
      const start = Date.now();
      await index.parallelize(tasks, "STREAMING", 3, 2);
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(6);
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) with concurrency of 3 and callback : callback should have been called 6 times', async function() {
      let calls = 0;
      await index.parallelize(tasks, "STREAMING", 3, 0, () => {
        calls++;
      });
      expect(calls).to.equal(6);
    });
  });
});