<script lang="ts">
	import '../app.css';
    import { onMount } from 'svelte';
	import { closeModal } from 'svelte-modals';
	import type { Account } from '$lib/account';
	import BaseModal from './BaseModal.svelte';
	import Button, { ButtonColor } from './Button.svelte';
	import ky from 'ky';

	export let isOpen: boolean;

	export let account: Account;

    let childCount: number | string = 'LOADING';

    onMount(async () => {
        const response = await ky.get(`/accounts/${account.id}/count_children`)

        childCount = await response.json();
    });
</script>

<BaseModal {isOpen}>
	<!-- FIXME(Chris): Write functions to obtain the same route in multiple places -->
	<h2 class="text-2xl">Delete account (with children)</h2>

	<hr class="my-3" />

    <p>This account has <b>{childCount}</b> child account(s).</p>

    <p>Do you still want to delete this account, and <b>all of its children</b>?</p>

	<hr class="my-3" />

	<!-- FIXME(Chris): Write functions to obtain the same route in multiple places -->
	<form method="POST" action="?/delete_with_all_children" class="actions flow-root">
        <input type="number" name="account_id" hidden value={account.id} />

		<Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>
		<Button type="submit" color={ButtonColor.Red} class="p-2 float-right">Delete All Children</Button>
    </form>
</BaseModal>

<style>
</style>
