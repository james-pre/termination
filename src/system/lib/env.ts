export const env: Map<string, string> = (globalThis.env ||= new Map());

export default env;

if (!env.get('PATH')) {
	env.set('PATH', '.:/sbin:/bin');
}

if (!env.get('PWD')) {
	env.set('PWD', '/');
}
