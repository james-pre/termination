import { cd } from '../lib/path.js';
import fs from '../lib/fs.js';

export async function main(_: string, dir: string = '.'): Promise<number> {
	await fs.promises.readdir(dir);
	cd(dir);
	return 0;
}
