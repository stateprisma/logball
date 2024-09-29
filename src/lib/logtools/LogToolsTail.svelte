<script>
	import { logStore } from '$lib/stores/logs';
	import { TabPane, ListGroup } from '@sveltestrap/sveltestrap';
	import { formatLog } from './logutils';
</script>

<TabPane tabId="tail" tab="Log Tail" active>
	<ListGroup>
		{#each $logStore as log}
			<p class="log-entry">{@html formatLog(log)}</p>
		{/each}
	</ListGroup>
</TabPane>

<style>
	.log-entry {
		white-space: pre;
		margin: 0px;
		margin-bottom: -5px;
		padding: 0px;
	}
</style>
