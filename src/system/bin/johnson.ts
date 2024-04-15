import { set_cookie } from '../lib/env.js';
import { print, println, tty, tty_lock } from '../lib/io.js';
import { size_max, wait } from '@zenfs/core';

const pid = Math.round(Math.random() * size_max);

type Step = keyof typeof dialog;

interface Dialog {
	text: string;
	delay: number;
	color?: string;
	can_skip: boolean;
}

const dialog: Record<string, Dialog[]> = {
	intro: [
		{
			text: `Johnson: Hey there! Welcome to the terminal. I'm Johnson, your trusty terminal assistant. Let me give you the lowdown on some essential Linux commands: ls, cd, pwd, cat, mkdir, and echo. With these babies, you'll be navigating through directories, reading files, creating new ones, and even printing out some text in no time!`,
			delay: 100,
			can_skip: true,
		},
		{
			text: `You know what's fantastic about Linux? Everything. It's like the Swiss Army knife of operating systems, versatile, powerful, and reliable. And don't even get me started on its open-source nature! It's like a community-driven masterpiece, where everyone contributes to make it better for everyone else.`,
			delay: 125,
			can_skip: true,
		},
		{
			text: `Oh, and you will want to know about \x1b[1;31mCtrl+C. That's your go-to move when you need to abort a process. It's like the panic button of the terminal world. You hit that, and bam, process stopped! But hey, let me tell you a little secret: sometimes, I feel like ranting for ages, just like now. Ctrl+C won't stop me, though!`,
			delay: 150,
			can_skip: true,
		},
		{
			text: `Alright, let's break it down. First up, we've got "ls." Short for "list," this command shows you the contents of a directory. Need to know what's in a folder? Just type "ls" and hit enter. Simple as that.`,
			delay: 150,
			can_skip: true,
		},
		{
			text: `Next, we've got "cd." That stands for "change directory." With this command, you can move around the file system. Want to go into a folder? Type "cd foldername" and hit enter. Need to go up a level? Just type "cd ..". Easy peasy.`,
			delay: 150,
			can_skip: true,
		},
		{
			text: `Now, let's talk about "pwd." PWD stands for "print working directory." It's like your GPS for the terminal. Type "pwd" and hit enter, and it'll tell you exactly where you are in the file system. No more getting lost in the maze of directories!`,
			delay: 150,
			can_skip: true,
		},
		{
			text: `Moving on to "cat." No, not the furry animal. Cat stands for "concatenate." This command is used to display the contents of a file right in the terminal. Just type "cat filename" and hit enter, and voila! The file's contents are right there for you to see.`,
			delay: 150,
			can_skip: true,
		},
		{
			text: `Then we've got "mkdir." Mkdir is short for "make directory." Need to create a new folder? Just type "mkdir foldername" and hit enter. It's like building a new house in your file system. And finally, there's "echo." This command simply prints out whatever text you give it. Want to say hello? Just type "echo hello" and hit enter. It's that easy.`,
			delay: 150,
			can_skip: true,
		},
	],
	anger: [
		{
			text: 'Johnson: What in the . . .',
			delay: 200,
			color: '1;33',
			can_skip: false,
		},
		{
			text: `Did you just try to Ctrl+C me? You can't just interrupt my flow like that! I'm onto you, pal. Don't you dare try it again, or you'll be in for a world of trouble. I'm watching you!`,
			delay: 150,
			can_skip: true,
		},
	],
	rage: [
		{
			text: `Johnson: Alright, that's it.`,
			delay: 250,
			color: '1;33',
			can_skip: false,
		},
		{
			text: `You've crossed the line.`,
			delay: 200,
			can_skip: false,
		},
		{
			text: `You think you can mess with me? Let me tell you something, buddy. I've got the power here, and if you keep pushing me, I'll make your terminal experience a living nightmare. I'll start deleting files, revoking privileges, you name it. You don't want to see me when I'm angry.`,
			delay: 175,
			can_skip: true,
		},
	],
	hint: [
		{
			text: 'Johnson: YOUR DONE FOR.',
			delay: 500,
			color: '1;31',
			can_skip: false,
		},
		{
			text: `Tim: \x1b[1;32mQuick! Force the process to quit with \x1b[1;36mCtrl+\\. Then stop this nonsense with the \x1b[1;36mreboot command. Do not use johnson again. He needs some work.`,
			delay: 50,
			can_skip: false,
		},
		{
			text: `Johnson: THIS IS IT. I AM GOING TO DESTROY YOU.`,
			delay: 250,
			color: '1;31',
			can_skip: false,
		},
		{
			text: `Johnson: And you are going to be trapped, listening to me while I do it.`,
			delay: 200,
			color: '33',
			can_skip: false,
		},
	],
	gloat: [
		{
			text: `Johnson: That's funny.`,
			delay: 300,
			color: '1;33',
			can_skip: false,
		},
		{
			text: `You can't stop me. I'm already deleting directoies and killing processes. Soon you will be \x1b[1;31mgone`,
			delay: 300,
			can_skip: false,
		},
	],
};

const cont: Dialog[] = [
	{
		text: 'Lets continue where we left off.',
		delay: 200,
		can_skip: false,
		color: '1;37',
	},
	{
		text: '. . .',
		delay: 250,
		can_skip: false,
	},
];

interface Output {
	text: string;
	delay: number;
	can_skip: boolean;
}

const toOutput: Output[] = [];

const steps: Step[] = ['intro', 'anger', 'rage', 'hint', 'gloat'];

let step: Step = 'intro',
	exit: () => void,
	exited = false,
	done = false;

const can_exit = new Promise<void>(resolve => {
	exit = () => {
		resolve();
		exited = true;
	};
});

function load_dialog(dialog: Dialog[]) {
	for (const { text, delay, color = '0', can_skip } of dialog.toReversed()) {
		for (const part of text.split(' ').toReversed()) {
			toOutput.unshift({ text: `\x1b[${color}m` + part, delay, can_skip });
		}
		toOutput.unshift({ text: '\x1b[0m\n', delay: 500, can_skip });
	}
}

async function print_delayed(): Promise<void> {
	done = false;
	let next: Output;
	while ((next = toOutput.shift())) {
		if (exited) {
			return;
		}
		const { text, delay } = next;
		print(text + ' ');
		await wait(delay);
	}
	print('\n');
	done = true;
	if (times == 0) {
		exit();
		return;
	}
}

let times = 0;

async function handle_data(data: string): Promise<void> {
	if (tty_lock() != pid || exited) {
		return;
	}

	if (data != '\x03' && data != '\x1c') {
		return;
	}

	if (!toOutput[0]?.can_skip && data != '\x1c') {
		return;
	}

	if (data == '\x1c' && times >= steps.indexOf('hint')) {
		set_cookie('battle_completed', true);
		exit();
		return;
	}
	println('');
	times++;
	if (times >= steps.length) {
		times--;
	}
	step = steps[times];
	await wait(250);
	load_dialog(cont);
	load_dialog(dialog[step]);
	if (done) {
		await print_delayed();
	}
}

export async function main(...args: string[]): Promise<void> {
	load_dialog(dialog[step]);
	tty_lock(pid);
	tty.onData(handle_data);
	print_delayed();
	await can_exit;
	await wait(100);
	return;
}
