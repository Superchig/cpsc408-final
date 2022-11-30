<script lang="ts">
  import '$lib/app.css';
  import type { DebitCredit } from '$lib/transaction';

  export let debitCredit: DebitCredit;
  export let onEnterDown: () => void;

  let displayValue = '';

  $: {
    const candidateNum = Number(displayValue);

    if (!isNaN(candidateNum)) {
        debitCredit.amount = candidateNum * 100;
    } else {
        debitCredit.amount = 0;
    }
  }
</script>

<!-- TODO(Chris): Add placeholder that uses USD format -->
<input
  type="text"
  bind:value={displayValue}
  class="col-span-2 px-2 py-1 bg-orange-100 hover:bg-orange-50 rounded-lg shadow-sm"
  on:keydown={(event) => {
    if (event.key == 'Enter') {
      onEnterDown();
    }
  }}
/>

<style>
</style>
