import { getGameId } from '../pgn-decoder/pgn.ts'

export const gamesArchive = await Deno.openKv();

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
