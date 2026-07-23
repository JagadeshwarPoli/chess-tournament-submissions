<script>
  export let match = null;
</script>

<div class="match-card">
  <p class="eyebrow">Match</p>
  <h3>{match?.player1Name || 'Player 1'} vs {match?.player2Name || 'Player 2'}</h3>
  <p>Winner: {match?.winnerName || 'Pending'}</p>
</div>
