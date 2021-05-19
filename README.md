# PromiseParallelizer

promise-parallelizer
==========

A lightweight library to parallelize promises. 

<!-- TOC -->

- [Features](#features)
- [Installation](#installation)
- [Methods signatures](#methods-signatures)
- [Loading the module](#loading-the-module)
- [Common Usage](#common-usage)
    - [BATCH mode](#parallelize-promises-in-batch-mode)
    - [STREAMING mode](#parallelize-promises-in-streaming-mode)
- [License](#license)

<!-- /TOC -->

## Features
- Concurrency management ( scale the parallel promise executions according to the concurrency amount )
- Batch mode ( wait for all of the batch promises to complete before execute a new batch of promises )
- Streaming mode ( execute the promises as soon as the executing promises amount is under the concurrency parameter )
- Delay management between consecutives executions ( either between next batches or between next promise depending on the mode )
- Intermediary callback ( invoke a callback with the intermediary execution result at each batch end or promise end depending on the mode )

## Installation

```sh
$ npm install promise-parallelizer
```

## Methods signatures
```js
function parallelize(tasks, mode = "STREAMING", concurrency = 1, delay = 0, callback = null) Promise({ started: int, ended: int })
```

## Loading the module
```js
const promiseParallelizer = require('promise-parallelizer');
```

## Common Usage

#### Parallelize promises in BATCH mode

```js
const mode = "BATCH"
const concurrency = 3;
const tasks = [1,2,3,4,5,6].map(function(index) {
  return function () {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        counter++;
        resolve(index);
      }, 1000 * (index % 3 +1));
    });
  };
});
```

##### Standard
```js
(async function() {
  // all of the promises should be resolved after 6 seconds in BATCH mode
  const result = await promiseParallelizer.parallelize(tasks, "BATCH", 3);
})();
```

##### Using delay
```js
(async function() {
  // all of the promises should be resolved after 8 seconds in BATCH mode ( 2 seconds delay between consecutive batches)
  const result = await promiseParallelizer.parallelize(tasks, "BATCH", 3, 2);
})();
```

##### Using callback
```js
(async function() {
  // callback should log 2 times the intermediary result in BATCH mode  ( once after each batch )
  const result = await promiseParallelizer.parallelize(tasks, "BATCH", 3, 0, (intermediaryResult) => {
    console.log("intermediary result : " + intermediaryResult)
  });
})();
```

#### Parallelize promises in STREAMING mode
```js
const mode = "STREAMING"
const concurrency = 3;
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
```

##### Standard
```js
(async function() {
  // all of the promises should be resolved after 5 seconds in STREAMING mode
  const result = await promiseParallelizer.parallelize(tasks, "STREAMING", 3);
})();
```

##### Using delay
```js
(async function() {
  // all of the promises should be resolved after 6 seconds in STREAMING mode ( 2 seconds delay to flush after a promise ends)
  const result = await promiseParallelizer.parallelize(tasks, "STREAMING", 3, 2);
})();
```

##### Using callback
```js
(async function() {
  // callback should log 6 times the intermediary result in STREAMING mode  ( once at each promise resolution )
  const result = await promiseParallelizer.parallelize(tasks, "STREAMING", 3, 0, (intermediaryResult) => {
    console.log("intermediary result : " + intermediaryResult)
  });
})();
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-parallelizer
