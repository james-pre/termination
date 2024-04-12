import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { exec } from './system/lib/exec.js';

const tty = (globalThis.tty = new Terminal());
const fitAddon = new FitAddon();
tty.loadAddon(fitAddon);
tty.open(document.querySelector<HTMLDivElement>('#term'));
fitAddon.fit();

await exec('/sbin/init.js');
