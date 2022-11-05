<script lang="ts">
	import type { PageData } from './$types';
	import '../app.css';
	import ky from 'ky';

	export let data: PageData;

	let newAccount: Account = {
		name: undefined
	};

	type Account = {
		name: string | undefined;
	};

	const onCreateClick = async (event: Event) => {
		alert('Creating new account: ' + newAccount.name);

		await ky.post('/accounts/new', { json: newAccount });

		location.reload();
	};
</script>

<div class="m-4 mx-auto w-max">
	<h1 class="text-2xl mb-3">Accounts</h1>

	<table class="table-auto bg-white">
		<thead>
			<tr>
				<td class="border-gray-500 border-y-4 divide-x-gray-300 font-bold px-6 py-3 bg-blue-100">ID</td>
				<td class="border-gray-500 border-y-4 divide-x-gray-300 font-bold px-6 py-3 bg-blue-100">Name</td>
				<!-- Invisible button column: -->
				<td />
			</tr>
		</thead>
		<tbody>
			{#each data.accounts as account}
				<tr>
					<td class="border border-y-4 px-6 py-3">{account.id}</td>
					<td class="border border-y-4 px-6 py-3">{account.name}</td>
					<td class="px-2">
						<button class="bg-red-500 text-white text-sm shadow-md rounded-lg p-3 px-6 pt-2 w-full hover:bg-red-400">
							Delete
						</button>
					</td>
				</tr>
			{/each}
			<tr>
				<td class="border border-y-4 px-6 py-3">TBD</td>
				<td class="border border-y-4 px-6 py-3"
					><input
						type="text"
						bind:value={newAccount.name}
						class="bg-blue-100 px-3 rounded-lg shadow-md focus:outline-none"
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
