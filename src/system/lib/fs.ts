import { InMemory, configure, resolveBackend } from '@zenfs/core';
import { exists, mkdir, readdir, symlink } from '@zenfs/core/emulation/promises.js';
import { IndexedDB, Storage } from '@zenfs/dom';
import { Fetch } from '@zenfs/fetch';
import { join } from './path.js';

export * from '@zenfs/core';
export * from '@zenfs/core/emulation/constants.js';
export * from '@zenfs/core/emulation/promises.js';

const fetchfs = await resolveBackend({ backend: Fetch, baseUrl: `//${location.host}/dist/system` });

export const prefixUrl = fetchfs.prefixUrl;

await configure({
	'/': Storage,
	'/sys': fetchfs,
	'/home': IndexedDB,
	'/tmp': InMemory,
});

for (const dir of await readdir('/sys')) {
	if (!(await exists(dir))) {
		symlink(join('/sys', dir), dir);
	}
}

for (const dir of ['/root']) {
	if (!(await exists(dir))) {
		mkdir(dir);
	}
}
