<script lang="ts">
	import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
	import type {
		ITerminalOptions,
		ITerminalInitOnlyOptions,
		Terminal,
		FitAddon
	} from '@battlefieldduck/xterm-svelte';

	import { onMount } from 'svelte';
	import { UART_ADDRESS, UART_HEIGHT, UART_WIDTH } from './constants';

	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 11,
		customGlyphs: false,
		cols: UART_WIDTH,
		rows: UART_HEIGHT
	};

	let socket: WebSocket;
	let fitAddon: FitAddon;
	let terminal: Terminal;

	async function onLoad(event: CustomEvent<{ terminal: Terminal }>) {
		terminal = event.detail.terminal;
		console.log('load');

		/* FitAddon Usage */
		fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal.loadAddon(fitAddon);

		const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
		terminal.loadAddon(webLinksAddon);
		fitAddon.fit();

		terminal.onData((data) => {
			socket.send(data);
		});

		terminal.write('\rUART loaded');
	}

	function setupWebSocket(terminal: Terminal) {
		socket = new WebSocket(UART_ADDRESS);

		socket.onopen = () => {
			terminal.write('Connected to UART...\r\n');
		};

		socket.onmessage = (event) => {
			terminal.write(event.data);
		};

		socket.onerror = (_) => {
			terminal.write('WebSocket error\r\n');
		};

		socket.onclose = () => {
			terminal.write('Connection closed\r\n');
		};
	}

	function onKey(event: CustomEvent<{ key: string; domEvent: KeyboardEvent }>) {
		sendData(new Blob([event.detail.key]));
	}

	function onData(event: CustomEvent<string>) {
		// sendData(event.detail);
		console.log(event.detail);
	}

	function sendData(data: string | Blob) {
		if (socket && socket.readyState === WebSocket.OPEN) socket.send(data);
	}

	onMount(() => {
		setupWebSocket(terminal);

		return () => {
			terminal.dispose();
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	});
</script>

<div id="terminal-container">
	<Xterm {options} on:load={onLoad} on:key={onKey} on:data={onData} />
</div>

<style>
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
