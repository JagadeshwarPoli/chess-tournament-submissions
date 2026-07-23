<script>
  import { createEventDispatcher } from 'svelte';

  export let tournament = null;
  export let players = [];
  export let selectedIds = [];

  const dispatch = createEventDispatcher();

  const closeModal = () => dispatch('cancel');

  const handleKeydown = (event) => {
    if (event.key === 'Escape') {
      closeModal();
    }
  };

  const togglePlayer = (playerId) => {
    const next = selectedIds.includes(playerId)
      ? selectedIds.filter((id) => id !== playerId)
      : [...selectedIds, playerId];

    dispatch('selection-change', next);
  };

  const saveAssignments = () => {
    dispatch('save', selectedIds);
  };
</script>

<div class="modal-backdrop" role="presentation" on:click={closeModal}>
  <div
    class="modal-card"
    role="dialog"
    aria-modal="true"
    tabindex="0"
    on:click|stopPropagation
    on:keydown={handleKeydown}
  >
    <div class="panel-header">
      <div>
        <p class="eyebrow">Assign Players</p>
        <h2>{tournament?.name || 'Tournament'}</h2>
      </div>
    </div>

    <div class="modal-list">
      {#each players as player}
        <label class="selector-row">
          <input
            type="checkbox"
            checked={selectedIds.includes(player.id)}
            on:change={() => togglePlayer(player.id)}
          />
          <span>{player.name}</span>
        </label>
      {/each}
    </div>

    <div class="modal-actions">
      <button class="ghost-button" type="button" on:click={closeModal}>Cancel</button>
      <button class="primary-button" type="button" on:click={saveAssignments}>Save</button>
    </div>
  </div>
</div>
