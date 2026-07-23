<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {{ id?: string; name?: string; location?: string; date?: string; players?: [] } | null} */
  export let tournament = null;

  const dispatch = createEventDispatcher();

  /** @type {{ name: string; location: string; date: string }} */
  let form = {
    name: '',
    location: '',
    date: '',
  };

  /** @type {string | null} */
  let currentId = null;

  const resetForm = () => {
    form = { name: '', location: '', date: '' };
    currentId = null;
  };

  /** @type {(value: { id?: string; name?: string; location?: string; date?: string; players?: [] } | null) => void} */
  const applyTournament = (value) => {
    if (!value) {
      resetForm();
      return;
    }

    currentId = value.id || null;
    form = {
      name: value.name || '',
      location: value.location || '',
      date: value.date || '',
    };
  };

  $: if (tournament !== null && tournament !== undefined) {
    if (currentId !== (tournament.id ?? null)) {
      applyTournament(tournament);
    }
  } else if (currentId !== null) {
    resetForm();
  }

  const handleSubmit = () => {
    dispatch('save', {
      name: form.name.trim(),
      location: form.location.trim(),
      date: form.date,
    });
  };
</script>

<section class="card panel">
  <div class="panel-header">
    <h2>{tournament ? 'Edit Tournament' : 'Add Tournament'}</h2>
  </div>

  <form class="stack-form" on:submit|preventDefault={handleSubmit}>
    <label>
      <span>Tournament Name</span>
      <input bind:value={form.name} type="text" placeholder="Summer Chess Championship" required />
    </label>

    <label>
      <span>Location</span>
      <input bind:value={form.location} type="text" placeholder="Bangalore" required />
    </label>

    <label>
      <span>Date</span>
      <input bind:value={form.date} type="date" required />
    </label>

    <button class="primary-button" type="submit">
      Save Tournament
    </button>
  </form>
</section>
