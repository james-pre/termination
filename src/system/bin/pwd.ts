import { pwd } from 'lib:path';
import { println } from 'lib:io';

export function main(): number {
	println(pwd());
	return 0;
}
