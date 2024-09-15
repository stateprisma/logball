<script lang="ts">
	import LogOverview from '$lib/LogOverview.svelte';
	import UartConsole from '$lib/UartConsole.svelte';
	import Header from './Header.svelte';
	import { Styles, Row, Col, Container } from '@sveltestrap/sveltestrap';

	// ts complains unecessarilly here
	let theme: any = 'auto';
</script>

<Styles {theme} />
<Header />
<Container fluid>
	<Row>
		<Col>
			<LogOverview />
		</Col>
		<Col>
			<UartConsole />
		</Col>
	</Row>
</Container>
