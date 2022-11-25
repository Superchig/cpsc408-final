<script lang="ts">
  import '$lib/app.css';
  import { onMount } from 'svelte';
  import { closeModal } from 'svelte-modals';
  import type { Account } from '$lib/account';
  import BaseModal from '$lib/BaseModal.svelte';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import type { Transaction } from '$lib/transaction';

  export let isOpen: boolean;

  export let transaction: Transaction;
</script>

<BaseModal {isOpen}>
  <h2 class="text-2xl">Edit transaction</h2>

  <hr class="my-3" />

  <p>You are now editing an existing transaction.</p>

  <hr class="my-3" />

  <form method="POST" class="actions flow-root">
    <input type="number" name="transaction_id" hidden value={transaction.id} />

    <Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>
    <Button type="submit" color={ButtonColor.Red} class="p-2 float-right">
      Update Transaction
    </Button>
  </form>
</BaseModal>

<style>
</style>
