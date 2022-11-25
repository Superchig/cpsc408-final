<script lang="ts">
  import '$lib/app.css';
  import { closeModal } from 'svelte-modals';
  import type { Account } from '$lib/account';
  import BaseModal from '$lib/BaseModal.svelte';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import type { Transaction } from '$lib/transaction';
  import TransactionForm from './TransactionForm.svelte';
  import ky from 'ky';

  export let isOpen: boolean;

  export let transaction: Transaction;
  export let accounts: Account[];

  const onClickSubmit = async () => {
    try {
      await ky.patch(`/transactions/patch`, { json: transaction });
      location.reload();
    } catch (e) {
      alert(e);
    }
  };
</script>

<BaseModal {isOpen}>
  <h2 class="text-2xl">Edit transaction</h2>

  <hr class="my-3" />

  <TransactionForm bind:jsonData={transaction} {accounts} {onClickSubmit} />

  <hr class="my-3" />

  <Button on:click={closeModal} color={ButtonColor.SwapRed} class="p-2 float-left">Cancel</Button>
  <Button on:click={onClickSubmit} color={ButtonColor.Red} class="p-2 float-right"
    >Update Transaction</Button
  >
</BaseModal>

<style>
</style>
