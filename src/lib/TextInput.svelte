<script lang="ts">
  import '$lib/app.css';

  export let value: string | undefined = '';
  export let name: string | undefined = undefined;

  let className = '';

  // https://navillus.dev/blog/svelte-class-props
  export { className as class };
</script>

<input type="text" class={'bg-blue-200 rounded-lg shadow-md hover:bg-blue-100 ' + className} {name} bind:value />

<style>
</style>
