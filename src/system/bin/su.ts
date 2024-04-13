import { set_user } from 'lib:user';
import fs from 'lib:fs';
import { exec } from 'lib:exec';

export async function main(_: string, name: string): Promise<number> {
	const user = await set_user(name);
	if (!(await fs.promises.exists(user.home))) {
		fs.promises.mkdir(user.home);
	}
	await exec('/bin/login');
	return 0;
}
