<script>
  import { onMount } from 'svelte';
  import TournamentForm from '../components/TournamentForm.svelte';
  import TournamentTable from '../components/TournamentTable.svelte';
  import tournamentService from '../services/tournamentService.js';

  let tournaments = [];
  let searchTerm = '';
  let editingTournament = null;
  let message = '';

  onMount(() => {
    tournaments = tournamentService.getAllTournaments();
  });

  const refreshTournaments = (nextTournaments) => {
    tournaments = nextTournaments;
  };

  const handleSave = (event) => {
    const payload = event.detail;

    if (!payload.name || !payload.location || !payload.date) {
      message = 'Tournament name, location, and date are required.';
      return;
    }

    if (editingTournament) {
      refreshTournaments(
        tournamentService.updateTournament(editingTournament.id, {
          ...editingTournament,
          ...payload,
        })
      );
      message = 'Tournament updated successfully.';
    } else {
      refreshTournaments(
        tournamentService.addTournament(payload)
      );
      message = 'Tournament added successfully.';
    }

    editingTournament = null;
  };

  const handleEdit = (event) => {
    editingTournament = event.detail;
    message = 'Editing tournament details.';
  };

  const handleDelete = (event) => {
    refreshTournaments(tournamentService.deleteTournament(event.detail));
    if (editingTournament?.id === event.detail) {
      editingTournament = null;
    }
    message = 'Tournament deleted successfully.';
  };

  $: filteredTournaments = tournamentService.searchTournaments(tournaments, searchTerm);
</script>

<section class="page-stack">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Tournament Management</p>
      <h1>Tournaments</h1>
    </div>

    <div class="search-box">
      <input bind:value={searchTerm} type="search" placeholder="Search tournaments" />
    </div>
  </div>

  {#if message}
    <div class="info-banner">{message}</div>
  {/if}

  <div class="grid-two">
    <TournamentForm tournament={editingTournament} on:save={handleSave} />
    <TournamentTable tournaments={filteredTournaments} on:edit={handleEdit} on:delete={handleDelete} />
  </div>
</section>
