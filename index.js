function* execute(tasks) {
  var i = 0;
  while(i < tasks.length) {
    yield tasks[i]();
    i ++;
  }
}

exports.parallelize = (tasks, concurrency, mode) => {
  const generator = execute(tasks);
  var next = { value: null, done: false };
  var result = { started: 0, ended: 0};
  var semaphore = 0;

  return new Promise((resolve, reject) => {
    function finish() {
      // last check before resolving : all of the incoming tasks must have been processed 
      if(result.ended == tasks.length) {
        resolve(result);
      }
    }

    function flush () {
      while(semaphore < concurrency) {
        next = generator.next();

        if(next.done) return finish();

        result.started++;
        semaphore++;

        next.value.then((res) => {
          semaphore--;
          result.ended++;

          switch(mode) {
            case "BATCH":
              // in BATCH mode : semaphore should be back to 0 before starting a new batch of tasks 
              if(semaphore == 0) flush();
            break
            case "STREAMING":
              // in STREAMING mode : tasks are flushed as soon as the semaphore is under the max concurrency value
              flush();
            break;
          };
        });
      }
    }

    flush();
  })
}