import { cd as _cd, cwd } from '@zenfs/core/emulation/path.js';

import env from './env.js';

_cd(env.get('PWD') || '');

export { dirname, parse, format, extname, basename, resolve, relative, join } from '@zenfs/core/emulation/path.js';

export function cd(path: string) {
	_cd(path);
	env.set('PWD', cwd);
}

export function pwd(): string {
	return env.get('PWD') || '/';
}
