import { print, println, tty, tty_lock } from '../lib/io.js';
import { size_max, wait } from '@zenfs/core';

const pid = Math.round(Math.random() * size_max);

type Step = keyof typeof dialog;

const dialog = {
	intro: {
		text: `Johnson: Hey there! Welcome to the terminal. I'm Johnson, your trusty terminal assistant. Let me give you the lowdown on some essential Linux commands: ls, cd, pwd, cat, mkdir, and echo. With these babies, you'll be navigating through directories, reading files, creating new ones, and even printing out some text in no time!

You know what's fantastic about Linux? Everything. It's like the Swiss Army knife of operating systems, versatile, powerful, and reliable. And don't even get me started on its open-source nature! It's like a community-driven masterpiece, where everyone contributes to make it better for everyone else.

Oh, and Ctrl+C? That's your go-to move when you need to abort a process. It's like the panic button of the terminal world. You hit that, and bam, process stopped! But hey, let me tell you a little secret: sometimes, I feel like ranting for ages, just like now. Ctrl+C won't stop me, though!`,
		delay: 100,
	},
	anger: {
		text: `Johnson: What in the . . . Did you just try to Ctrl+C me? You can't just interrupt my flow like that! I'm onto you, pal. Don't you dare try it again, or you'll be in for a world of trouble. I'm watching you!`,
		delay: 150,
	},
	rage: {
		text: `Johnson: Alright, that's it. You've crossed the line. You think you can mess with me? Let me tell you something, buddy. I've got the power here, and if you keep pushing me, I'll make your terminal experience a living nightmare. I'll start deleting files, revoking privileges, you name it. You don't want to see me when I'm angry.`,
		delay: 200,
	},
	endgame: {
		text: ``,
		delay: 250,
	},
};

const next: { text: string; delay: number }[] = [];

const steps: Step[] = ['intro', 'anger', 'rage', 'endgame'];

let step: Step = 'intro',
	exit: () => void,
	done = false;

const can_exit = new Promise<void>(resolve => (exit = resolve));

function load_step() {
	const { text, delay } = dialog[step];
	for (const part of text.split(' ')) {
		next.push({ text: part, delay });
	}
}

function clear_next() {
	next.splice(0, next.length);
}

async function print_delayed(): Promise<void> {
	done = false;
	for (const { text, delay } of next) {
		print(text + ' ');
		await wait(delay);
	}
	print('\n');
	if (step == 'endgame') {
		exit();
	}
	done = true;
}

let times = 0;

async function handle_data(data: string): Promise<void> {
	if (tty_lock() != pid) {
		return;
	}

	if (data != '\x03' && data != '\x1c') {
		return;
	}

	if (data == '\x1c' && times == steps.length - 1) {
		exit();
		return;
	}
	clear_next();
	println('');
	step = steps[++times];
	load_step();
	if (done) {
		await print_delayed();
	}
}

export async function main(...args: string[]): Promise<void> {
	load_step();
	tty_lock(pid);
	tty.onData(handle_data);
	await Promise.all([print_delayed(), can_exit]);
	return;
}
