import { println } from '../lib/io.js';

export function main(_: string, ...data: string[]): number {
	println(data.join(' '));
	return 0;
}
