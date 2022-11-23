<script lang="ts">
  import type { PageData } from './$types';
  import '$lib/app.css';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import TextInput from '$lib/TextInput.svelte';
  import ky from 'ky';
  import type { NewTransactionData } from '$lib/transaction';

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

  const onNewTransactionSubmit = async () => {
    await ky.post('/transactions/new', { json: jsonData });

    location.reload();
  };
</script>

<div class="m-4 mx-auto max-w-screen-md">
  <h1 class="text-2xl mb-3">Transactions</h1>

  <!-- TODO(Chris): Give hover effects to all of the input fields -->
  <form class="flow-root">
    <!-- TODO(Chris): Fix bug in which x-ing out the date results in its input
    field changing in width slightly. -->
    <div class="flex mb-3 gap-x-2">
      <!-- https://stackoverflow.com/questions/6982692/how-to-set-input-type-dates-default-value-to-today -->
      <input
        type="date"
        bind:value={jsonData.date}
        class="border rounded-md p-1 bg-gray-50 flex-none shadow-sm"
      />
      <!-- TODO(Chris): Expand TextInput into text area when there's enough text -->
      <!-- TODO(Chris): Use adaptive default value for description... -->
      <TextInput
        name="description"
        bind:value={jsonData.description}
        class="px-2 py-1 flex-auto shadow-sm"
      />
    </div>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2 max-w-screen-md">
      <!-- TODO(Chris): Allow for typing of account name -->
      {#each jsonData.debitsCredits as debitCredit}
        <select
          class="col-start-4 col-span-7 px-0.5 py-1 rounded-lg shadow-sm"
          bind:value={debitCredit.accountId}
        >
          {#each data.accounts as account}
            <option value={account.id}>{account.full_name}</option>
          {/each}
        </select>
        <!-- TODO(Chris): Check that all of the amounts add up to 0 -->
        <input type="number" bind:value={debitCredit.amount} class="col-span-2 px-2 py-1 bg-orange-100 rounded-lg shadow-sm" />
      {/each}
    </div>
    <Button type="button" color={ButtonColor.Blue} class="mt-3 p-2 float-right" on:click={onNewTransactionSubmit}>
      Submit
    </Button>
  </form>
</div>

<style>
</style>
