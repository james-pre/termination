import { get_user } from 'lib:user';
import { setCred } from '@zenfs/core/emulation/shared.js';

export async function main(_: string, name: string) {
	const { uid, gid } = await get_user(name);

	setCred({ uid, gid, euid: uid, egid: gid, suid: uid, sgid: gid });
}
