import fs, { InMemory, configure, resolveMountConfig } from '@zenfs/core';
import { exists, mkdir, readdir, symlink } from '@zenfs/core/emulation/promises.js';
import { IndexedDB, WebStorage } from '@zenfs/dom';
import { Fetch } from '@zenfs/fetch';
import { join } from './path.js';

const fetchfs = await resolveMountConfig({ backend: Fetch, baseUrl: '/system' });

export const prefixUrl = fetchfs.prefixUrl;

await configure({
	'/': WebStorage,
	'/sys': fetchfs,
	'/home': IndexedDB,
	'/tmp': InMemory,
});

for (const dir of await readdir('/sys')) {
	if (!(await exists('/' + dir))) {
		symlink(join('/sys', dir), '/' + dir);
	}
}

for (const dir of ['/root']) {
	if (!(await exists(dir))) {
		mkdir(dir);
	}
}

export * from '@zenfs/core';
export default fs;
