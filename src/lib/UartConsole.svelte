<script lang="ts">
	import { Xterm, XtermAddon } from '@battlefieldduck/xterm-svelte';
	import type {
		ITerminalOptions,
		ITerminalInitOnlyOptions,
		Terminal,
		FitAddon
	} from '@battlefieldduck/xterm-svelte';

	import { onMount } from 'svelte';
	import { UART_WIDTH } from './constants';
	import { calculateRows } from './utils';
	import { VERSION } from './constants';
	import {
		Col,
		Container,
		Form,
		Input,
		Row,
		Button,
		Card,
		CardBody,
		CardFooter,
		CardHeader,
		CardTitle
	} from '@sveltestrap/sveltestrap';
	import { connect, subscribe, send, EventType } from './socket';

	let options: ITerminalOptions & ITerminalInitOnlyOptions = {
		fontSize: 15,
		customGlyphs: false,
		cols: UART_WIDTH
	};

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

		terminal.resize(terminal.cols, calculateRows(container));
		fitAddon.fit();

		statusText = 'Idle';
		terminal.write(`\r\n  > Logball v${VERSION}\r\n\r\n`);
	}

	async function onKey(event: CustomEvent<{ key: string; domEvent: KeyboardEvent }>) {
		send(new Blob([event.detail.key]));
	}

	async function onData(event: CustomEvent<string>) {
		console.log(event.detail);
	}

	function setupSocket() {
		terminal.write(`Connecting to ${uartAddress}...\r\n`);
		let result = connect(uartAddress);
		if (result.ok === false) {
			statusText = result.error;
		}

		subscribe((_: Event) => {
			statusText = `Connected to UART at ${uartAddress}`;
		}, EventType.ON_OPEN);
		subscribe((event: MessageEvent) => {
			terminal.write(event.data);
		}, EventType.ON_MESSAGE);
		subscribe((event: Event) => {
			statusText = `${event}`;
		}, EventType.ON_ERROR);
		subscribe((_: Event) => {
			statusText = 'Idle';
		}, EventType.ON_CLOSE);
	}

	onMount(() => {
		window.addEventListener('resize', () => {
			terminal.resize(terminal.cols, calculateRows(container));
			fitAddon.fit();
		});

		return () => {
			terminal.dispose();
		};
	});
</script>

<div class="resize-container" bind:this={container}></div>
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
					<Button type="button" on:click={setupSocket}>Connect</Button>
				</Col>
			</Row>
		</Form>
	</CardFooter>
</Card>

<style>
	.resize-container {
		font-size: 15;
	}
</style>
