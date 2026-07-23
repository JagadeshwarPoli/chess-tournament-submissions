<script>
  import { onMount } from 'svelte';
  import PlayerForm from '../components/PlayerForm.svelte';
  import PlayerTable from '../components/PlayerTable.svelte';
  import playerService from '../services/playerService.js';

  let players = [];
  let searchTerm = '';
  let editingPlayer = null;
  let message = '';

  onMount(() => {
    players = playerService.getPlayers();
  });

  const persistPlayers = (nextPlayers) => {
    players = playerService.savePlayers(nextPlayers);
  };

  const handleSave = (event) => {
    const payload = event.detail;

    if (!payload.name) {
      message = 'Player name is required.';
      return;
    }

    if (editingPlayer) {
      persistPlayers(
        playerService.updatePlayer(editingPlayer.id, {
          ...editingPlayer,
          ...payload,
        })
      );
      message = 'Player updated successfully.';
    } else {
      persistPlayers(
        playerService.createPlayer(payload)
      );
      message = 'Player added successfully.';
    }

    editingPlayer = null;
  };

  const handleEdit = (event) => {
    editingPlayer = event.detail;
    message = 'Editing player details.';
  };

  const handleDelete = (event) => {
    persistPlayers(playerService.deletePlayer(event.detail));
    if (editingPlayer?.id === event.detail) {
      editingPlayer = null;
    }
    message = 'Player deleted successfully.';
  };

  $: filteredPlayers = playerService.searchPlayers(players, searchTerm);
</script>

<section class="page-stack">
  <div class="page-heading">
    <div>
      <p class="eyebrow">Player Management</p>
      <h1>Players</h1>
    </div>

    <div class="search-box">
      <input bind:value={searchTerm} type="search" placeholder="Search players" />
    </div>
  </div>

  {#if message}
    <div class="info-banner">{message}</div>
  {/if}

  <div class="grid-two">
    <PlayerForm player={editingPlayer} on:save={handleSave} />
    <PlayerTable players={filteredPlayers} on:edit={handleEdit} on:delete={handleDelete} />
  </div>
</section>
