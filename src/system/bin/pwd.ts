import { pwd } from '../lib/path.js';
import { println } from '../lib/io.js';

export function main(): number {
	println(pwd());
	return 0;
}
