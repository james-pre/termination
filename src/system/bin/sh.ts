import env, { get_cookie } from '../lib/env.js';
import { _exec_external, exec } from '../lib/exec.js';
import { ErrorStrings, fs, size_max } from '../lib/fs.js';
import { print, println, tty, tty_lock } from '../lib/io.js';
import { basename, parse, pwd, resolve } from '../lib/path.js';
import { current_user } from '../lib/user.js';

console.debug('sh@top');

const pid = Math.round(Math.random() * size_max);

/**
 * The index for which input is being shown
 */
let index: number = -1;

/**
 * The current, uncached input
 */
let currentInput: string = '';

/**
 * array of previous inputs
 */
const inputs: string[] = [];

let input: string = '';

let exit: () => void;

const can_exit: Promise<void> = new Promise(resolve => {
	exit = resolve;
});

async function prompt(): Promise<string> {
	const { name, home, uid } = await current_user();
	const cwd = pwd();
	return `[${name} ${cwd == home ? '~' : basename(cwd) || '/'}]${uid == 0 ? '#' : '$'} `;
}

async function clear(): Promise<void> {
	print('\x1b[2K\r' + (await prompt()));
}

async function on_data(data: string): Promise<void> {
	if (tty_lock() != pid) {
		return;
	}
	if (index == -1) {
		currentInput = input;
	}
	const promptLength = (await prompt()).length;
	const x = tty.buffer.active.cursorX - promptLength;
	switch (data) {
		case '\x1b[D':
		case '\x1b[C':
			print(data);
			break;
		case 'ArrowUp':
		case '\x1b[A':
			await clear();
			if (index < inputs.length - 1) {
				input = inputs[++index];
			}
			print(input);
			break;
		case 'ArrowDown':
		case '\x1b[B':
			await clear();
			if (index >= 0) {
				input = index-- == 0 ? currentInput : inputs[index];
			}
			print(input);
			break;
		case '\x7f':
			if (x <= 0) {
				return;
			}
			print('\b\x1b[P');
			input = input.slice(0, x - 1) + input.slice(x);
			break;
		case '\r':
			println('');
			if (input != inputs[0]) {
				inputs.unshift(input);
			}
			index = -1;
			await on_line(...input.split(/\s+/).filter(e => e));
			input = '';
			await clear();
			break;
		default:
			print(data);
			input = input.slice(0, x) + data + input.slice(x);
	}
}

async function on_line(...args: string[]): Promise<number> {
	if (args.length == 0) {
		return;
	}

	const command: string = args.shift();

	if (command == 'exit') {
		exit();
		return;
	}

	let path: string;

	for (const dir of env.get('PATH').split(':')) {
		try {
			for (const file of await fs.promises.readdir(dir)) {
				if (parse(file).name == command) {
					path = resolve(dir, file);
					break;
				}
			}
		} finally {
			// ignore directories that can't be stated
		}
	}

	for (const [i, arg] of args.entries()) {
		args[i] = arg.replaceAll(/\$([\w_]+)/gim, (_, key) => env.get(key));
	}

	if (!path) {
		println('Command does not exist');
		return 1;
	}

	try {
		const realpath = await fs.promises.realpath(path);
		if (realpath.startsWith('/sys/')) {
			await _exec_external('/system/' + realpath.slice('/sys/'.length), ...args);
		} else {
			await exec(path, ...args);
		}
	} catch (e) {
		println('errno' in e ? ErrorStrings[e.errno] : e.message);
	}
	tty_lock(pid);
}

console.debug('sh@main');

export async function main(_: string, ...args: string[]): Promise<number> {
	if (args[1] == '-c') {
		return await on_line(...args.slice(2));
	}
	tty.write('\x1b[4h');
	tty.focus();
	tty_lock(pid);
	const { dispose } = tty.onData(on_data);
	if ((await fs.promises.exists('/etc/motd')) && !get_cookie('battle_completed')) {
		const motd = await fs.promises.readFile('/etc/motd', 'utf8');
		println(motd);
	}
	await clear();
	await can_exit;
	dispose();
	return 0;
}
