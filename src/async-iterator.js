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

export default AsyncIterator;
