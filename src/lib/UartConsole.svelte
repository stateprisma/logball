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
	import {
		Col,
		Container,
		Form,
		FormGroup,
		Input,
		Row,
		Button,
		Icon,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardSubtitle,
		CardText,
		CardTitle
	} from '@sveltestrap/sveltestrap';

	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 15,
		customGlyphs: false,
		cols: UART_WIDTH,
		rows: UART_HEIGHT
	};

	let socket: WebSocket;
	let fitAddon: FitAddon;
	let terminal: Terminal;
	let statusColor: string;
	let statusText: string;
	let uartAddress: string = 'ws://localhost:1234';
	let container: HTMLDivElement;

	async function onLoad(event: CustomEvent<{ terminal: Terminal }>) {
		terminal = event.detail.terminal;
		statusColor = 'red';

		/* FitAddon Usage */
		fitAddon = new (await XtermAddon.FitAddon()).FitAddon();
		terminal.loadAddon(fitAddon);

		const webLinksAddon = new (await XtermAddon.WebLinksAddon()).WebLinksAddon();
		terminal.loadAddon(webLinksAddon);

		terminal.onData((data) => {
			socket.send(data);
		});

		fitAddon.fit();

		statusText = 'Idle';
		terminal.write(`\r\n  > Logball v${VERSION}\r\n`);
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

<Card>
	<CardHeader>
		<CardTitle>Live UART</CardTitle>
	</CardHeader>
	<CardBody>
		<Container fluid class="grid">
			<Row>
				<Col>
					<Xterm class="xterm" {options} on:load={onLoad} on:key={onKey} on:data={onData} />
				</Col>
			</Row>
			<Row class="mt-2"></Row>
		</Container>
	</CardBody>
	<CardFooter>
		<Form>
			<Row>
				<Col>
					<label for="uart-addr">Uart Address</label>
					<Input bind:value={uartAddress} name="uart-addr" />
				</Col>
				<Col class="mt-4">
					<Button type="button" on:click={setupWebSocket}>Connect</Button>
				</Col>
			</Row>
		</Form>
	</CardFooter>
</Card>
