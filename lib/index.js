/**
 * Readline Promise
 * 
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * 
 */
var promise  = require('bluebird');
var readline = require('readline');


// calls the callback on each line then resolves the callbacks if they are promises
function each(cfg) {
	return function(callback) {
		return new promise(function(resolve, reject) {

			// create an array to store callbacks
			var rl, cbs = [];
			
			// create an interface
			try {
				rl = readline.createInterface(cfg);
			}
			catch(err) {
				return reject(err);
			}
			
			// handle a new line
			rl.on('line', function(line) {
				cbs.push(callback(line));
			});
			
			// handle close
			rl.on('close', function() {
				promise.all(cbs).then(function() {
					resolve({
						lines: cbs.length
					});
				})
				.caught(function(err) {
					reject(err);
				});
			});
		});
	};
}


// to make the usage similar to readline add a createInterface function
// that really just holds the real methods
function createInterface(cfg) {
	return {
		each: each(cfg)
	};
}


// export the module
module.exports = {
	createInterface: createInterface
};