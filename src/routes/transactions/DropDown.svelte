<script lang="ts">
  import type { Account } from '$lib/account';

  export let accounts: Account[];

  let isMenuOpen = false;
</script>

<input
  type="text"
  class="flex-auto px-2 py-1 bg-gray-200 hover:bg-gray-100 rounded-lg shadow-sm"
  on:focusin={(event) => (isMenuOpen = true)}
  on:focusout={(event) => (isMenuOpen = false)}
/>

{#if isMenuOpen}
  <ul class="absolute translate-y-9 p-2 bg-white rounded-md shadow-md">
    {#each accounts as account}
      <li>{account.full_name}</li>
    {/each}
  </ul>
{/if}

<style>
</style>
