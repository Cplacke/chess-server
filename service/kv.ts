import { getGameId } from '../pgn-decoder/pgn.ts'

export const gamesArchive = await Deno.openKv();

export const addArchiveGames = async(pgn: string[]) => {
    const ids = await getAllGameIds();
    const pgnToAdd = pgn.filter((game) => (
        !ids.includes(getGameId(game))
    ));
    console.info(`persisting ${pgnToAdd.length} new games to kv`);
    pgnToAdd.forEach((game) => {
        gamesArchive.set(
            ['game', getGameId(game), ], game
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

export const getAllGameIds = async() => {
    const res = gamesArchive.list({ prefix: ['game'] });
    const ids: string[] = [];
    for await (const game of res) {
        ids.push(game.key[1] as string);
    }
    return ids;
}


const clearKvStorage = async () => {
    let count = 0;
    const entries = gamesArchive.list({ prefix: ["game"] });
    for await (const entry of entries) {
        await gamesArchive.delete(entry.key)
        count++;
    }
    console.info('kv cleared', count, 'records');
}

const getKvRecordsCount = async () => {
    let count = 0;
    const entries = gamesArchive.list({ prefix: ["game"] });
    for await (const entry of entries) {
        count++;
    }
    console.info('kv record count', count);
}

// await clearKvStorage();
await getKvRecordsCount();
