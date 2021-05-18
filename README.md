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

## Installation

```sh
$ npm install promise-parallelizer
```

## Methods signatures
```js
function parallelize(tasks, concurrency, mode) Promise
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

(async function() {
  // all of the promises should be resolved after 6 seconds in BATCH mode
  await promiseParallelizer.parallelize(tasks, 3, "BATCH");
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

(async function() {
  // all of the promises should be resolved after 5 seconds in STREAMING mode
  await promiseParallelizer.parallelize(tasks, 3, "STREAMING");
})();
```

## License

MIT

[npm-url]: https://www.npmjs.com/package/promise-parallelizer
