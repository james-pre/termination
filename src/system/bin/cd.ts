import { cd } from 'lib:path';

export function main(_: string, dir: string = '.'): number {
	cd(dir);
	return 0;
}
