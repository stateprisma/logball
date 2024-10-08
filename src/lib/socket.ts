import { get } from 'svelte/store';
import type { Result } from './types/std.type';
import { configStore } from './stores/config';
import { logStore } from './stores/logs';
import type { Log } from './types/log.type';
import { strToLog } from './logtools/logutils';

export enum EventType {
	ON_OPEN,
	ON_MESSAGE,
	ON_ERROR,
	ON_CLOSE
}

let socket: WebSocket;
let subscribed: Map<EventType, CallableFunction[]> = new Map();

export function connect(address: string | URL): Result<null, string> {
	try {
		socket = new WebSocket(address);
		socket.onopen = (event) => {
			subscribed.get(EventType.ON_OPEN)?.map((o) => o(event));
		};

		socket.onmessage = (event) => {
			let incomingData = event.data.toString();
			if (get(configStore).prefilter.test(incomingData)) {
				logStore.update((logs: Log[]) => {
					return [...logs, strToLog(incomingData)];
				});
			}
			subscribed.get(EventType.ON_MESSAGE)?.map((o) => o(event));
		};

		socket.onerror = (event) => {
			subscribed.get(EventType.ON_ERROR)?.map((o) => o(event));
		};

		socket.onclose = (event) => {
			subscribed.get(EventType.ON_CLOSE)?.map((o) => o(event));
			socket.close();
		};
	} catch (e) {
		return { ok: false, error: e as string };
	}

	return { ok: true, value: null };
}

export function subscribe(callback: CallableFunction, event: EventType) {
	if (subscribed.has(event)) {
		subscribed.get(event)?.push(callback);
		return;
	}

	subscribed.set(event, [callback]);
}

export async function send(data: string | Blob): Promise<boolean> {
	if (socket && socket.readyState === WebSocket.OPEN) {
		socket.send(data);
		return true;
	}

	return false;
}
