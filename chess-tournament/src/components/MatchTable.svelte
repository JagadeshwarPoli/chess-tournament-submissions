<script>
  export let rounds = [];
  export let champion = null;
</script>

<section class="card panel">
  <div class="panel-header">
    <div>
      <p class="eyebrow">Bracket Results</p>
      <h2>Round-by-Round</h2>
    </div>
  </div>

  {#if rounds.length === 0}
    <p class="empty-state">Generate a bracket to view match rounds.</p>
  {:else}
    <div class="round-stack">
      {#each rounds as round}
        <section class="round-card">
          <div class="panel-header">
            <h3>Round {round.round}</h3>
            <span>{round.matches.length} match(es)</span>
          </div>

          <div class="round-list">
            {#each round.matches as match}
              <div class="match-row">
                <span>{match.player1Name} vs {match.player2Name}</span>
                <strong>Winner: {match.winnerName}</strong>
              </div>
            {/each}
          </div>
        </section>
      {/each}
    </div>
  {/if}

  {#if champion}
    <div class="champion-banner">
      <span>Champion</span>
      <strong>{champion.name}</strong>
    </div>
  {/if}
</section>
