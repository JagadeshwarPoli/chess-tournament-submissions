<script>
  export let podium = [];
</script>

<section class="card panel">
  <div class="panel-header">
    <div>
      <p class="eyebrow">Tournament Podium</p>
      <h2>Final Standings</h2>
    </div>
  </div>

  {#if podium.length === 0}
    <p class="empty-state">No rankings available yet.</p>
  {:else}
    <div class="podium-grid">
      {#each podium as place}
        <div class="podium-card">
          <p class="place-label">{place.label}</p>
          <h3>{place.player?.name || 'Unknown Player'}</h3>
          <p>Rating: {place.player?.rating ?? 'N/A'}</p>
          <p>Country: {place.player?.country || 'N/A'}</p>
        </div>
      {/each}
    </div>
  {/if}
</section>
