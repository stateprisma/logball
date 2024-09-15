<script lang="ts">
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
			<p>
				Lorem ipsum odor amet, consectetuer adipiscing elit. Praesent porttitor habitasse vestibulum
				turpis magnis augue sagittis augue. Aptent turpis montes dignissim; amet nec quam ultrices.
				Sed consectetur ipsum phasellus orci class primis. Turpis urna nisi ante tempor pharetra
				vitae pretium mollis iaculis. Integer felis sodales mauris dignissim platea sit. Volutpat
				maximus fringilla euismod ex ultricies dui. Primis bibendum montes turpis arcu condimentum
				nec cras orci. Sociosqu scelerisque vel tortor semper ante. Aptent facilisis dapibus platea
				platea augue conubia taciti. Etiam dapibus nisl est ultrices nam vestibulum netus augue.
				Nunc massa libero lacinia quam diam lacinia aptent. Eu finibus gravida lorem magnis dapibus
				vulputate. Lacus rhoncus curae dictum mattis porttitor commodo sociosqu ante. Porttitor
				platea sollicitudin mattis parturient curabitur.
			</p>
		</Col>
		<Col>
			<UartConsole />
		</Col>
	</Row>
</Container>
