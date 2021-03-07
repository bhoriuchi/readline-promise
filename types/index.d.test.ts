import readline from "readline-promise";

const rlp = readline.createInterface({ input: process.stdin, output: process.stdout });

// $ExpectType Promise<void>[]
rlp.each(async (_line: string, _index: number, _lines: string[]) => {});

// $ExpectError
rlp.each((_line: string, _index: number, _lines: string[]) => {});

// $ExpectType Promise<void>[]
rlp.forEach(async (_line: string, _index: number, _lines: string[]) => {});

// $ExpectError
rlp.forEach((_line: string, _index: number, _lines: string[]) => {});

// $ExpectType Promise<string>[]
rlp.map(async (line: string, _index: number, _lines: string[]) => line);

// $ExpectError
rlp.map((line: string, _index: number, _lines: string[]) => line);

// $ExpectType Promise<string>
rlp.questionAsync("Async?");

// $ExpectError
rlp.questionAsync(1234);

// $ExpectType Promise<string>
rlp.reduce(async (_accumulator: string, line: string, _index: number, _lines: string[]) => line, "initial");

// $ExpectError
rlp.reduce((_accumulator: string, line: string, _index: number, _lines: string[]) => line, "initial");
