import { println } from 'lib:io';
import { env_get, env_keys, env_remove } from 'lib:env';

export function main(_: string, ...args: string[]): number {
	if(args.includes('-u') || args.includes('--unset')) {
		const name = args[(args.indexOf('-u') || args.indexOf('--unset')) + 1];
		env_remove(name);
		return 0;
	}

	for(const key of env_keys()) {
		println(`${key}=${env_get(key)}`);
	}
}
