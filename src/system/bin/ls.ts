import { join } from 'lib:path';
import fs from 'lib:fs';
import { println } from 'lib:io';

async function color(dir: string, entry: string): Promise<string> {
	try {
		const path = join(dir, entry);
		const stats = await fs.promises.lstat(await fs.promises.realpath(path));

		if (stats.isSymbolicLink()) {
			return `\x1b[36m${entry}\x1b[0m`;
		}
		
		if (stats.isDirectory()) {
			return `\x1b[34m${entry}\x1b[0m`;
		}

		if (entry.endsWith('.js')) {
			return `\x1b[32m${entry}\x1b[0m`;
		}

		return entry;
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
	for (const entry of await fs.promises.readdir(dir)) {
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
