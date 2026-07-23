import storageService from './storageService.js';
import tournamentService from './tournamentService.js';
import playerService from './playerService.js';
import matchService from './matchService.js';

const RANKINGS_KEY = 'chess-rankings';

const readRankings = () => {
  const stored = storageService.get(RANKINGS_KEY, []);
  return Array.isArray(stored) ? stored : [];
};

const writeRankings = (rankings) => {
  storageService.set(RANKINGS_KEY, rankings);
  return rankings;
};

const rankingService = {
  getRankings: () => readRankings(),
  saveRankings: (rankings) => writeRankings(rankings),
  generateRankings: (tournamentId) => {
    const tournament = tournamentService.getTournamentById(tournamentId);
    const tournamentPlayers = Array.isArray(tournament?.players) ? tournament.players : [];
    const players = playerService.getPlayers();
    const allMatches = matchService.getMatchesByTournament(tournamentId);

    if (!tournament || tournamentPlayers.length < 2 || allMatches.length === 0) {
      return null;
    }

    const matchedPlayers = players.filter((player) => tournamentPlayers.includes(player.id));
    const champion = matchService.getTournamentWinner(tournamentId);
    const latestRoundMatches = allMatches.filter((match) => match.round === Math.max(...allMatches.map((item) => item.round)));
    const finalMatch = latestRoundMatches[0] || null;

    const runnerUpId = finalMatch
      ? (finalMatch.player1 === finalMatch.winner ? finalMatch.player2 : finalMatch.player1)
      : null;

    const runnerUp = players.find((player) => player.id === runnerUpId) || null;
    const thirdPlaceCandidate = matchedPlayers
      .filter((player) => player.id !== champion?.id && player.id !== runnerUp?.id)
      .sort((left, right) => Number(right.rating || 0) - Number(left.rating || 0))[0] || null;

    const ranking = {
      tournamentId,
      firstPlace: champion?.id || null,
      secondPlace: runnerUp?.id || null,
      thirdPlace: thirdPlaceCandidate?.id || null,
    };

    const rankings = readRankings();
    const nextRankings = [...rankings.filter((entry) => entry.tournamentId !== tournamentId), ranking];
    return writeRankings(nextRankings);
  },
};

export default rankingService;
