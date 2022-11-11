<script lang="ts">
	import type { PageData } from './$types';
	import type { Account } from '$lib/account';
	import '../app.css';
	import ky from 'ky';
	import Fa from 'svelte-fa';
	import { faTrash, faCirclePlus } from '@fortawesome/free-solid-svg-icons';
	import { Modals, openModal } from 'svelte-modals';
	import CreateChildAccountModal from './CreateChildAccountModal.svelte';

	export let data: PageData;

	let newAccount: Account = {
		id: undefined,
		name: undefined
	};

	const onCreateClick = async (event: Event) => {
		await ky.post('/accounts/new', { json: newAccount });

		location.reload();
	};

	const onDeleteClick = async (event: Event, account: Account) => {
		console.log('account.id: ' + account.id);

		try {
			await ky.delete(`/accounts/${account.id}/delete`);
			location.reload();
		} catch (e) {
			error = e;
		} finally {
			console.log('This is the finally block!');
		}
	};

	// Error display

	let error: any | null = null;
</script>

<Modals />

<div class="m-4 mx-auto w-max">
	<div class="bg-red-600 text-white p-3 m-1 rounded-md empty:hidden">
		{#if error != null}
			<h1 class="text-2xl mb-3">Error</h1>
			{error.toString()}
		{/if}
	</div>

	<h1 class="text-2xl mb-3">Accounts</h1>

	<table class="table-auto bg-white">
		<thead>
			<tr>
				<td class="border-gray-500 border-y-4 divide-x-gray-300 font-bold px-6 py-3 bg-blue-100"
					>ID</td
				>
				<td class="border-gray-500 border-y-4 divide-x-gray-300 font-bold px-6 py-3 bg-blue-100"
					>Name</td
				>
				<!-- Invisible button column: -->
				<td />
			</tr>
		</thead>
		<tbody>
			{#each data.accounts as account}
				<tr>
					<td class="border border-y-4 px-6 py-3">{account.id}</td>
					<td class="border border-y-4 pl-4 pr-1 py-3 group">
						<div class="flow-root">
							<p class="float-left">
								{account.name}
							</p>
							<div class="float-right flex">
								<span
									on:click={(event) => onDeleteClick(event, account)}
									on:keypress={(event) => onDeleteClick(event, account)}
									class="invisible p-1 text-red-600 group-hover:visible hover:text-red-400 hover:cursor-pointer"
								>
									<Fa icon={faTrash} />
								</span>
								<span
									on:click={(event) =>
										openModal(CreateChildAccountModal, structuredClone({ parentAccount: account }))}
									on:keypress={(event) =>
										openModal(CreateChildAccountModal, structuredClone({ parentAccount: account }))}
									class="invisible p-1 text-green-600 group-hover:visible hover:text-green-400 hover:cursor-pointer"
								>
									<Fa icon={faCirclePlus} />
								</span>
							</div>
						</div>
					</td>
					<td class="px-2" />
				</tr>
			{/each}
			<tr>
				<td class="border border-y-4 px-6 py-3">TBD</td>
				<td class="border border-y-4 px-4 py-3"
					><input
						type="text"
						bind:value={newAccount.name}
						class="bg-blue-100 px-3 py-2 rounded-lg shadow-md"
					/></td
				>
				<td class="p-2"
					><button
						class="bg-blue-500 text-white text-lg shadow-md rounded-lg p-3 px-6 pt-2 w-full hover:bg-blue-400"
						on:click={onCreateClick}>Create</button
					></td
				>
			</tr>
		</tbody>
	</table>
</div>

<style>
</style>
