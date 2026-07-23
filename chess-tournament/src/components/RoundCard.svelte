<script>
  export let round = null;
</script>

<section class="card panel">
  <div class="panel-header">
    <h3>Round {round?.round || 1}</h3>
  </div>

  {#if round?.matches?.length}
    <div class="round-list">
      {#each round.matches as match}
        <div class="match-row">
          <span>{match.player1Name} vs {match.player2Name}</span>
          <strong>{match.winnerName}</strong>
        </div>
      {/each}
    </div>
  {/if}
</section>
