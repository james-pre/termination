import { println } from '../lib/io.js';
import env from '../lib/env.js';

export async function main(): Promise<number> {
	println(env.get('USER'));
	return 0;
}
