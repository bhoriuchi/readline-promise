# readline-promise

A drop in replacement for readline with additional promise based methods like `map`, `reduce`, and `forEach`. Uses a custom [AsyncIterator](https://github.com/tc39/proposal-async-iteration) implementation.

Note: If you were using `var readline = require('readline')`, change this to `var readline = require('readline-promise').default`.

## Example
```js
import readline from 'readline-promise';
import fs from 'fs';

const rlp = readline.createInterface({
  terminal: false,
  input: fs.createReadStream('data.txt')
});

rlp.forEach((line, index) => {
  console.log({ line, index });
});
```

## Example
```js
import readline from 'readline-promise';

const rlp = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: true
});

let bar = null;

rlp.questionAsync('Foo?').then(answer => {
  bar = answer;
});
```

## Extended API

`readline-promise` adds the following methods

### `readline.createInterface(options) → rlp`

Creates a new line reader Interface (`rlp`)

* `options` &lt;Object&gt; see [interface options](https://nodejs.org/api/readline.html#readline_readline_createinterface_options) for details

### `rlp.forEach(iteratee) → Promise<undefined>`

Iterates through each line calling an `iteratee` function with the value. See [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) documentation for details

* `iteratee` &lt;Function&gt;
  * `line` &lt;*&gt; - line value
  * `index` &lt;Number&gt; - the line index starting from 0
  * `lines` &lt;Array&lt;*&gt;&gt; - all current line values as an array

### `rlp.each(iteratee) → Promise<undefined>`

Alias for `rlp.forEach`

### `rlp.map(iteratee) → Promise<Array<*>>`

Performs a map operation using the iteratee function. See [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) documentation for details

* `iteratee` &lt;Function&gt;
  * `line` &lt;*&gt; - line value
  * `index` &lt;Number&gt; - the line index starting from 0
  * `lines` &lt;Array&lt;*&gt;&gt; - all current line values as an array

### `rlp.reduce(iteratee [, accumulator]) → Promise<*>`

Performs a reduce operation using the iteratee and optional accumulator/initial value. See [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) documentation for details

* `iteratee` &lt;Function&gt;
  * `accumulator` &lt;*&gt; - accumulator value
  * `line` &lt;*&gt; - line value
  * `index` &lt;Number&gt;- the line index starting from 0
  * `lines` &lt;Array&lt;*&gt;&gt; - all current line values as an array
* `[accumulator]` &lt;*&gt; - Optional initial value

### `rlp.questionAsync(query) → Promise<*>`

Performs a question that returns a Promise that resolves to the answer value

* `query` &lt;String&gt; - prompt text