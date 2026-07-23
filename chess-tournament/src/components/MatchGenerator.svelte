<script>
  import { createEventDispatcher } from 'svelte';

  export let tournaments = [];
  export let selectedTournamentId = '';
  export let generating = false;

  const dispatch = createEventDispatcher();

  const handleGenerate = () => {
    if (!selectedTournamentId) {
      return;
    }

    dispatch('generate', selectedTournamentId);
  };
</script>

<section class="card panel">
  <div class="panel-header">
    <div>
      <p class="eyebrow">Random Match System</p>
      <h2>Generate Bracket</h2>
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

    <button class="primary-button" type="button" on:click={handleGenerate} disabled={!selectedTournamentId || generating}>
      {generating ? 'Generating...' : 'Generate Matches'}
    </button>
  </div>
</section>
