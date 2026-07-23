import storageService from './storageService.js';
import { randomId } from '../utils/random.js';

const TOURNAMENTS_KEY = 'tournaments';

const defaultTournaments = [
  {
    id: 't1',
    name: 'Summer Chess Championship',
    location: 'Bangalore',
    date: '2026-07-30',
    players: [],
  },
  {
    id: 't2',
    name: 'City Open Cup',
    location: 'Mumbai',
    date: '2026-08-12',
    players: [],
  },
];

const readTournaments = () => {
  const stored = storageService.get(TOURNAMENTS_KEY, defaultTournaments);
  return Array.isArray(stored) ? stored : defaultTournaments;
};

const writeTournaments = (tournaments) => {
  storageService.set(TOURNAMENTS_KEY, tournaments);
  return tournaments;
};

const tournamentService = {
  getAllTournaments: () => readTournaments(),
  addTournament: (tournament) => {
    const tournaments = readTournaments();
    const nextTournament = {
      id: randomId(),
      ...tournament,
      players: Array.isArray(tournament.players) ? tournament.players : [],
    };

    return writeTournaments([...tournaments, nextTournament]);
  },
  updateTournament: (id, updates) => {
    const tournaments = readTournaments();
    const nextTournaments = tournaments.map((tournament) =>
      tournament.id === id
        ? {
            ...tournament,
            ...updates,
            players: Array.isArray(updates.players) ? updates.players : tournament.players || [],
          }
        : tournament
    );

    return writeTournaments(nextTournaments);
  },
  deleteTournament: (id) => {
    const tournaments = readTournaments();
    const nextTournaments = tournaments.filter((tournament) => tournament.id !== id);
    return writeTournaments(nextTournaments);
  },
  searchTournaments: (tournaments, query = '') => {
    const term = query.trim().toLowerCase();

    if (!term) {
      return tournaments;
    }

    return tournaments.filter((tournament) => {
      return [tournament.name, tournament.location, tournament.date]
        .join(' ')
        .toLowerCase()
        .includes(term);
    });
  },
  getTournamentById: (id) => {
    return readTournaments().find((tournament) => tournament.id === id) || null;
  },
  saveToLocalStorage: (tournaments) => writeTournaments(tournaments),
};

export default tournamentService;
