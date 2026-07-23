<script>
  export let assignedPlayers = [];
</script>

<section class="card panel">
  <div class="panel-header">
    <h2>Assigned Players</h2>
    <span>{assignedPlayers.length} assigned</span>
  </div>

  {#if assignedPlayers.length === 0}
    <p class="empty-state">No players assigned yet.</p>
  {:else}
    <div class="table-wrapper">
      <table class="data-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Rating</th>
          </tr>
        </thead>
        <tbody>
          {#each assignedPlayers as player}
            <tr>
              <td>{player.name}</td>
              <td>{player.title || '—'}</td>
              <td>{player.rating || 0}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</section>
