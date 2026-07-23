<script>
  import Navbar from './Navbar.svelte';
  import Sidebar from './Sidebar.svelte';
</script>

<div class="layout-shell">
  <Navbar />
  <div class="layout-content">
    <Sidebar />
    <main>
      <slot />
    </main>
  </div>
</div>
