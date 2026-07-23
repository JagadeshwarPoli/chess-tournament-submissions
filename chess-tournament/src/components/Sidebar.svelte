<script>
  import { onMount } from 'svelte';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Players', href: '/players' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Matches', href: '/matches' },
    { label: 'Rankings', href: '/rankings' },
  ];

  let currentPath = '/dashboard';

  const syncPath = () => {
    const hash = window.location.hash || '#/dashboard';
    currentPath = hash.startsWith('#/') ? hash.slice(1) : hash;
  };

  onMount(() => {
    syncPath();
    window.addEventListener('hashchange', syncPath);

    return () => window.removeEventListener('hashchange', syncPath);
  });
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <p class="eyebrow">Navigation</p>
    <h2>Control Center</h2>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <a href={'#' + item.href} class:active={currentPath === item.href} class="sidebar-link">
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
