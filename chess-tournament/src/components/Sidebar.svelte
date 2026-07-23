<script>
  import { link } from 'svelte-spa-router';

  const navItems = [
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Players', href: '/players' },
    { label: 'Tournaments', href: '/tournaments' },
    { label: 'Matches', href: '/matches' },
    { label: 'Rankings', href: '/rankings' },
  ];
</script>

<aside class="sidebar">
  <div class="sidebar-header">
    <p class="eyebrow">Navigation</p>
    <h2>Control Center</h2>
  </div>

  <nav class="sidebar-nav">
    {#each navItems as item}
      <a href={item.href} use:link class="sidebar-link">
        {item.label}
      </a>
    {/each}
  </nav>
</aside>
