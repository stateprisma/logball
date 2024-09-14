<script lang="ts">
	import {
		type ITerminalOptions,
		type ITerminalInitOnlyOptions,
		type Terminal,
		type FitAddon,
		XtermAddon,
		Xterm
	} from '@battlefieldduck/xterm-svelte';

	import { onMount } from 'svelte';
	import { UART_ADDRESS, UART_HEIGHT, UART_WIDTH } from './constants';

	let terminal: Terminal;
	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 11,
		customGlyphs: false,
		cols: UART_WIDTH,
		rows: UART_HEIGHT
	};

	let socket: WebSocket;
	let fitAddon: FitAddon;

	async function onLoad(event: CustomEvent<{ terminal: Terminal }>) {
		console.log('load');
		terminal = event.detail.terminal;

		/* FitAddon Usage */
		fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal.loadAddon(fitAddon);

		const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
		terminal.loadAddon(webLinksAddon);
		terminal.write('\rLoading...\r\n');
		fitAddon.fit();

		terminal.onData((data) => {
			socket.send(data);
		});

		terminal.write('\rUART loaded');
	}

	function setupWebSocket() {
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

	onMount(() => {
		setupWebSocket();

		return () => {
			terminal.dispose();
			if (socket && socket.readyState === WebSocket.OPEN) {
				socket.close();
			}
		};
	});
</script>

<div id="terminal-container">
	<Xterm {options} on:load={onLoad} />
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
