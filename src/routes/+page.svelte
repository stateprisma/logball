<script lang="ts">
	import UartConsole from '$lib/UartConsole.svelte';
	import Header from './Header.svelte';
</script>

<Header />

<div class="layout">
	<div class="left"></div>

	<div class="right">
		<UartConsole />
	</div>
</div>

<style>
	.layout {
		display: flex;
		width: 100vw;
		height: 100vh;
	}

	.left {
		width: 50%;
		height: 100%;
	}

	.right {
		width: 50%;
		height: 100%;
	}
</style>
