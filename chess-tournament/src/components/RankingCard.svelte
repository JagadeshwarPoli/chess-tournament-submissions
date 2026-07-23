<script>
  export let title = 'Ranking';
  export let player = null;
</script>

<div class="rank-card">
  <p class="eyebrow">{title}</p>
  <h3>{player?.name || 'Unknown Player'}</h3>
  <p>Rating: {player?.rating ?? 'N/A'}</p>
  <p>Country: {player?.country || 'N/A'}</p>
</div>
