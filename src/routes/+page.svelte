<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let newAccount: Account = {
		id: undefined,
		name: undefined
	};

	type Account = {
		id: number | undefined;
		name: string | undefined;
	};

	const onCreateClick = (event: Event) => {
		alert('Creating new account: ' + newAccount.name);
	};
</script>

<h1>Accounts</h1>

<table>
	<thead>
		<tr>
			<td>ID</td>
			<td>Name</td>
			<!-- Invisible button column: -->
			<td></td>
		</tr>
	</thead>
	<tbody>
		{#each data.accounts as account}
			<tr>
				<td>{account.id}</td>
				<td>{account.name}</td>
			</tr>
		{/each}
		<tr>
			<td>TBD</td>
			<td><input type="text" bind:value={newAccount.name} /></td>
			<td><button on:click={onCreateClick}>Create</button></td>
		</tr>
	</tbody>
</table>

<style>
</style>
