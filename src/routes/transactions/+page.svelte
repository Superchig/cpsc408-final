<script lang="ts">
  import TransactionForm from './TransactionForm.svelte';
  import EditTransactionModal from './EditTransactionModal.svelte';
  import type { PageData } from './$types';
  import '$lib/app.css';
  import TextInput from '$lib/TextInput.svelte';
  import ky, { HTTPError } from 'ky';
  import Fa from 'svelte-fa';
  import { faPencil, faTrash } from '@fortawesome/free-solid-svg-icons';
  import type { NewTransactionData, Transaction } from '$lib/transaction';
  import { openModal } from 'svelte-modals';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import DropDown from './DropDown.svelte';
  import { page } from '$app/stores';

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
    openModal(EditTransactionModal, structuredClone({ transaction, accounts: data.accounts }));
  };

  // Search functionality

  const searchParams = new URLSearchParams($page.url.search);

  const candidateAccountId: string | null = searchParams.get('account_id');

  let searchAccountId: number = candidateAccountId === null ? 0 : Number(candidateAccountId);
  let elemSearchForm: HTMLFormElement;

  const hasSearched = (): boolean => {
    // TODO(Chris): Refactor the gathering of searchParams here into a function, reuse it
    // in the corresponding +page.server.ts
    const params = {
      date: searchParams.get('date'),
      accountId: Number(searchParams.get('account_id')),
      amount: Number(searchParams.get('amount')),
      description: searchParams.get('description')
    };

    return Object.values(params).reduce(
      (soFar, propertyValue) => soFar || Boolean(propertyValue),
      false
    );
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

  <h1 class="text-3xl mb-3">Transactions</h1>

  <TransactionForm
    bind:jsonData
    accounts={data.accounts}
    onClickSubmit={onClickNewTransactionCreate}
  >
    <Button
      type="button"
      color={ButtonColor.Blue}
      class="mt-3 p-2 float-right"
      on:click={onClickNewTransactionCreate}
    >
      Create
    </Button>
  </TransactionForm>

  <h2 class="text-2xl mb-3">
    {#if hasSearched()}
      Matching Transactions
    {:else}
      All Transactions
    {/if}
  </h2>

  <form
    class="flex flex-col gap-2 p-3 rounded-md shadow-md outline outline-1 outline-gray-400 mb-7 max-w-xl mx-auto"
    bind:this={elemSearchForm}
  >
    <h3 class="text-2xl">Filters</h3>

    <hr class="mb-1" />

    <div class="grid grid-cols-2 gap-3 mb-1" style="grid-template-columns: 6rem auto;">
      <label for="search_date" class="text-right shrink py-1">Date:</label>
      <input
        type="date"
        name="date"
        id="search_date"
        value={searchParams.get('date')}
        class="font-mono border rounded-md p-1 bg-gray-200 hover:bg-gray-100 shadow-sm"
      />

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label for="search_account" class="text-right shrink py-1">Account:</label>
      <div>
        <DropDown
          accounts={data.accounts}
          id="search_account"
          bind:outId={searchAccountId}
          class="w-full"
          menuClass="translate-y-1 z-30"
          isEmptyAllowed={true}
        />
      </div>

      <label for="search_amount" class="text-right shrink py-1">Amount:</label>
      <div>
        <input
          type="number"
          name="amount"
          id="search_amount"
          value={searchParams.get('amount')}
          class="px-2 py-1 w-full bg-gray-200 hover:bg-gray-100 rounded-lg shadow-sm"
        />
      </div>

      <input type="number" value={searchAccountId} name="account_id" hidden />

      <!-- svelte-ignore a11y-label-has-associated-control -->
      <label class="text-right shrink py-1">Description:</label>
      <TextInput
        name="description"
        value={searchParams.get('description')}
        class="px-2 py-1"
        autocomplete="off"
      />
    </div>

    <hr />

    <div class="flow">
      <Button type="submit" color={ButtonColor.Blue} class="p-2 mt-2 float-right">Search</Button>
      <Button
        color={ButtonColor.SwapBlue}
        class="p-2 mt-2 float-left"
        on:click={() => {
          elemSearchForm.reset();
          elemSearchForm.submit();
        }}
      >
        Clear
      </Button>
    </div>
  </form>

  <div class="flex flex-col gap-y-10">
    {#if data.transactions.length <= 0}
      <p>No results found.</p>
    {:else}
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
    {/if}
  </div>
</div>

<style>
</style>
