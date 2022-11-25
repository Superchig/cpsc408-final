<script lang="ts">
  import TransactionForm from './TransactionForm.svelte';
  import EditTransactionModal from './EditTransactionModal.svelte';
  import type { PageData } from './$types';
  import '$lib/app.css';
  import TextInput from '$lib/TextInput.svelte';
  import ky, { HTTPError } from 'ky';
  import Fa from 'svelte-fa';
  import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
  import type { DebitCredit, NewTransactionData, Transaction } from '$lib/transaction';
  import { openModal } from 'svelte-modals';

  export let data: PageData;

  const today = new Date();

  let jsonData: NewTransactionData = {
    date: today.toLocaleDateString('en-CA'),
    description: '',
    debitsCredits: Array.from({ length: 2 }).map((val) => {
      return {
        accountId: 0,
        amount: 0
      };
    })
  };

  const onClickNewTransactionCreate = async () => {
    try {
      await ky.post('/transactions/new', { json: jsonData });
    } catch (e) {
      error = e;
      return;
    }

    location.reload();
  };

  const onClickDeleteTransaction = async (event: Event, transactionId: number) => {
    try {
      await ky.delete(`/transactions/${transactionId}/delete`);
    } catch (e) {
      error = e;
    }

    location.reload();
  };

  const onClickEditTransaction = (event: Event, transaction: Transaction) => {
    openModal(EditTransactionModal, structuredClone({ transaction }));
  };

  // Error display

  let error: any | null = null;
</script>

<div class="m-4 mx-auto max-w-screen-md">
  <div class="bg-red-600 text-white p-3 m-1 rounded-md empty:hidden">
    {#if error != null}
      <h1 class="text-2xl mb-3">Error</h1>
      {error.toString()}
      {#if error instanceof HTTPError}
        {#await error.response.json() then body}
          {#if body.message}
            <div>
              {body.message}
            </div>
          {/if}
        {/await}
      {/if}
    {/if}
  </div>

  <h1 class="text-2xl mb-3">Transactions</h1>

  <TransactionForm
    bind:jsonData
    accounts={data.accounts}
    onClickSubmit={onClickNewTransactionCreate}
  />

  <h2 class="text-xl mb-2">All Transactions</h2>

  <div class="flex flex-col gap-y-10">
    {#each data.transactions as transaction}
      <form class="flow-root group">
        <div class="flex mb-3 gap-x-2">
          <!-- https://stackoverflow.com/questions/6982692/how-to-set-input-type-dates-default-value-to-today -->
          <input
            type="date"
            value={transaction.date}
            class="border rounded-md p-1 bg-gray-200 hover:bg-gray-100 flex-none shadow-sm"
            disabled
          />
          <TextInput
            name="description"
            class="px-2 py-1 flex-auto shadow-sm"
            value={transaction.description}
            disabled
          />
        </div>
        <div class="grid grid-cols-12 gap-x-3 gap-y-2 max-w-screen-md">
          <div class="flex gap-x-1 invisible group-hover:visible">
            <span
              class="text-red-600 hover:text-red-400 hover:cursor-pointer"
              on:click={(event) => onClickDeleteTransaction(event, transaction.id)}
              on:keydown={(event) => onClickDeleteTransaction(event, transaction.id)}
            >
              <Fa icon={faTrash} />
            </span>
            <span
              class="text-yellow-600 hover:text-green-400 hover:cursor-pointer"
              on:click={(event) => onClickEditTransaction(event, transaction)}
              on:keydown={(event) => onClickEditTransaction(event, transaction)}
            >
              <Fa icon={faPencil} />
            </span>
          </div>
          {#each transaction.debitsCredits as debitCredit}
            <select
              class="col-start-4 col-span-7 px-2 py-1 rounded-lg shadow-sm bg-gray-200 hover:bg-gray-100"
              value={debitCredit.accountId}
              disabled
            >
              {#each data.accounts as account}
                <option value={account.id}>{account.full_name}</option>
              {/each}
            </select>
            <input
              type="number"
              value={debitCredit.amount}
              class="col-span-2 px-2 py-1 bg-orange-100 hover:bg-orange-50 rounded-lg shadow-sm"
              disabled
            />
          {/each}
        </div>
      </form>
    {/each}
  </div>
</div>

<style>
</style>
