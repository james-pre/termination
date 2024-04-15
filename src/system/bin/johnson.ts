import { println } from '../lib/io.js';

export function main(_: string, ...args: string[]): number {
	println(args.join(' '));
	return 0;
}
