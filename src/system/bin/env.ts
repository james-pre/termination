import { println } from 'lib:io';
import env from 'lib:env';
import { parseArgs } from 'lib:args';

export function main(_: string, ...args: string[]): number {
	const { values: options, positionals: [key = null] } = parseArgs({
		options: {
			unset: { short: 'u', type: 'string' },
		},
		args,
	});

	if (options.unset) {
		env.delete(options.unset);
		return 0;
	}

	if(key) {
		println(`${key}=${env.get(key)}`);
		return 0;
	}

	for (const [key, value] of env.entries()) {
		println(`${key}=${value}`);
	}
}
