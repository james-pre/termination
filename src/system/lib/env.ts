export const env: Map<string, string> = (globalThis.env ||= new Map());

export default env;

if (!env.get('PATH')) {
	env.set('PATH', '.:/sbin:/bin');
}

if (!env.get('PWD')) {
	env.set('PWD', '/');
}

export function set_cookie(key: string, value: { toString(): string }): void {
	document.cookie = key + '=' + value.toString();
}

export function get_cookie(key: string): string {
	const parts = ('; ' + document.cookie).split(`; ${key}=`);
	return parts.length == 2 ? parts.pop().split(';').shift() : '';
}
