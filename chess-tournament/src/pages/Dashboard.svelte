<script>
  import { onMount } from 'svelte';
  import tournamentService from '../services/tournamentService.js';

  let totalTournaments = 0;

  const refreshCount = () => {
    totalTournaments = tournamentService.getAllTournaments().length;
  };

  onMount(() => {
    refreshCount();
    const sync = () => refreshCount();
    window.addEventListener('storage', sync);

    return () => window.removeEventListener('storage', sync);
  });

  $: if (typeof window !== 'undefined') {
    totalTournaments = tournamentService.getAllTournaments().length;
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
      <span>Players</span>
      <strong>128</strong>
    </article>
    <article class="stat-card">
      <span>Total Tournaments</span>
      <strong>{totalTournaments}</strong>
    </article>
    <article class="stat-card">
      <span>Matches</span>
      <strong>46</strong>
    </article>
    <article class="stat-card">
      <span>Live Rankings</span>
      <strong>#3</strong>
    </article>
  </div>
</section>
