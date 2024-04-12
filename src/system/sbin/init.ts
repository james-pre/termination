import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { exec } from 'lib:exec';

export async function main(...cmdline: string[]) {

	const tty = (globalThis.tty = new Terminal());
	const fitAddon = new FitAddon();
	tty.loadAddon(fitAddon);
	tty.open(document.querySelector<HTMLDivElement>('#term'));
	fitAddon.fit();

	await exec('/bin/sh.js');
}
