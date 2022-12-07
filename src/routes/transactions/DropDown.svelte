<script lang="ts">
  import type { Account } from '$lib/account';

  export let accounts: Account[];
  export let outId: number;
  export let menuClass = '';
  export let name: string | undefined = undefined;
  export let id: string | undefined = undefined;
  export { className as class };

  let className = '';
  let displayValue = outId === 0 ? '' : accounts.find((a) => a.id === outId)!.full_name!;
  let isMenuOpen = false;
  let hasFocusedTextInput = false;
  let isFocusedOnTextInput = false;
  let filteredAccounts = accounts;
  let selectedIndex: number | undefined = undefined;

  let inputTextElem: HTMLElement;
  let listElem: HTMLElement;

  $: {
    // TODO(Chris): Fuzzy-search for accounts, perhaps using https://fusejs.io/
    filteredAccounts = accounts.filter((account) => account.full_name?.includes(displayValue));
  }

  $: {
    const candidateId = filteredAccounts.find((account) => account.full_name === displayValue);

    outId = candidateId === undefined ? 0 : candidateId.id!;
  }

  const onFocusOut = (event: FocusEvent) => {
    for (const elem of document.querySelectorAll(':hover')) {
      if (elem === listElem) {
        return;
      }
    }

    if (isOurElement(window.document.activeElement as HTMLElement)) {
      return;
    }

    isMenuOpen = false;
  };

  const onMouseLeave = (event: Event) => {
    if (isOurElement(window.document.activeElement as HTMLElement)) {
      return;
    }

    isMenuOpen = false;
  };

  const isOurElement = (elem: HTMLElement): boolean => {
    return elem === listElem || elem === inputTextElem;
  };

  const onClickItemSuggestion = (event: Event, account: Account) => {
    displayValue = account.full_name!;

    isMenuOpen = false;
  };

  const onKeyDown = (event: KeyboardEvent) => {
    switch (event.key) {
      case 'ArrowDown':
        if (selectedIndex === undefined) {
          selectedIndex = 0;
        } else {
          selectedIndex++;
        }
        break;
      case 'ArrowUp':
        if (selectedIndex === undefined) {
          selectedIndex = 0;
        } else {
          selectedIndex--;
        }
        break;
      case 'Enter':
        if (selectedIndex === undefined) {
          selectedIndex = 0;
        } else {
          displayValue = filteredAccounts[selectedIndex].full_name!;
        }
        selectedIndex = undefined;
        return;
      case 'Tab':
        if (filteredAccounts.length === 1) {
          displayValue = filteredAccounts[0].full_name!;
        }
        selectedIndex = undefined;
        return;
      default:
        selectedIndex = undefined;
        return;
    }

    if (selectedIndex >= filteredAccounts.length) {
      selectedIndex = filteredAccounts.length - 1;
    } else if (selectedIndex < 0) {
      selectedIndex = 0;
    }

    event.preventDefault();
  };
</script>

<input
  type="text"
  {name}
  {id}
  class={'flex-auto px-2 py-1 bg-gray-200 hover:bg-gray-100 rounded-lg shadow-sm peer ' +
    className +
    (outId !== 0 || !hasFocusedTextInput || isFocusedOnTextInput
      ? ' '
      : 'outline outline-1 outline-red-600 bg-yellow-300')}
  on:focusin={() => {
    isMenuOpen = true;
    hasFocusedTextInput = true;
    isFocusedOnTextInput = true;
  }}
  on:focusout={(event) => {
    onFocusOut(event);

    isFocusedOnTextInput = false;
  }}
  bind:value={displayValue}
  bind:this={inputTextElem}
  on:keydown={onKeyDown}
/>

{#if isMenuOpen}
  {#if filteredAccounts.length > 0}
    <ul
      class={'absolute p-2 bg-white rounded-md shadow-md ' + menuClass}
      bind:this={listElem}
      on:mouseleave={onMouseLeave}
    >
      {#each filteredAccounts as account, i}
        <div
          class={'px-1 rounded-sm hover:cursor-pointer ' +
            (selectedIndex === i ? 'bg-orange-400 shadow-sm' : '')}
          on:click={(event) => onClickItemSuggestion(event, account)}
          on:mouseover={() => (selectedIndex = i)}
          on:focus={null}
          on:keydown={null}
        >
          {account.full_name}
        </div>
      {/each}
    </ul>
  {/if}
{/if}

<style>
</style>
