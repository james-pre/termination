import fs from 'lib:fs';
import { println } from 'lib:io';

export async function main(_: string, dir: string): Promise<number> {
	if (!dir) {
		println('No directory specified');
		return 1;
	}
	await fs.promises.mkdir(dir);
	return 0;
}
