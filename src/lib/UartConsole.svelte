<script lang="ts">
	import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
	import type {
		ITerminalOptions,
		ITerminalInitOnlyOptions,
		Terminal,
		FitAddon
	} from '@battlefieldduck/xterm-svelte';

	import { onMount } from 'svelte';
	import { UART_HEIGHT, UART_WIDTH } from './constants';

	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 11,
		customGlyphs: false,
		cols: UART_WIDTH,
		rows: UART_HEIGHT
	};

	let socket: WebSocket;
	let fitAddon: FitAddon;
	let terminal: Terminal;
	let statusIcon: string;
	let statusText: string;
	let uartAddress: string = 'ws://localhost:1234';

	async function onLoad(event: CustomEvent<{ terminal: Terminal }>) {
		terminal = event.detail.terminal;

		/* FitAddon Usage */
		fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal.loadAddon(fitAddon);

		const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
		terminal.loadAddon(webLinksAddon);
		fitAddon.fit();

		terminal.onData((data) => {
			socket.send(data);
		});
		statusText = 'idle';
	}

	async function setupWebSocket() {
		try {
			socket = new WebSocket(uartAddress);
		} catch (e) {
			statusText = `${e}`;
			return;
		}

		socket.onopen = () => {
			statusText = `Connected to UART at ${uartAddress}`;
		};

		socket.onmessage = (event) => {
			terminal.write(event.data);
		};

		socket.onerror = (_) => {
			statusText = 'WebSocket error';
		};

		socket.onclose = () => {
			statusText = 'idle';
		};
	}

	async function onKey(event: CustomEvent<{ key: string; domEvent: KeyboardEvent }>) {
		sendData(new Blob([event.detail.key]));
	}

	async function onData(event: CustomEvent<string>) {
		// sendData(event.detail);
		console.log(event.detail);
	}

	async function sendData(data: string | Blob) {
		if (socket && socket.readyState === WebSocket.OPEN) socket.send(data);
	}

	onMount(() => {
		return () => {
			terminal.dispose();
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	});
</script>

<div id="uart-controls">
	<form>
		<input type="text" bind:value={uartAddress} />
		<input type="button" value="Connect" on:click={setupWebSocket} />
		<span class={statusIcon}></span>{statusText}
	</form>
	<div id="terminal-container">
		<Xterm {options} on:load={onLoad} on:key={onKey} on:data={onData} />
	</div>
</div>

<style>
	#uart-controls {
		margin-top: 10%;
		flex: auto;
	}

	#terminal-container {
		position: relative;
		right: 0;
		top: 20px;
		bottom: 20px;
		left: 20px;
		width: calc(100% - 40px);
		height: calc(100% - 40px);
		background-color: black;
		padding: 10px;
		box-sizing: border-box;
		overflow: hidden;
	}
</style>
