import { getGameId } from '../pgn-decoder/pgn.ts'

export const gamesArchive = await Deno.openKv("archive");

export const addArchiveGames = (pgn: string[]) => {
    pgn.forEach((game) => {
        gamesArchive.set(
            ['game', getGameId(game)], game
        )
    });
}

export const getAllArchiveGames = async() => {
    const res = gamesArchive.list({ prefix: ['game'] });
    const games: string[] = [];
    for await (const game of res) {
        games.push(game.value as string);
    }
    return games
}

export const getArchiveGamesById = async (id: string) => {
    const game = await gamesArchive.get(['game', id]);
    return game.value as string;
}