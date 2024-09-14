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
	import { calculateRows } from './utils';
	import { VERSION } from './constants';

	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 15,
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
	let container: HTMLDivElement;

	async function onLoad(event: CustomEvent<{ terminal: Terminal }>) {
		terminal = event.detail.terminal;

		/* FitAddon Usage */
		fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal.loadAddon(fitAddon);

		const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
		terminal.loadAddon(webLinksAddon);

		terminal.onData((data) => {
			socket.send(data);
		});

		terminal.resize(terminal.cols, calculateRows(container));
		fitAddon.fit();

		statusText = 'Idle';
		terminal.write(`> Logball v${VERSION}\r\n`);
		terminal.write('=================\r\n')
	}

	async function setupWebSocket() {
		try {
			terminal.write(`Connecting to ${uartAddress}...\r\n`);
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

		socket.onerror = (e) => {
			statusText = `${e}`;
		};

		socket.onclose = () => {
			statusText = 'Idle';
		};
	}

	async function onKey(event: CustomEvent<{ key: string; domEvent: KeyboardEvent }>) {
		sendData(new Blob([event.detail.key]));
	}

	async function onData(event: CustomEvent<string>) {
		console.log(event.detail);
	}

	async function sendData(data: string | Blob) {
		if (socket && socket.readyState === WebSocket.OPEN) socket.send(data);
	}

	onMount(() => {
		window.addEventListener('resize', () => {
			terminal.resize(terminal.cols, calculateRows(container));
			fitAddon.fit();
		});

		return () => {
			terminal.dispose();
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	});
</script>

<div bind:this={container} id="terminal-container">
	<Xterm class="xterm" {options} on:load={onLoad} on:key={onKey} on:data={onData} />
</div>
<div class="container">
	<form id="controls">
		<input class="input-field" type="text" bind:value={uartAddress} />
		<input class="button" type="button" value="Connect" on:click={setupWebSocket} />
		<p class="status-text">Status: {statusText}</p>
	</form>
</div>

<style>
	#terminal-container {
		position: relative;
		right: 0;
		top: 20px;
		bottom: 20px;
		left: 20px;
		width: calc(100% - 40px);
		height: calc(100% - 100px);
		background-color: black;
		padding: 10px;
		box-sizing: border-box;
		overflow: hidden;
		border-radius: 12px;
	}

	#controls {
		position: relative;
		margin: 35px;
	}

	.container {
		position: relative;
		display: inline-flex;
		background-color: rgba(26, 30, 38, 1);
		z-index: 2;
		border-radius: 12px;
		padding: 4px;
		height: 6%;
		align-items: center;
		top: 25px;
		bottom: 20px;
		right: 25px;
		left: 20px;
		min-height: 50px !important;
		width: calc(100% - 48px);
		box-shadow:
			inset 4px 4px 8px 0 rgba(0, 0, 0, 0.9),
			inset -4px -4px 8px 0 rgba(40, 40, 40, 0.9);
	}

	.button {
		display: inline-block;
		padding: 10px 24px;
		background-color: #1688e6;
		color: var(--color-text);
		font-size: 16px;
		font-weight: bold;
		border: none;
		border-radius: 8px;
		cursor: pointer;
		transition:
			background-color 0.2s ease,
			box-shadow 0.2s ease;
	}

	.button:hover {
		background-color: #006bc3;
	}

	.input-field {
		position: relative;
		display: inline-block;
		left: 0px;
		padding: 8px;
		margin-right: 10px;
		color: var(--color-text);
		background-color: var(--color-bg-1);
		outline: none;
		border: 2px solid whitesmoke;
		border-radius: 8px;
	}

	.status-text {
		display: inline-block;
		margin-left: 20px;
	}
</style>
