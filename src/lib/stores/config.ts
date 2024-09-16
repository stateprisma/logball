import type { ConfigFile } from '$lib/config.type';
import { writable } from 'svelte/store';

export const configStore = writable<ConfigFile>();

export function setConfig(data: ConfigFile) {
	configStore.set(data);
}

export function resetConfig() {
	configStore.set({} as ConfigFile);
}
