import { describe, it } from 'mocha';
import { expect } from 'chai';
import readline from '../index';
import fs from 'fs';
import path from 'path';

describe('readline-promise tests', function () {
  it('reduce test', function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    return rlp.reduce((accum, line, index) => {
      expect(line).to.equal(String(index + 1));
      return accum + Number(line);
    }, 0)
    .then(total => {
      expect(total).to.equal(15);
    });
  });

  it('each/forEach test', function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    return rlp.each((line, index) => {
      expect(line).to.equal(String(index + 1));
    })
    .then(lines => {
      expect(lines).to.equal(undefined);
    });
  });

  it('map test', function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    return rlp.map((line, index) => {
      expect(line).to.equal(String(index + 1));
      return Number(line);
    })
    .then(lines => {
      expect(lines).to.deep.equal([ 1, 2, 3, 4, 5 ]);
    });
  });

  it('questionAsync test', function () {
    // this.timeout(10000);
    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    setTimeout(() => {
      rlp.write('pong\r');
    }, 100);

    return rlp.questionAsync('ping: ')
      .then(answer => {
        expect(answer).to.equal('pong');
        rlp.close();
      });
  });

  it('questionAsync terminal test', function () {
    // this.timeout(10000);
    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    setTimeout(() => {
      rlp.write('pong\r');
    }, 100);

    return rlp.questionAsync('ping: ')
      .then(answer => {
        expect(answer).to.equal('pong');
        rlp.close();
      });
  });
});
