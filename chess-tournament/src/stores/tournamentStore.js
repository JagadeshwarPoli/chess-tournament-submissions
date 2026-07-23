import { writable } from 'svelte/store';

const tournamentStore = writable([]);

export const setTournaments = (items) => tournamentStore.set(items);
export const getTournaments = () => tournamentStore;

export default tournamentStore;
