<script lang="ts">
	import '../app.css';
	import { closeModal } from 'svelte-modals';
	import type { Account } from '$lib/account';
	import BaseModal from './BaseModal.svelte';
	import TextInput from './TextInput.svelte';

	// Provided by Modals
	export let isOpen: boolean;

	export let parentAccount: Account;

	let newAccountName = '';
</script>

<BaseModal {isOpen}>
	<!-- FIXME(Chris): Write functions to obtain the same route in multiple places -->
	<form method="POST" action="?/childaccount">
		<h2 class="text-2xl mb-2">Create child account</h2>

		<hr class="mb-3" />

		<div class="grid grid-cols-2 gap-2">
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
				bind:value={parentAccount.full_name}
				disabled
				class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-2 disabled:bg-gray-300 disabled:shadow-none"
			/>

			<label for="new_account_name" class="text-right py-2 mb-2">Name:</label>
			<TextInput bind:value={newAccountName} name="new_account_name" class="px-3 py-2 mb-3" />
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
			<button
				type="submit"
				class="bg-blue-500 text-white p-2 rounded-lg shadow-md float-right hover:bg-blue-400 hover:cursor-pointer"
			>
				Submit
			</button>
		</div>
	</form>
</BaseModal>

<style>
</style>
