<script>
  import Router from 'svelte-spa-router';
  import Layout from './components/Layout.svelte';
  import Dashboard from './pages/Dashboard.svelte';
  import Players from './pages/Players.svelte';
  import Tournaments from './pages/Tournaments.svelte';
  import Matches from './pages/Matches.svelte';
  import Rankings from './pages/Rankings.svelte';
  import NotFound from './pages/NotFound.svelte';

  const routes = {
    '/': Dashboard,
    '/dashboard': Dashboard,
    '/players': Players,
    '/tournaments': Tournaments,
    '/matches': Matches,
    '/rankings': Rankings,
    '*': NotFound,
  };
</script>

<Layout>
  <Router {routes} />
</Layout>
