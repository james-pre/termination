import fs from './fs.js';

export async function _exec_external(url: string, ...args: string[]): Promise<number> {
	const module = await import(url);
	const main = 'main' in module ? module.main : 'default' in module ? module.default : () => null;
	return await main(url, ...args);
}

export async function exec(path: string, ...args: string[]): Promise<number> {
	const stats = await fs.promises.stat(path);
	if (!stats.isFile()) {
		return 1;
	}

	const contents = await fs.promises.readFile(path, { flag: fs.constants.X_OK, encoding: 'utf8' });

	const url = URL.createObjectURL(new Blob([contents], { type: 'text/javascript' }));
	console.debug('exec()', path, url);
	return await _exec_external(url, ...args);
}
