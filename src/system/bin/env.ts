import { println } from 'lib:io';
import env from 'lib:env';
import { parseArgs } from '@pkgjs/parseargs';

export function main(_: string, ...args: string[]): number {
	const options = parseArgs({
		options: {
			unset: { short: 'u', type: 'string' },
		},
		args,
	}).values;

	if(options.unset) {
		env.delete(options.unset);
		return 0;
	}

	for (const [key, value] of env.entries()) {
		println(`${key}=${value}`);
	}
}
