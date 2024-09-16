<script lang="ts">
	import { Card, CardBody, Row, Col, Container, Input } from '@sveltestrap/sveltestrap';
	import { VALID_CONFIG_VERSIONS } from './constants';
	import { setConfig } from './stores/config';

	let files: FileList;

	$: if (files) {
		parseFile();
	}

	function parseFile() {
		const file = files[0];
		if (file.type != 'json') {
			/* Wrong filetype */
            console.error('Invalid config file! (It should be ".json")');
			return;
		}

		file
			.text()
			.then((data) => JSON.parse(data))
			.then((json) => {
				/* Validate type */
				if (!VALID_CONFIG_VERSIONS.includes(json.version)) {
					/* Wrong version */
					console.error('Config version not supported');
					return;
				}

				setConfig(json);
			});
	}
</script>

<Card>
	<CardBody>
		<Container fluid class="grid">
			<Row>
				<Col>
					<p>Total logs:</p>
				</Col>
				<Col>
					<Input bind:files type="file" name="file" />
				</Col>
			</Row>
			<Row class="mt-2"></Row>
		</Container>
	</CardBody>
</Card>
