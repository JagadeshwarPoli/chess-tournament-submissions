<script>
  import { onMount } from 'svelte';
  import MatchGenerator from '../components/MatchGenerator.svelte';
  import MatchTable from '../components/MatchTable.svelte';
  import tournamentService from '../services/tournamentService.js';
  import matchService from '../services/matchService.js';

  let tournaments = [];
  let selectedTournamentId = '';
  let rounds = [];
  let champion = null;
  let message = '';
  let generating = false;

  onMount(() => {
    tournaments = tournamentService.getAllTournaments();
    refreshBracket();
  });

  const refreshBracket = () => {
    if (!selectedTournamentId) {
      rounds = [];
      champion = null;
      return;
    }

    const results = matchService.getMatchesByTournament(selectedTournamentId);
    if (results.length === 0) {
      rounds = [];
      champion = null;
      return;
    }

    rounds = matchService.groupRounds(results);
    champion = matchService.getTournamentWinner(selectedTournamentId);
  };

  const handleGenerate = (event) => {
    const tournamentId = event.detail;
    const tournament = tournaments.find((item) => item.id === tournamentId);
    const assignedPlayerIds = Array.isArray(tournament?.players) ? tournament.players : [];

    if (assignedPlayerIds.length < 2) {
      message = 'A tournament must have at least 2 assigned players before generating matches.';
      rounds = [];
      champion = null;
      return;
    }

    generating = true;
    const result = matchService.generateMatches(tournamentId);
    generating = false;

    selectedTournamentId = tournamentId;
    rounds = result.rounds;
    champion = result.champion;

    if (result.error) {
      message = result.error;
      return;
    }

    message = 'Bracket generated successfully.';
  };

  $: if (selectedTournamentId && tournaments.length) {
    const tournament = tournaments.find((item) => item.id === selectedTournamentId);
    if (tournament) {
      const assignedPlayers = Array.isArray(tournament.players) ? tournament.players : [];
      if (assignedPlayers.length < 2) {
        message = 'Select a tournament with at least 2 assigned players.';
      }
    }
  }
</script>

<section class="page-stack">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Bracket</p>
      <h1>Matches</h1>
    </div>
  </div>

  {#if message}
    <div class="info-banner">{message}</div>
  {/if}

  <div class="grid-two">
    <MatchGenerator
      tournaments={tournaments}
      bind:selectedTournamentId
      generating={generating}
      on:generate={handleGenerate}
    />

    <MatchTable rounds={rounds} champion={champion} />
  </div>
</section>
