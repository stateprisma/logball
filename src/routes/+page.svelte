<script lang="ts">
	import LogOverview from '$lib/LogOverview.svelte';
	import LogToolsContainer from '$lib/logtools/LogToolsContainer.svelte';
	import { strToLog } from '$lib/logtools/logutils';
	import { EventType, subscribe } from '$lib/socket';
	import { configStore } from '$lib/stores/config';
	import { logStore } from '$lib/stores/logs';
	import type { Log } from '$lib/types/log.type';
	import type { SveltestrapTheme } from '$lib/types/sveltestrap.type';
	import UartConsole from '$lib/UartConsole.svelte';
	import { get } from 'svelte/store';
	import Header from './Header.svelte';
	import { Styles, Row, Col, Container } from '@sveltestrap/sveltestrap';

	let theme: SveltestrapTheme = 'auto';

	subscribe((event: MessageEvent<string>) => {
		let incomingData = event.data.toString();
		if (get(configStore).prefilter.test(incomingData)) {
			logStore.update((logs: Log[]) => {
				return [...logs, strToLog(incomingData)];
			});
		}
	}, EventType.ON_MESSAGE);
</script>

<Styles {theme} />
<Header />
<Container fluid>
	<Row>
		<Col>
			<LogOverview />
			<LogToolsContainer />
		</Col>
		<Col>
			<UartConsole />
		</Col>
	</Row>
</Container>
