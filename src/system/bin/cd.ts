import { cd } from '../lib/path.js';

export function main(_: string, dir: string = '.'): number {
	cd(dir);
	return 0;
}
