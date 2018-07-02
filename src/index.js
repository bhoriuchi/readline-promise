/**
 * Readline Promise
 *
 * @author Branden Horiuchi <bhoriuchi@gmail.com>
 * @license MIT
 * @description Provides a drop-in replacement for
 * readline with additional Promise based functions.
 * uses an async iterator to iterate through the lines
 * as they are read
 *
 */
import readline from 'readline';

/**
 * Credits
 * https://github.com/graphql/graphql-js/blob/master
 * /src/subscription/__tests__/eventEmitterAsyncIterator.js
 * https://github.com/leebyron/iterall/
 */
const SYMBOL_ASYNC_ITERATOR = typeof Symbol === 'function' &&
  Symbol.asyncIterator;
const $$asyncIterator = SYMBOL_ASYNC_ITERATOR || '@@asyncIterator';

class AsyncIteratorBacking {
  constructor(values) {
    this.done = false;
    this.dataQueue = Array.isArray(values) ? values.slice() : [];
    this.awaitQueue = [];

    if (Array.isArray(values)) {
      values.length = 0;
      values.push = value => this._push(value);
    }
  }

  iterator() {
    const _this = this;
    const iterator = {
      next() {
        return _this.done ? iterator.return() : _this._next();
      },
      return() {
        _this._end();
        return Promise.resolve({ value: undefined, done: true });
      },
      throw(error) {
        _this._end();
        return Promise.reject(error);
      },
      [$$asyncIterator]() {
        return iterator;
      }
    };
    return iterator;
  }

  _push(value) {
    return this._pushValue(value);
  }

  _pushValue(value) {
    return this.awaitQueue.length ?
      this.awaitQueue.shift()({ value, done: false }) :
      this.dataQueue.push(value);
  }

  _next() {
    return new Promise(resolve => {
      if (this.dataQueue.length) {
        return resolve({
          value: this.dataQueue.shift(),
          done: false
        });
      } else if (this.done) {
        return resolve({
          value: undefined,
          done: true
        });
      }
      this.awaitQueue.push(resolve);
    });
  }

  _end() {
    if (!this.done) {
      this.done = true;
      this.awaitQueue.forEach(resolve => {
        resolve({ value: undefined, done: true });
      });
      this.awaitQueue.length = 0;
      this.dataQueue.length = 0;
    }
  }
}

class AsyncIterator {
  constructor(...args) {
    return new AsyncIteratorBacking(...args).iterator();
  }
}

AsyncIterator.fromStream = (stream, options) => {
  const array = [];
  const opts = Object.assign({}, options);
  const DATA = opts.dataEvent || 'data';
  const CLOSE = opts.closeEvent || 'close';
  const backing = new AsyncIteratorBacking(array, opts);
  stream.on(DATA, value => array.push(value));
  stream.on(CLOSE, () => {
    backing.done = true;
  });
  return backing.iterator();
};

/**
 * Extends the readline Interface class with additional methods
 * that use native Promise objects to perform async operations
 */
class Interface extends readline.Interface {
  constructor(input, output, completer, terminal) {
    super(input, output, completer, terminal);
  }

  /**
   * Alias for forEach (backward compatibility)
   * @param {*} iteratee
   */
  each(iteratee) {
    return this.forEach(iteratee);
  }

  /**
   * Iterates over each line and invokes the iteratee
   * @param {*} iteratee
   */
  forEach(iteratee) {
    return this.reduce((accum, current, index, lines) => {
      iteratee(current, index, lines);
      return accum;
    });
  }

  /**
   * performs a map operation on the lines
   * @param {*} iteratee
   */
  map(iteratee) {
    return this.reduce((accum, current, index, lines) => {
      accum.push(iteratee(current, index, lines));
      return accum;
    }, []);
  }

  /**
   * Performs a reduce operation on the lines
   * @param {*} iteratee
   * @param {*} accumulator
   */
  reduce(iteratee, accumulator) {
    if (typeof iteratee !== 'function') {
      throw new Error('iteratee should be a function');
    }
    const values = [];
    const iterator = AsyncIterator.fromStream(this, {
      dataEvent: 'line'
    });

    return Promise.resolve(accumulator)
      .then(resolvedAccumulator => {
        let accum = resolvedAccumulator;
        const reducer = () => {
          return iterator
            .next()
            .then(({ value, done }) => {
              if (!done) {
                const index = values.length;
                values.push(value);
                accum = iteratee(accum, value, index, values);
                return reducer();
              }
              return accum;
            });
        };
        return reducer();
      });
  }

  /**
   * Asks a question returns a promise
   * @param {*} query
   */
  questionAsync(query) {
    return new Promise(resolve => {
      this.question(query, resolve);
    });
  }
}

/**
 * Export an extended readline instance so
 * that it can be used as a drop in replacement
 */
export default Object.assign({}, readline, {
  Interface,
  createInterface(...args) {
    return new Interface(...args);
  }
});
