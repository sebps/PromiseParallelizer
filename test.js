const expect = require('chai').expect;
const index = require('./index')

describe('Parallelize', function() {
  this.timeout(10000)
  var counter = 0
  const tasks = [1,2,3,4,5,6].map(function(index) {
    return function () {
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          counter++;
          resolve(index);
        }, 1000 * (index % 3 +1));
      });
    };
  })

  describe('BATCH MODE', function() {
    beforeEach(function() {
      counter = 0;
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) : elapsed time should be of 6 seconds', async function() {
      const start = Date.now();
      await index.parallelize(tasks, 3, "BATCH");
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(6);
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) : counter should have been incremented 6 times', async function() {  
      await index.parallelize(tasks, 3, "BATCH");
      expect(counter).to.equal(6)
    });

    it('2 batches of 3 tasks ( of 1,2 and 3 seconds ) : results should be accurates', async function() {  
      const result = await index.parallelize(tasks, 3, "BATCH");
      expect(result).to.deep.equal({ started:6, ended:6 });
    });
  });

  describe('STREAMING MODE', function() {
    beforeEach(function() {
      counter = 0;
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) : elapsed time should be of 5 seconds', async function() {
      const start = Date.now();
      await index.parallelize(tasks, 3, "STREAMING");
      const end = Date.now();
      const elapsed = Math.floor((end - start)/1000);
      expect(elapsed).to.equal(5);
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) : counter should have been incremented 6 times', async function() {  
      await index.parallelize(tasks, 3, "STREAMING");
      expect(counter).to.equal(6)
    });

    it('6 tasks ( of 1, 2, 3, 1, 2 and 3 seconds ) : results should be accurates', async function() {  
      const result = await index.parallelize(tasks, 3, "STREAMING");
      expect(result).to.deep.equal({ started:6, ended:6 });
    });
  });
});