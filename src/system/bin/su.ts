import { set_user } from '../lib/user.js';
import fs from '../lib/fs.js';

export async function main(_: string, name: string): Promise<number> {
	const user = await set_user(name);
	if (!(await fs.promises.exists(user.home))) {
		fs.promises.mkdir(user.home);
	}
	return 0;
}
