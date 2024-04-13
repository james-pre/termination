import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { exec } from 'lib:exec';
import { set_user } from 'lib:user';

export async function main(...cmdline: string[]) {
	const tty = (globalThis.tty = new Terminal());
	const fitAddon = new FitAddon();
	tty.loadAddon(fitAddon);
	tty.open(document.querySelector<HTMLDivElement>('#term'));
	fitAddon.fit();

	await set_user(0);
	await exec('/bin/sh.js');
}
