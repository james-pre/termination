import { println } from '../lib/io.js';
import fs from '../lib/fs.js';

export async function main(_: string, file: string): Promise<number> {
	const contents = await fs.promises.readFile(file, 'utf-8');
	for (const line of contents.split('\n')) {
		println(line);
	}
	return 0;
}
