import { describe, it } from 'mocha';
import { expect } from 'chai';
import readline from '../index';
import fs from 'fs';
import path from 'path';

describe('readline-promise tests', function () {
  it('reduce test', async function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    const total = await rlp.reduce((accum, line, index) => {
      expect(line).to.equal(String(index + 1));
      return accum + Number(line);
    }, 0);
    expect(total).to.equal(15);
  });

  it('each/forEach test', async function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    const lines = await rlp.each((line, index) => {
      expect(line).to.equal(String(index + 1));
    });
    expect(lines).to.equal(undefined);
  });

  it('map test', async function () {
    const filePath = path.resolve(__dirname, 'file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    const lines = await rlp.map((line, index) => {
      expect(line).to.equal(String(index + 1));
      return Number(line);
    });
    expect(lines).to.deep.equal([1, 2, 3, 4, 5]);
  });

  it('zero length test', async function () {
    const values = [ 'foo', '', 'bar', 'baz' ];
    const filePath = path.resolve(__dirname, 'zero-file.txt');
    const rlp = readline.createInterface({
      terminal: false,
      input: fs.createReadStream(filePath)
    });
    const lines = await rlp.map((line, index) => {
      expect(line).to.equal(values[index]);
      return line;
    });
    expect(lines).to.deep.equal(values);
  });

  it('questionAsync test', async function () {
    // this.timeout(10000);
    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    setTimeout(() => {
      rlp.write('pong\r');
    }, 100);

    const answer = await rlp.questionAsync('ping: ');
    expect(answer).to.equal('pong');
    rlp.close();
  });

  it('questionAsync terminal test', async function () {
    // this.timeout(10000);
    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: true,
    });

    setTimeout(() => {
      rlp.write('pong\r');
    }, 100);

    const answer = await rlp.questionAsync('ping: ');
    expect(answer).to.equal('pong');
    rlp.close();
  });

  it('await questionAsync terminal test', async function () {
    // this.timeout(10000);
    const rlp = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
    });

    setTimeout(() => {
      rlp.write('await pong\r');
    }, 250);

    const answer = await rlp.questionAsync('await ping: ');
    expect(answer).to.equal('await pong');
    rlp.close();
  });

  it('issue8 test', function () {
    const filePath = path.resolve(__dirname, 'input.example');
    const rlp = readline.createInterface({
        terminal: false,
        input: fs.createReadStream(filePath)
      });
      console.log('START');
      rlp.forEach((line, index) => {
        expect(line).to.equal('line' + String(index + 1));
      }).then(() => {
        console.log('DONE');
      });
  });
});
