<script>
  import { createEventDispatcher } from 'svelte';

  /** @type {{ id?: string; name?: string; title?: string; rating?: number; country?: string } | null} */
  export let player = null;

  const dispatch = createEventDispatcher();

  /** @type {{ name: string; title: string; rating: number; country: string }} */
  let form = {
    name: '',
    title: '',
    rating: 0,
    country: '',
  };

  /** @type {string | null} */
  let currentId = null;

  /** @type {() => void} */
  const resetForm = () => {
    form = { name: '', title: '', rating: 0, country: '' };
    currentId = null;
  };

  /** @type {(value: { id?: string; name?: string; title?: string; rating?: number; country?: string } | null) => void} */
  const applyPlayer = (value) => {
    if (!value) {
      resetForm();
      return;
    }

    currentId = value.id || null;
    form = {
      name: value.name || '',
      title: value.title || '',
      rating: value.rating || 0,
      country: value.country || '',
    };
  };

  $: if (player !== null && player !== undefined) {
    if (currentId !== (player.id ?? null)) {
      applyPlayer(player);
    }
  } else if (currentId !== null) {
    resetForm();
  }

  const handleSubmit = () => {
    dispatch('save', {
      name: form.name.trim(),
      title: form.title.trim(),
      rating: Number(form.rating) || 0,
      country: form.country.trim(),
    });
  };
</script>

<section class="card panel">
  <div class="panel-header">
    <h2>{player ? 'Edit Player' : 'Add Player'}</h2>
  </div>

  <form class="stack-form" on:submit|preventDefault={handleSubmit}>
    <label>
      <span>Player Name</span>
      <input bind:value={form.name} type="text" placeholder="e.g. Alice Johnson" required />
    </label>

    <label>
      <span>Title</span>
      <input bind:value={form.title} type="text" placeholder="e.g. International Master" />
    </label>

    <label>
      <span>Rating</span>
      <input bind:value={form.rating} type="number" min="0" placeholder="1800" />
    </label>

    <label>
      <span>Country</span>
      <input bind:value={form.country} type="text" placeholder="e.g. India" />
    </label>

    <button class="primary-button" type="submit">
      {player ? 'Update Player' : 'Save Player'}
    </button>
  </form>
</section>
