import { println } from 'lib:io';

export function main(_: string, ...args: string[]): number {
	println(args.join(' '));
	return 0;
}
