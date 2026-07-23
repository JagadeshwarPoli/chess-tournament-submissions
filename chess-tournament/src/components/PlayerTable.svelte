<script>
  import { createEventDispatcher } from 'svelte';

  export let players = [];

  const dispatch = createEventDispatcher();
</script>

<section class="card panel">
  <div class="panel-header">
    <h2>Player Directory</h2>
    <span>{players.length} player(s)</span>
  </div>

  {#if players.length === 0}
    <p class="empty-state">No players match the current search.</p>
  {:else}
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Rating</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each players as player}
            <tr>
              <td>{player.name}</td>
              <td>{player.title || '—'}</td>
              <td>{player.rating || 0}</td>
              <td>
                <div class="row-actions">
                  <button class="table-button edit" type="button" on:click={() => dispatch('edit', player)}>
                    Edit
                  </button>
                  <button class="table-button delete" type="button" on:click={() => dispatch('delete', player.id)}>
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
