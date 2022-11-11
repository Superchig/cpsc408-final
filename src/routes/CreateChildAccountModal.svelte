<script lang="ts">
	import '../app.css';
	import { closeModal } from 'svelte-modals';
	import { useFocusOn } from 'svelte-focus-on';
	import type { Account } from '$lib/account';

	// Provided by Modals
	export let isOpen: boolean;

	export let parentAccount: Account;

	const focusOn = useFocusOn();

	let newAccountName = '';
</script>

{#if isOpen}
	<div class="bg-gray-600 bg-opacity-50 fixed top-0 bottom-0 w-full" />
	<div
		role="dialog"
		class="modal fixed top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 mx-auto w-max m-4 p-3 rounded-md shadow-2xl bg-white"
		use:focusOn
	>
		<div class="contents">
			<form>
				<h2 class="text-2xl mb-2">Create child account</h2>

				<hr class="mb-3" />

				<!-- FIXME(Chris): Write functions to obtain the same route in multiple places -->
				<div method="POST" class="grid grid-cols-2 gap-2">
					<input
						type="text"
						name="parent_account_id"
						value={parentAccount.id}
						hidden
						class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-2 disabled:bg-gray-300 disabled:shadow-none"
					/>

					<label for="parent_account_name" class="text-right py-2 mb-2">Parent account:</label>
					<input
						type="text"
						name="parent_account_name"
						bind:value={parentAccount.name}
						disabled
						class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-2 disabled:bg-gray-300 disabled:shadow-none"
					/>

					<!-- FIXME(Chris): Extract text inputs out into their own component -->
					<label for="new_account_name" class="text-right py-2 mb-2">Name:</label>
					<input
						type="text"
						name="new_account_name"
						bind:value={newAccountName}
						class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-3"
					/>
				</div>

				<hr class="mb-2" />

				<!-- FIXME(Chris): Extract buttons out into their own component -->
				<div class="actions flow-root">
					<button
						on:click={closeModal}
						class="bg-red-500 text-white p-2 rounded-lg shadow-md float-left hover:bg-red-400"
					>
						Cancel
					</button>
					<input
						type="submit"
						value="Submit"
						class="bg-blue-500 text-white p-2 rounded-lg shadow-md float-right hover:bg-blue-400 hover:cursor-pointer"
					/>
				</div>
			</form>
		</div>
	</div>
{/if}

<style>
</style>
