import { println } from 'lib:io';
import { current_user } from 'lib:user';

export async function main(): Promise<number> {
	try {
		const { name } = await current_user();
		println(name);
		return 0;
	} catch (e) {
		println('No user with current uid exists');
		return 1;
	}
}
