<script lang="ts">
	import '../app.css';
	import { closeModal } from 'svelte-modals';
	import type { Account } from '$lib/account';
	import BaseModal from './BaseModal.svelte';
	import TextInput from './TextInput.svelte';
	import Button, { ButtonColor } from './Button.svelte';

	export let isOpen: boolean;

	export let account: Account;
</script>

<BaseModal {isOpen}>
	<!-- FIXME(Chris): Write functions to obtain the same route in multiple places -->
	<h2 class="text-2xl">Delete account (with children)</h2>

	<hr class="my-3" />

    <p>This account has <b>???</b> child accounts.</p>

    <p>Do you still want to delete this account, and <b>all of its children</b>?</p>

	<hr class="my-3" />

	<div class="actions flow-root">
		<Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>
		<Button type="submit" color={ButtonColor.Red} class="p-2 float-right">Delete All Children</Button>
	</div>
</BaseModal>

<style>
</style>
