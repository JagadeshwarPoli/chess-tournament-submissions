<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {Array<{ id: string; name: string; location: string; date: string; players?: Array<any> }>} */
  export let tournaments = [];

  const dispatch = createEventDispatcher();
</script>

<section class="card panel">
  <div class="panel-header">
    <h2>Tournament Directory</h2>
    <span>{tournaments.length} tournament(s)</span>
  </div>

  {#if tournaments.length === 0}
    <p class="empty-state">No tournaments match the current search.</p>
  {:else}
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Tournament</th>
            <th>Location</th>
            <th>Date</th>
            <th>Players</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {#each tournaments as tournament}
            <tr>
              <td>{tournament.name}</td>
              <td>{tournament.location}</td>
              <td>{tournament.date}</td>
              <td>{(tournament.players || []).length}</td>
              <td>
                <div class="row-actions">
                  <button class="table-button edit" type="button" on:click={() => dispatch('edit', tournament)}>
                    Edit
                  </button>
                  <button class="table-button delete" type="button" on:click={() => dispatch('delete', tournament.id)}>
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
