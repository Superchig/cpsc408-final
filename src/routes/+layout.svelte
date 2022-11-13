<script lang="ts">
  import { NavbarTab, navbarTab } from '$lib/stores';

  let currentTab: NavbarTab | undefined = undefined;

  navbarTab.subscribe((tab) => {
    currentTab = tab;
  });

  const getTabClasses = (tab: NavbarTab): string => {
    if (tab == currentTab) {
      return 'text-orange-600';
    } else {
      return '';
    }
  };
</script>

<svelte:head>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Atkinson+Hyperlegible" />
</svelte:head>

<nav class="shadow-md p-2">
  <div class="m-auto max-w-screen-lg">
    <div class="flex justify-between items-center">
      <a
        href="/"
        class="p-2 text-xl font-extrabold hover:text-white hover:bg-orange-600 hover:rounded-md hover:shadow-md"
      >
        Home
      </a>
      <div class="flex space-x-8">
        <a
          href="/"
          class={'text-lg hover:underline hover:text-blue-500 ' +
            getTabClasses(NavbarTab.Transactions)}
        >
          Transactions
        </a>
        <a
          href="/"
          class={'text-lg hover:underline hover:text-blue-500 ' + getTabClasses(NavbarTab.Accounts)}
        >
          Accounts
        </a>
      </div>
    </div>
  </div>
</nav>

<slot />

<style>
</style>
