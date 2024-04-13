import { cd } from 'lib:path';
import fs from 'lib:fs';

export async function main(_: string, dir: string = '.'): Promise<number> {
	await fs.promises.readdir(dir);
	cd(dir);
	return 0;
}
