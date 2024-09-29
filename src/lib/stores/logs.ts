import type { Log } from '$lib/types/log.type';
import { writable } from 'svelte/store';

export const logStore = writable<Log[]>([]);

export function setConfig(data: Log[]) {
	logStore.set(data);
}

export function resetConfig() {
	logStore.set([]);
}
