import type { Terminal } from '@xterm/xterm';

export const tty: Terminal = globalThis.tty;

export function tty_lock(val?: number): number {
	if (!val) {
		return globalThis.tty_lock;
	}

	globalThis.tty_lock = val;
}

export function print(data: string): void {
	tty.write(data.replaceAll('\n', '\r\n'));
}

export function println(data: string): void {
	tty.writeln(data.replaceAll('\n', '\r\n'));
}
