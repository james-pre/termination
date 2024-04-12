import fs from './fs.js';

import { cred } from '@zenfs/core/emulation/shared.js';
export { cred };

export interface User {
	name: string;
	uid: number;
	gid: number;
	description?: string;
	home: string;
	shell: string;
}

export const _root: User = {
	name: 'root',
	uid: 0,
	gid: 0,
	home: '/root',
	shell: '/bin/sh',
};

export async function get_users(): Promise<Set<User>> {
	const users = new Set<User>();
	const passwd = await fs.promises.readFile('/etc/passwd', 'utf8');
	for (const line of passwd.split('\n')) {
		const [name, , uid, gid, description, home, shell] = line.split(':');
		users.add({
			name,
			uid: +uid,
			gid: +gid,
			description,
			home,
			shell,
		});
	}
	return users;
}

export async function current_user(): Promise<User> {
	for (const user of await get_users()) {
		if (user.uid == cred.uid) {
			return user;
		}
	}
}

export async function get_user(param: string | number): Promise<User> {
	for (const user of await get_users()) {
		if (typeof param == 'string' && user.name == param) {
			return user;
		}
		if (typeof param == 'number' && user.uid == param) {
			return user;
		}
	}
}
