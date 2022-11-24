<script lang="ts">
  import DropDown from './DropDown.svelte';

  import type { PageData } from './$types';
  import '$lib/app.css';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import TextInput from '$lib/TextInput.svelte';
  import ky, { HTTPError } from 'ky';
  import Fa from 'svelte-fa';
  import { faCirclePlus, faTrash } from '@fortawesome/free-solid-svg-icons';
  import type { DebitCredit, NewTransactionData } from '$lib/transaction';

  export let data: PageData;

  const ID_FORM = 'new_transaction_form';

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

  const onClickNewDebitCredit = (event: Event) => {
    jsonData.debitsCredits.push({
      accountId: 0,
      amount: 0
    });

    jsonData.debitsCredits = jsonData.debitsCredits;
  };

  const onClickDeleteDebitCredit = (event: Event, debitCredit: DebitCredit) => {
    jsonData.debitsCredits = jsonData.debitsCredits.filter((dc) => dc != debitCredit);
  };

  const onClickDeleteTransaction = async (event: Event, transactionId: number) => {
    try {
      await ky.delete(`/transactions/${transactionId}/delete`);
    } catch (e) {
      error = e;
    }

    location.reload();
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

  <form class="flow-root" id={ID_FORM}>
    <!-- TODO(Chris): Fix bug in which x-ing out the date results in its input
    field changing in width slightly. -->
    <div class="flex mb-3 gap-x-2">
      <!-- https://stackoverflow.com/questions/6982692/how-to-set-input-type-dates-default-value-to-today -->
      <input
        type="date"
        bind:value={jsonData.date}
        class="border rounded-md p-1 bg-gray-200 hover:bg-gray-100 flex-none shadow-sm"
      />
      <!-- NOTE(Chris): That's right. This is a flexbox within a flexbox. This
           allow us to maximize the width of the text input, despite its sibling
           label.  -->
      <div class="relative flex-auto flex">
        <!-- TODO(Chris): Expand TextInput into text area when there's enough text -->
        <input
          type="text"
          id="description"
          name="description"
          bind:value={jsonData.description}
          placeholder=" "
          class="peer px-2 pt-2 pb-1 flex-auto shadow-sm border
                 rounded-md hover:border-gray-700 focus:border-blue-700 outline-none"
          on:keydown={(event) => {
            if (event.key == 'Enter') {
              onClickNewTransactionCreate();
            }
          }}
        />
        <!-- NOTE(Chris): This sets up a floating label for the description. -->
        <!-- https://www.youtube.com/watch?v=nJzKi6oIvBA -->
        <!-- https://flowbite.com/docs/forms/floating-label/ -->
        <label
          for="description"
          class="absolute text-gray-500 bg-white transition-all duration-500
                 left-2.5
                 peer-placeholder-shown:translate-y-2 peer-focus:-translate-y-3 -translate-y-3
                 peer-placeholder-shown:scale-100 peer-focus:scale-75 scale-75
                 peer-placeholder-shown:translate-x-0 peer-focus:-translate-x-3 -translate-x-3
                 hover:cursor-text"
          on:click={(event) => {
            document.getElementById('description')?.click();
          }}
          on:keydown={(event) => {
            document.getElementById('description')?.click();
          }}
        >
          Description
        </label>
      </div>
    </div>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2 max-w-screen-md group">
      <!-- TODO(Chris): Allow for typing of account name -->
      <!-- NOTE(Chris): We use the reference for the debitCredit itself as the key
           for this list. This is because we don't have a lasting, unique ID for
           each debit/credit while simply in the front-end. -->
      {#each jsonData.debitsCredits as debitCredit, i (debitCredit)}
        <div
          class="invisible group-hover:visible col-start-3 ml-auto flex gap-x-1 hover:cursor-pointer"
        >
          {#if i == jsonData.debitsCredits.length - 1}
            <span
              class="text-green-600 translate-y-1/4 hover:text-green-400 hover:cursor-pointer"
              on:click={onClickNewDebitCredit}
              on:keypress={onClickNewDebitCredit}
            >
              <Fa icon={faCirclePlus} />
            </span>
          {/if}
          <span
            class="translate-y-1/4 text-red-600 hover:text-red-400"
            on:click={(event) => onClickDeleteDebitCredit(event, debitCredit)}
            on:keydown={(event) => onClickDeleteDebitCredit(event, debitCredit)}
          >
            <Fa icon={faTrash} />
          </span>
        </div>
        <div class="col-start-4 col-span-7 flex">
          <DropDown bind:outId={debitCredit.accountId} accounts={data.accounts} />
        </div>
        <!-- TODO(Chris): Check that all of the amounts add up to 0 -->
        <input
          type="number"
          bind:value={debitCredit.amount}
          class="col-span-2 px-2 py-1 bg-orange-100 hover:bg-orange-50 rounded-lg shadow-sm"
          on:keydown={(event) => {
            if (event.key == 'Enter') {
              onClickNewTransactionCreate();
            }
          }}
        />
      {/each}
    </div>
    <Button
      type="button"
      color={ButtonColor.Blue}
      class="mt-3 p-2 float-right"
      on:click={onClickNewTransactionCreate}
    >
      Create
    </Button>
  </form>

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
          <div class="flex invisible group-hover:visible">
            <span
              class="text-red-600 hover:text-red-400 hover:cursor-pointer"
              on:click={(event) => onClickDeleteTransaction(event, transaction.id)}
              on:keydown={(event) => onClickDeleteTransaction(event, transaction.id)}
            >
              <Fa icon={faTrash} />
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
