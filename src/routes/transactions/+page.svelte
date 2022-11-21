<script lang="ts">
  import type { PageData } from './$types';
  import '$lib/app.css';

  export let data: PageData;
</script>

<div class="m-4 mx-auto w-max">
  <h1 class="text-2xl mb-3">Transactions</h1>

  <form>
    <select id="account_1">
      {#each data.accounts as account}
        <option value={account.id}>{account.full_name}</option>
      {/each}
    </select>
    <select id="account_2">
      {#each data.accounts as account}
        <option value={account.id}>{account.full_name}</option>
      {/each}
    </select>
  </form>
</div>

<style>
</style>
