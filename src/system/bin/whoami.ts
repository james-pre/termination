import { println } from 'lib:io';
import env from '../lib/env.js';

export async function main(): Promise<number> {
	println(env.get('USER'));
	return 0;
}
