import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { set_user } from '../lib/user.js';

export async function main(...args: string[]) {
	const tty = (globalThis.tty = new Terminal());
	const fitAddon = new FitAddon();
	tty.loadAddon(fitAddon);
	tty.open(document.querySelector<HTMLDivElement>('#term'));
	fitAddon.fit();
	console.debug('init@set_user()');
	await set_user(0);
	const sh = await import('../bin/sh.js');
	console.debug('init@sh.main()');
	await sh.main('/bin/sh.js');
}
