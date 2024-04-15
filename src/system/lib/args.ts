import './_global.js';
export { parseArgs } from '@pkgjs/parseargs';

export function parse_init(args: string[]): Map<string, string> {
	const parsed = new Map();
	for (const arg of args) {
		const [key, value = ''] = arg.split('=', 2);
		parsed.set(key, value);
	}
	return parsed;
}

export function cmdline(): Map<string, string> {
	return globalThis.cmdline;
}
