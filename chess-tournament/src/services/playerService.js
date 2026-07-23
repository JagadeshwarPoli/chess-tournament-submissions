import storageService from './storageService.js';
import { randomId } from '../utils/random.js';

const PLAYERS_KEY = 'chess-players';

const defaultPlayers = [
  { id: 'p1', name: 'Aisha Khan', title: 'International Master', rating: 2024, country: 'India' },
  { id: 'p2', name: 'Liam Brooks', title: 'Grandmaster', rating: 1948, country: 'United Kingdom' },
  { id: 'p3', name: 'Sofia Martinez', title: 'FIDE Master', rating: 1896, country: 'Spain' },
];

const readPlayers = () => {
  const stored = storageService.get(PLAYERS_KEY, defaultPlayers);
  return Array.isArray(stored) ? stored : defaultPlayers;
};

const writePlayers = (players) => {
  storageService.set(PLAYERS_KEY, players);
  return players;
};

const playerService = {
  getPlayers: () => readPlayers(),
  savePlayers: (players) => writePlayers(players),
  createPlayer: (player) => {
    const players = readPlayers();
    const nextPlayer = {
      id: randomId(),
      ...player,
      rating: Number(player.rating) || 0,
      country: player.country?.trim() || 'Unknown',
    };

    return writePlayers([...players, nextPlayer]);
  },
  updatePlayer: (id, updates) => {
    const players = readPlayers();
    const nextPlayers = players.map((player) =>
      player.id === id
        ? {
            ...player,
            ...updates,
            rating: Number(updates.rating) || 0,
            country: updates.country?.trim() || player.country || 'Unknown',
          }
        : player
    );

    return writePlayers(nextPlayers);
  },
  deletePlayer: (id) => {
    const players = readPlayers();
    const nextPlayers = players.filter((player) => player.id !== id);
    return writePlayers(nextPlayers);
  },
  searchPlayers: (players, query = '') => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return players;
    }

    return players.filter((player) => {
      return [player.name, player.title, String(player.rating)]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  },
};

export default playerService;
