<script lang="ts">
  import { faDollarSign } from '@fortawesome/free-solid-svg-icons';
  import Fa from 'svelte-fa';
</script>

<svelte:head>
  <link
    rel="stylesheet"
    href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible"
  />
</svelte:head>

<nav class="shadow-md p-3">
  <div class="m-auto max-w-screen-lg">
    <div class="flex justify-between items-center">
      <a href="/" class="p-2 text-2xl font-extrabold hover:text-white hover:bg-orange-600 hover:rounded-md hover:shadow-md">Home</a>
      <!-- <Fa icon={faDollarSign} class="text-2xl text-green-600" /> -->
      <div class="float-right">
        <div class="flex space-x-8">
          <a href="/" class="text-lg hover:underline hover:text-blue-500">Transactions</a>
          <a href="/" class="text-lg hover:underline hover:text-blue-500">Accounts</a>
        </div>
      </div>
    </div>
  </div>
</nav>

<slot />

<style>
</style>
