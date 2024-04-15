import { println } from '../lib/io.js';
import env from '../lib/env.js';
import { parseArgs } from '../lib/args.js';

export function main(_: string, ...args: string[]): number {
	const {
		values: options,
		positionals: [key = null],
	} = parseArgs({
		options: {
			unset: { short: 'u', type: 'string' },
		},
		args,
	});

	if (options.unset) {
		env.delete(options.unset);
		return 0;
	}

	if (key) {
		println(`${key}=${env.get(key)}`);
		return 0;
	}

	for (const [key, value] of env.entries()) {
		println(`${key}=${value}`);
	}
}
