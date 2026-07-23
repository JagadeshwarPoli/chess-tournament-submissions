<script>
  import { onMount } from 'svelte';
  import Podium from '../components/Podium.svelte';
  import tournamentService from '../services/tournamentService.js';
  import rankingService from '../services/rankingService.js';
  import playerService from '../services/playerService.js';

  let tournaments = [];
  let selectedTournamentId = '';
  let podium = [];
  let message = '';

  onMount(() => {
    tournaments = tournamentService.getAllTournaments();
    const storedRankings = rankingService.getRankings();

    if (selectedTournamentId && storedRankings.length) {
      const ranking = storedRankings.find((entry) => entry.tournamentId === selectedTournamentId);
      if (ranking) {
        renderPodium(ranking);
      }
    }
  });

  const renderPodium = (ranking) => {
    const players = playerService.getPlayers();
    const podiumEntries = [
      { label: '🥇 First Place', player: players.find((player) => player.id === ranking.firstPlace) },
      { label: '🥈 Second Place', player: players.find((player) => player.id === ranking.secondPlace) },
      { label: '🥉 Third Place', player: players.find((player) => player.id === ranking.thirdPlace) },
    ];

    podium = podiumEntries;
  };

  const handleGenerate = () => {
    const ranking = rankingService.generateRankings(selectedTournamentId);

    if (!ranking) {
      message = 'A tournament needs at least 2 assigned players and completed matches before rankings can be generated.';
      podium = [];
      return;
    }

    const stored = rankingService.getRankings();
    const current = stored.find((entry) => entry.tournamentId === selectedTournamentId);

    if (current) {
      renderPodium(current);
      message = 'Rankings updated successfully.';
    }
  };

  $: if (selectedTournamentId) {
    const stored = rankingService.getRankings();
    const current = stored.find((entry) => entry.tournamentId === selectedTournamentId);
    if (current) {
      renderPodium(current);
    }
  }
</script>

<section class="page-stack">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Final Results</p>
      <h1>Rankings</h1>
    </div>
  </div>

  {#if message}
    <div class="info-banner">{message}</div>
  {/if}

  <div class="grid-two">
    <section class="card panel">
      <div class="panel-header">
        <div>
          <p class="eyebrow">Choose Tournament</p>
          <h2>View Podium</h2>
        </div>
      </div>

      <div class="form-grid matcher-grid">
        <label class="field">
          <span>Tournament</span>
          <select bind:value={selectedTournamentId}>
            <option value="">Select a tournament</option>
            {#each tournaments as tournament}
              <option value={tournament.id}>{tournament.name}</option>
            {/each}
          </select>
        </label>

        <button class="primary-button" type="button" on:click={handleGenerate} disabled={!selectedTournamentId}>
          Generate Rankings
        </button>
      </div>
    </section>

    <Podium podium={podium} />
  </div>
</section>
