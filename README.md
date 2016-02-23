

# readline-promise

Readline using promises. Nothing special.


## Example
```js
var rlp = require('readline-promise');
var fs  = require('fs');

// pass what you would normally pass to createInterface here
rlp.createInterface({
    terminal: false,
    input: fs.createReadStream('data.txt')
})
.each(function(line) {
    console.log('line:', line);
})
.then(function(count) {
    console.log(count);
})
.caught(function(err) {
    throw err;
});


```
