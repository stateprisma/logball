import type { LogFilter } from '$lib/config.type';
import { writable } from 'svelte/store';

export const filtersStore = writable<LogFilter[]>([]);

export const addFilters = (newFilters: LogFilter[]) => {
	filtersStore.update((currentFilter) => ({
		...currentFilter,
		...newFilters
	}));
};

export const resetFilters = () => {
	filtersStore.set([]);
};
