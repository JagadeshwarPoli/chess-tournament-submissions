<script>
  import { onMount } from 'svelte';
  import playerService from '../services/playerService.js';
  import tournamentService from '../services/tournamentService.js';
  import matchService from '../services/matchService.js';
  import rankingService from '../services/rankingService.js';

  let totalPlayers = 0;
  let totalTournaments = 0;
  let totalMatches = 0;
  let totalChampions = 0;

  const refreshStats = () => {
    const players = playerService.getPlayers();
    const tournaments = tournamentService.getAllTournaments();
    const allMatches = matchService.getAllMatches();
    const rankingEntries = rankingService.getRankings();

    totalPlayers = players.length;
    totalTournaments = tournaments.length;
    totalMatches = Array.isArray(allMatches) ? allMatches.length : 0;
    totalChampions = rankingEntries.length;
  };

  onMount(() => {
    refreshStats();
    const sync = () => refreshStats();
    window.addEventListener('storage', sync);

    return () => window.removeEventListener('storage', sync);
  });

  $: if (typeof window !== 'undefined') {
    refreshStats();
  }
</script>

<section class="dashboard-panel">
  <div class="welcome-card">
    <div>
      <p class="eyebrow">Overview</p>
      <h2>Welcome to your tournament hub</h2>
      <p>Track players, review upcoming fixtures, and monitor rankings from a single responsive workspace.</p>
    </div>
    <button class="primary-button" type="button">New Tournament</button>
  </div>

  <div class="stats-grid">
    <article class="stat-card">
      <span>👤 Total Players</span>
      <strong>{totalPlayers}</strong>
    </article>
    <article class="stat-card">
      <span>🏆 Total Tournaments</span>
      <strong>{totalTournaments}</strong>
    </article>
    <article class="stat-card">
      <span>⚔ Total Matches</span>
      <strong>{totalMatches}</strong>
    </article>
    <article class="stat-card">
      <span>🥇 Champions</span>
      <strong>{totalChampions}</strong>
    </article>
  </div>
</section>
