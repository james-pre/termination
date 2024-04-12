const env: Map<string, string> = (globalThis.env ||= new Map());

export function env_get(key: string): string {
	return env.get(key);
}

export function env_set(key: string, value: string): void {
	env.set(key, value);
}

export function env_remove(key: string): void {
	env.delete(key);
}

export function env_clear(): void {
	env.clear();
}

export function env_has(key: string): boolean {
	return env.has(key);
}

export function env_keys(): string[] {
	return [...env.keys()];
}

if (!env_get('PATH')) {
	env_set('PATH', '.:/sbin:/bin');
}

if (!env_get('PWD')) {
	env_set('PWD', '/');
}
