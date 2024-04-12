import { join } from '../lib/path.js';
import { lstat, readdir, realpath } from '../lib/fs.js';
import { println } from '../lib/io.js';

async function color(dir: string, entry: string): Promise<string> {
	try {
		const path = join(dir, entry);
		const stats = await lstat(await realpath(path));

		const color = entry.endsWith('.js') ? 32 : stats.isDirectory() ? 34 : stats.isSymbolicLink() ? 36 : 0;

		return `\x1b[${color}m${entry}\x1b[0m`;
		/*if (stats.isDirectory()) {
			return `\x1b[34m${entry}\x1b[0m`;
		}

		if (entry.endsWith('.js')) {
			return `\x1b[32m${entry}\x1b[0m`;
		}*/

		//return entry;
	} catch (e) {
		return entry;
	}
}

export async function main(_: string, ...args: string[]): Promise<number> {
	args ||= ['.'];
	const list = args.includes('-l');

	if (list) {
		args.splice(args.indexOf('-l'), 1);
	}

	const dir = args.at(-1) || '.';

	const entries = [];
	for (const entry of await readdir(dir)) {
		const colored = await color(dir, entry);
		entries.push(colored);
	}

	if (!list) {
		println(entries.join(' '.repeat(4)));
		return 0;
	}

	for (const entry of entries) {
		println(entry);
	}

	return 0;
}
