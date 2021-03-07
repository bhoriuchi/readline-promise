import { Interface, ReadLineOptions } from "readline";

type AsyncIteratee<TReturn = void> = (
    line: string,
    index: number,
    lines: string[]
) => Promise<TReturn>;

interface AsyncInterface extends Interface {
    each: (iteratee: AsyncIteratee) => Array<Promise<void>>;
    forEach: (iteratee: AsyncIteratee) => Array<Promise<void>>;
    map: (iteratee: AsyncIteratee<string>) => Array<Promise<string>>;
    questionAsync: (question: string) => Promise<string>;
    reduce: (iteratee: (
        accumulator: string,
        line: string,
        index: number,
        lines: string[]
    ) => Promise<string>, accumulator?: string) => Promise<string>;
}

declare class ReadlinePromise extends Interface {
    createInterface(options: ReadLineOptions): AsyncInterface;
}

declare const readline: ReadlinePromise;

export { AsyncIteratee, AsyncInterface };
export default readline;
