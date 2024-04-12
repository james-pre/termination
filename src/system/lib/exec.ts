import { readFile, stat, X_OK } from './fs.js';

export async function _exec_external(url: string, ...args: string[]): Promise<number> {
	const module = await import(url);
	const main = 'main' in module ? module.main : module.default;
	return await main(url, ...args);
}

export async function exec(path: string, ...args: string[]): Promise<number> {
	const stats = await stat(path);
	if (!stats.isFile()) {
		return 1;
	}

	const contents = await readFile(path, { flag: X_OK, encoding: 'utf8' });

	return await _exec_external(URL.createObjectURL(new Blob([contents], { type: 'text/javascript' })), ...args);
}
