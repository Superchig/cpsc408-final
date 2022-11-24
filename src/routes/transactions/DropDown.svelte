<script lang="ts">
  import type { Account } from '$lib/account';

  export let accounts: Account[];
  export let outValue: any;

  const CLASS_DROP_DOWN_LIST = 'drop_down_list';
  const CLASS_TEXT_INPUT = 'drop_down_text_input';

  let displayValue = '';
  let isMenuOpen = false;
  let filteredAccounts = accounts;

  $: {
    // TODO(Chris): Fuzzy-search for accounts, perhaps using https://fusejs.io/
    filteredAccounts = accounts.filter((account) => account.full_name?.includes(displayValue));
  }

  const onFocusOut = (event: FocusEvent) => {
    for (const elem of document.querySelectorAll(':hover')) {
      if (elem.classList.contains(CLASS_DROP_DOWN_LIST)) {
        return;
      }
    }

    isMenuOpen = false;
  };

  const onMouseLeave = (event: Event) => {
    if (window.document.activeElement?.classList.contains(CLASS_TEXT_INPUT)) {
      return;
    }

    isMenuOpen = false;
  };

  const onClickItemSuggestion = (event: Event, account: Account) => {
    displayValue = account.full_name!;
    outValue = account.id;

    isMenuOpen = false;
  };

  const onMouseOver = (event: Event) => {
    const elem = event.target as HTMLElement;
    elem.focus();
  };
</script>

<input
  type="text"
  class={`${CLASS_TEXT_INPUT} flex-auto px-2 py-1 bg-gray-200 hover:bg-gray-100 rounded-lg shadow-sm peer`}
  on:focusin={() => (isMenuOpen = true)}
  on:focusout={onFocusOut}
  bind:value={displayValue}
/>

{#if isMenuOpen}
  {#if filteredAccounts.length > 0}
    <ul
      class={`${CLASS_DROP_DOWN_LIST} absolute translate-y-9 p-2 bg-white rounded-md shadow-md`}
      on:mouseleave={onMouseLeave}
    >
      {#each filteredAccounts as account}
        <div tabindex="-1"
          class="px-1 rounded-sm focus:bg-orange-400 focus:shadow-sm focus:cursor-pointer"
          on:click={(event) => onClickItemSuggestion(event, account)}
          on:mouseover={onMouseOver}
          on:focus
          on:keydown={() => {}}
        >
          {account.full_name}
        </div>
      {/each}
    </ul>
  {/if}
{/if}

<style>
</style>
