import fs, * as zenfs from 'lib:fs';

function get_backend(type: string): zenfs.Backend {
	if (!(type in zenfs) || !zenfs.isBackend(zenfs[type])) {
		throw new TypeError('Unknown filesystem type: ' + type);
	}

	return zenfs[type];
}

async function mount_fstab(): Promise<void> {
	const rawTab = await fs.promises.readFile('/etc/fstab', 'utf8');

	for (const line of rawTab.split('\n')) {
		if (/^\s*#/.test(line)) {
			continue;
		}

		const [point, type, ..._options] = line;

		const options = JSON.parse(_options.join(' '));

		const filesystem = await zenfs.resolveBackend({ ...options, backend: get_backend(type) });

		fs.mount(point, filesystem);
	}
}

export async function main(_: string, ...args: string[]): Promise<number> {
	if(args.includes('-a')) {
		await mount_fstab();
		return 0;
	}

	return 0;
}
