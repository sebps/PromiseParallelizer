function* execute(tasks) {
  var i = 0;
  while(i < tasks.length) {
    yield {
      task: tasks[i](),
      last: i == tasks.length - 1
    }
    i++;
  }
}

exports.parallelize = (tasks, mode = "STREAMING", concurrency = 1, delay = 0, callback = null) => {
  const generator = execute(tasks);
  var result = { started: 0, ended: 0, resolved: 0, rejected: 0 };
  var semaphore = 0;
  var resolved = false;

  return new Promise((resolve, reject) => {
    function finish() {
      // last check before resolving : all of the incoming tasks must have been processed 
      if(!resolved && result.ended == tasks.length) {
        resolve(result);
        resolved = true;
      }
    }

    function flush () {
      while(semaphore < concurrency) {
        let next = generator.next();

        // if no more tasks are to come finish the execution
        if(next.done) return finish();

        result.started++;
        semaphore++;

        next.value.task.then(()=>{
          result.resolved++;          
        }).catch(() => {
          result.rejected++;          
        }).finally(() => {
          semaphore--;
          result.ended++;

          switch(mode) {
            case "BATCH":
              // in BATCH mode : semaphore should be back to 0 before starting a new batch of tasks 
              if(semaphore == 0) {
                // if callback provided call it after each batch
                if(callback) {
                  callback(result);
                }

                // if no more tasks are to come finish the execution
                if(next.value.last) return finish();

                // delay the next batch of the provided delay            
                setTimeout(() => {
                  flush();
                }, delay * 1000);
              }
            break
            case "STREAMING":
              // in STREAMING mode : tasks are flushed as soon as the semaphore is under the max concurrency value
              
              // if callback provided call it at each resolution
              if(callback) {
                callback(result);
              }            
              
              // if no more tasks are to come finish the execution
              if(next.value.last) return finish();

              // delay the next flush of the provided delay 
              setTimeout(() => {
                flush();
              }, delay * 1000);
            break;
          };
        });
      }
    }

    flush();
  })
}