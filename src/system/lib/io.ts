import type { Terminal } from '@xterm/xterm';

export const tty: Terminal = globalThis.tty;

export function print(data: string): void {
	tty.write(data);
}

export function println(data: string): void {
	tty.writeln(data);
}
