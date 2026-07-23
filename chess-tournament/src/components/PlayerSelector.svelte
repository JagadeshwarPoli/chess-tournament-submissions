<script>
  import { createEventDispatcher } from 'svelte';

  export let player = null;
  export let checked = false;

  const dispatch = createEventDispatcher();

  function toggle() {
    dispatch('toggle', player?.id);
  }
</script>

<label class="selector-row">
  <input type="checkbox" checked={checked} on:change={toggle} />
  <span>{player?.name || 'Unknown Player'}</span>
</label>
