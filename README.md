# readline-promise

A drop in replacement for readline with additional promise based methods like `map`, `reduce`, and `forEach`

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
## Extended API

`readline-promise` adds the following methods

### readline.createInterface(options) → rlp

* `options` <Object> - see [interface options](https://nodejs.org/api/readline.html#readline_readline_createinterface_options)

### rlp.forEach(iteratee) → undefined

Iterates through each line calling an `iteratee` function with the value. See [Array.forEach](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/forEach) documentation for details

* `iteratee` <Function>
  * `line` <*> - line value
  * `index` <Number> - the line index starting from 0
  * `lines` <Array<*>> - all current line values as an array

### rlp.each(iteratee) → undefined

Alias for `rlp.forEach`

### rlp.map(iteratee) → Array<*>

Performs a map operation using the iteratee function. See [Array.map](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/map) documentation for details

* `iteratee` <Function>
  * `line` <*> - line value
  * `index` <Number> - the line index starting from 0
  * `lines` <Array<*>> - all current line values as an array

### rlp.reduce(iteratee [, accumulator]) → *

Performs a reduce operation using the iteratee and optional accumulator/initial value. See [Array.reduce](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/reduce) documentation for details

* `iteratee` <Function>
  * `accumulator` <*> - accumulator value
  * `line` <*> - line value
  * `index` <Number> - the line index starting from 0
  * `lines` <Array<*>> - all current line values as an array
* `[accumulator]` <*> - Optional initial value

