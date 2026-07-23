import storageService from './storageService.js';
import tournamentService from './tournamentService.js';
import playerService from './playerService.js';
import { randomId } from '../utils/random.js';

const MATCHES_KEY = 'chess-matches';

const readMatches = () => {
  const stored = storageService.get(MATCHES_KEY, []);
  return Array.isArray(stored) ? stored : [];
};

const writeMatches = (matches) => {
  storageService.set(MATCHES_KEY, matches);
  return matches;
};

const mapPlayersToNames = (matches = []) => {
  const players = playerService.getPlayers();
  const playerMap = new Map(players.map((player) => [player.id, player]));

  return matches.map((match) => ({
    ...match,
    player1Name: playerMap.get(match.player1)?.name || 'Unknown Player',
    player2Name: playerMap.get(match.player2)?.name || 'Bye',
    winnerName: playerMap.get(match.winner)?.name || 'Pending',
  }));
};

const matchService = {
  getAllMatches: () => readMatches(),
  shufflePlayers: (players = []) => {
    const nextPlayers = [...players];

    for (let index = nextPlayers.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [nextPlayers[index], nextPlayers[swapIndex]] = [nextPlayers[swapIndex], nextPlayers[index]];
    }

    return nextPlayers;
  },
  pickRandomWinner: (player1, player2) => {
    if (!player1 || !player2) {
      return player1 || player2;
    }

    return Math.random() >= 0.5 ? player1 : player2;
  },
  generateRounds: (players = []) => {
    if (players.length < 2) {
      return [];
    }

    const rounds = [];
    let currentPlayers = matchService.shufflePlayers(players);
    let round = 1;

    while (currentPlayers.length > 1) {
      const nextRoundPlayers = [];
      const roundMatches = [];
      const playersInRound = [...currentPlayers];

      for (let index = 0; index < playersInRound.length; index += 2) {
        const player1 = playersInRound[index];
        const player2 = playersInRound[index + 1];

        if (!player2) {
          nextRoundPlayers.push(player1);
          continue;
        }

        const winner = matchService.pickRandomWinner(player1, player2);
        roundMatches.push({
          id: randomId(),
          player1: player1.id,
          player2: player2.id,
          winner: winner.id,
          playedAt: new Date().toISOString(),
        });
        nextRoundPlayers.push(winner);
      }

      rounds.push({
        round,
        matches: roundMatches,
      });

      currentPlayers = nextRoundPlayers;
      round += 1;
    }

    return rounds;
  },
  playRound: (tournamentId, roundNumber, players = []) => {
    const roundMatches = matchService.generateRounds(players);

    return roundMatches.map((round) => {
      const savedRound = {
        round: roundNumber,
        matches: round.matches.map((match) => {
          const matchRecord = {
            id: randomId(),
            tournamentId,
            round: roundNumber,
            player1: match.player1,
            player2: match.player2,
            winner: match.winner,
            playedAt: match.playedAt,
          };

          matchService.saveMatch(matchRecord);
          return matchRecord;
        }),
      };

      return savedRound;
    });
  },
  saveMatch: (match) => {
    const matches = readMatches();
    const nextMatches = [...matches, match];
    writeMatches(nextMatches);
    return nextMatches;
  },
  getMatchesByTournament: (tournamentId) => {
    const matches = readMatches().filter((match) => match.tournamentId === tournamentId);
    return mapPlayersToNames(matches.sort((left, right) => left.round - right.round));
  },
  getTournamentWinner: (tournamentId) => {
    const matches = matchService.getMatchesByTournament(tournamentId);
    if (!matches.length) {
      return null;
    }

    const latestRound = matches.reduce((highest, match) => Math.max(highest, match.round), 0);
    const winnerMatch = matches
      .filter((match) => match.round === latestRound)
      .sort((left, right) => right.playedAt.localeCompare(left.playedAt))[0];

    if (!winnerMatch) {
      return null;
    }

    return playerService.getPlayers().find((player) => player.id === winnerMatch.winner) || null;
  },
  generateMatches: (tournamentId) => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    const allPlayers = playerService.getPlayers();
    const tournamentPlayers = (Array.isArray(tournament?.players) ? tournament.players : [])
      .map((playerId) => allPlayers.find((player) => player.id === playerId))
      .filter(Boolean);

    if (!tournament || tournamentPlayers.length < 2) {
      return {
        rounds: [],
        champion: null,
        error: 'A tournament must have at least 2 assigned players before generating matches.',
      };
    }

    const existingMatches = matchService.getMatchesByTournament(tournamentId);
    if (existingMatches.length > 0) {
      return {
        rounds: matchService.groupRounds(existingMatches),
        champion: matchService.getTournamentWinner(tournamentId),
        error: 'Matches already exist for this tournament. Reset the bracket to generate again.',
      };
    }

    let currentPlayers = matchService.shufflePlayers(tournamentPlayers);
    const rounds = [];
    let roundNumber = 1;

    while (currentPlayers.length > 1) {
      const nextRoundPlayers = [];
      const roundMatches = [];

      for (let index = 0; index < currentPlayers.length; index += 2) {
        const player1 = currentPlayers[index];
        const player2 = currentPlayers[index + 1];

        if (!player2) {
          nextRoundPlayers.push(player1);
          continue;
        }

        const winner = matchService.pickRandomWinner(player1, player2);
        const matchRecord = {
          id: randomId(),
          tournamentId,
          round: roundNumber,
          player1: player1.id,
          player2: player2.id,
          winner: winner.id,
          playedAt: new Date().toISOString(),
        };

        matchService.saveMatch(matchRecord);
        roundMatches.push({
          ...matchRecord,
          player1Name: player1.name,
          player2Name: player2.name,
          winnerName: winner.name,
        });
        nextRoundPlayers.push(winner);
      }

      rounds.push({
        round: roundNumber,
        matches: roundMatches,
      });

      currentPlayers = nextRoundPlayers;
      roundNumber += 1;
    }

    return {
      rounds,
      champion: currentPlayers[0] || null,
    };
  },
  groupRounds: (matches = []) => {
    const grouped = matches.reduce((accumulator, match) => {
      const roundNumber = match.round;
      if (!accumulator[roundNumber]) {
        accumulator[roundNumber] = [];
      }

      accumulator[roundNumber].push(match);
      return accumulator;
    }, {});

    return Object.entries(grouped)
      .sort((left, right) => Number(left[0]) - Number(right[0]))
      .map(([round, items]) => ({
        round: Number(round),
        matches: items,
      }));
  },
};

export default matchService;
