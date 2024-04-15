import { set_user } from 'lib:user';
import fs from 'lib:fs';

export async function main(_: string, name: string): Promise<number> {
	const user = await set_user(name);
	if (!(await fs.promises.exists(user.home))) {
		fs.promises.mkdir(user.home);
	}
	return 0;
}
