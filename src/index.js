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
import AsyncIterator from './async-iterator';

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
