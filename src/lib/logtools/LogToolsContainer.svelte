<script lang="ts">
	import { Card, CardHeader, TabContent } from '@sveltestrap/sveltestrap';
	import LogToolsTail from './LogToolsTail.svelte';
	import LogToolsUnits from './LogToolsUnits.svelte';
</script>

<Card class="mt-4">
    <CardHeader>
        Log Viewer
    </CardHeader>
    <TabContent class="m-2">
        <LogToolsTail />
        <LogToolsUnits />
    </TabContent>
</Card>
