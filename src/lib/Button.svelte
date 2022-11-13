<script context="module" lang="ts">
  export enum ButtonColor {
    // NOTE(Chris): We avoid starting at 0 because 0 is falsy in Javascript
    Blue = 1,
    Red,
    SwapBlue,
    SwapRed
  }
</script>

<script lang="ts">
  import '$lib/app.css';

  export let type: string | undefined = undefined;
  export let color: ButtonColor | undefined = undefined;

  let className = '';

  export { className as class };

  const getColorClasses = (color: ButtonColor): string => {
    switch (color) {
      case ButtonColor.Blue:
        return 'bg-blue-500 text-white hover:bg-blue-400';
      case ButtonColor.Red:
        return 'bg-red-500 text-white hover:bg-red-400';
      case ButtonColor.SwapBlue:
        return 'outline outline-1 text-blue-600 hover:text-blue-400';
      case ButtonColor.SwapRed:
        return 'outline outline-1 text-red-600 hover:text-red-400';
    }
  };

  let colorClasses = '';
  if (color) {
    colorClasses = getColorClasses(color);
  }
</script>

<button on:click {type} class={`rounded-lg shadow-md ${colorClasses} ${className}`}>
  <slot />
</button>

<style>
</style>
