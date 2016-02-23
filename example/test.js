var fs  = require('fs');
var rlp = require('../lib');


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