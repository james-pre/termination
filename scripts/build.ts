import { BuildOptions, build, context } from 'esbuild';
import { execSync } from 'node:child_process';
import { readFileSync, readdirSync, rmSync, statSync } from 'node:fs';
import { join, resolve } from 'node:path/posix';
import { parseArgs } from 'node:util';

const { keep, watch, sourcemap } = parseArgs({
	options: {
		keep: { short: 'k', type: 'boolean', default: false },
		watch: { short: 'w', type: 'boolean', default: false },
		sourcemap: { type: 'boolean', default: false },
	},
}).values;

function resolveEntryPoint(path) {
	if (statSync(path).isFile()) {
		return path;
	}

	return readdirSync(path).flatMap(entry => resolveEntryPoint(join(path, entry)));
}

const config: BuildOptions = {
	entryPoints: ['src/index.html', './src/index.js', 'src/styles.css', ...resolveEntryPoint(resolve('src/system'))],
	target: 'es2022',
	outdir: 'dist',
	keepNames: true,
	bundle: true,
	format: 'esm',
	platform: 'browser',
	sourcemap,
	loader: {
		'.html': 'copy',
	},
	external: ['src/system/*'],
	plugins: [
		{
			name: 'custom',
			setup({ onStart, onEnd, onLoad }) {
				onLoad({ filter: /^[^.]+$/ }, args => ({ contents: readFileSync(args.path), loader: 'copy' }));
				onStart(() => {
					if (!keep) {
						rmSync('dist', { recursive: true, force: true });
					}
				});
				onEnd(() => {
					try {
						execSync(`npx --package=@zenfs/core make-index -o dist/index.json dist/system`, { stdio: 'inherit' });
					} finally {
						// nothing
					}
				});
			},
		},
	],
};

if (watch) {
	console.log('Watching for changes...');
	const ctx = await context(config);
	await ctx.watch();
} else {
	await build(config);
}
