<script lang="ts">
  import '$lib/app.css';
  import { closeModal } from 'svelte-modals';
  import type { Account } from '$lib/account';
  import BaseModal from './BaseModal.svelte';
  import TextInput from './TextInput.svelte';
  import Button, { ButtonColor } from './Button.svelte';
  import { createChildAccount } from '$lib/routes';

  // Provided by Modals
  export let isOpen: boolean;

  export let parentAccount: Account;

  let newAccountName = '';

  const onKeyDownInFieldName = (event: KeyboardEvent) => {
    if (event.key == 'Enter') {
      const form = document.getElementById('create_child_account') as HTMLFormElement;
      form.submit();
    }
  };
</script>

<BaseModal {isOpen}>
  <form id="create_child_account" method="POST" action={createChildAccount()}>
    <h2 class="text-2xl mb-2">Create child account</h2>

    <hr class="mb-3" />

    <div class="grid grid-cols-2 gap-2">
      <input
        type="text"
        name="parent_account_id"
        value={parentAccount.id}
        hidden
        class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-2 disabled:bg-gray-300 disabled:shadow-none"
      />

      <label for="parent_account_name" class="text-right py-2 mb-2">Parent account:</label>
      <input
        type="text"
        name="parent_account_name"
        bind:value={parentAccount.full_name}
        disabled
        class="bg-blue-100 px-3 py-2 rounded-lg shadow-md mb-2 disabled:bg-gray-300 disabled:shadow-none"
      />

      <label for="new_account_name" class="text-right py-2 mb-2">Name:</label>
      <TextInput
        bind:value={newAccountName}
        on:keydown={onKeyDownInFieldName}
        name="new_account_name"
        class="px-3 py-2 mb-3"
      />
    </div>

    <hr class="mb-2" />

    <div class="actions flow-root">
      <Button on:click={closeModal} color={ButtonColor.SwapBlue} class="p-2 float-left">
        Cancel
      </Button>
      <Button type="submit" color={ButtonColor.Blue} class="p-2 float-right">Submit</Button>
    </div>
  </form>
</BaseModal>

<style>
</style>
