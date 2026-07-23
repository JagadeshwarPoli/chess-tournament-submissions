<script>
  import { onMount } from 'svelte';
  import TournamentForm from '../components/TournamentForm.svelte';
  import TournamentTable from '../components/TournamentTable.svelte';
  import AssignPlayersModal from '../components/AssignPlayersModal.svelte';
  import AssignedPlayersTable from '../components/AssignedPlayersTable.svelte';
  import tournamentService from '../services/tournamentService.js';
  import playerService from '../services/playerService.js';

  let tournaments = [];
  let allPlayers = [];
  let searchTerm = '';
  let editingTournament = null;
  let selectedTournament = null;
  let selectedPlayerIds = [];
  let showAssignModal = false;
  let message = '';

  onMount(() => {
    tournaments = tournamentService.getAllTournaments();
    allPlayers = playerService.getPlayers();
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
      refreshTournaments(tournamentService.addTournament(payload));
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

  const openAssignModal = (event) => {
    selectedTournament = event.detail;
    selectedPlayerIds = Array.isArray(selectedTournament?.players) ? [...selectedTournament.players] : [];
    showAssignModal = true;
  };

  const closeAssignModal = () => {
    showAssignModal = false;
    selectedTournament = null;
    selectedPlayerIds = [];
  };

  const handleSelectionChange = (event) => {
    selectedPlayerIds = event.detail;
  };

  const handleSaveAssignments = () => {
    if (!selectedTournament) {
      return;
    }

    const nextTournaments = tournamentService.updateTournament(selectedTournament.id, {
      ...selectedTournament,
      players: selectedPlayerIds,
    });

    refreshTournaments(nextTournaments);
    message = selectedPlayerIds.length >= 2
      ? 'Assignments saved successfully.'
      : 'A tournament must have at least 2 players before matches can be generated.';

    closeAssignModal();
  };

  const assignedPlayers = tournamentService.getAssignedPlayers(selectedTournament?.id, allPlayers);

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
    <div class="stack-column">
      <TournamentTable
        tournaments={filteredTournaments}
        on:edit={handleEdit}
        on:delete={handleDelete}
        on:assign={openAssignModal}
      />
      <AssignedPlayersTable assignedPlayers={assignedPlayers} />
    </div>
  </div>

  {#if showAssignModal && selectedTournament}
    <AssignPlayersModal
      tournament={selectedTournament}
      players={allPlayers}
      selectedIds={selectedPlayerIds}
      on:cancel={closeAssignModal}
      on:selection-change={handleSelectionChange}
      on:save={handleSaveAssignments}
    />
  {/if}
</section>
