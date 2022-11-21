<script lang="ts">
  import type { PageData } from './$types';
  import '$lib/app.css';
  import Button, { ButtonColor } from '$lib/Button.svelte';
  import TextInput from '$lib/TextInput.svelte';

  export let data: PageData;

  const today = new Date();
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
        value={today.toLocaleDateString('en-CA')}
        class="border rounded-md p-1 bg-gray-50 flex-none shadow-sm"
      />
      <!-- TODO(Chris): Expand TextInput into text area when there's enough text -->
      <!-- TODO(Chris): Use adaptive default value for description... -->
      <TextInput name="description" class="px-2 py-1 flex-auto shadow-sm" />
    </div>
    <div class="grid grid-cols-12 gap-x-3 gap-y-2 max-w-screen-md">
      <!-- TODO(Chris): Allow for typing of account name -->
      {#each { length: 2 } as _, i}
        <select
          id={`account_${i + 1}`}
          name={`account_${i + 1}`}
          class="col-start-4 col-span-7 px-0.5 py-1 rounded-lg shadow-sm"
        >
          {#each data.accounts as account}
            <option value={account.id}>{account.full_name}</option>
          {/each}
        </select>
        <!-- TODO(Chris): Check that all of the amounts add up to 0 -->
        <input
          type="number"
          name={`amount_${i + 1}`}
          class="col-span-2 px-2 py-1 bg-orange-100 rounded-lg shadow-sm"
        />
      {/each}
    </div>
    <Button type="submit" color={ButtonColor.Blue} class="mt-3 p-2 float-right">Submit</Button>
  </form>
</div>

<style>
</style>
