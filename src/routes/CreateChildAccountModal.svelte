<script lang="ts">
	import '../app.css';
	import { closeModal } from 'svelte-modals';
	import { useFocusOn } from 'svelte-focus-on';

	// Provided by Modals
	export let isOpen: boolean;

	export let title: any;
	export let message: any;

	const focusOn = useFocusOn();
</script>

{#if isOpen}
	<div class="bg-gray-600 bg-opacity-50 fixed top-0 bottom-0 w-full" />
	<div
		role="dialog"
		class="modal fixed top-1/4 left-1/2 mx-auto w-max m-4 p-3 rounded-md shadow-2xl bg-white"
		use:focusOn
	>
		<div class="contents">
			<h2 class="text-2xl">{title}</h2>
			<p>{message}</p>
			<div class="actions">
				<button on:click={closeModal} class="bg-blue-500 text-white p-2 rounded-lg shadow-md"
					>OK</button
				>
			</div>
		</div>
	</div>
{/if}

<style>
</style>
