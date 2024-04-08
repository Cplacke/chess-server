// import 'npm:localstorage-polyfill';
import { Collection, Entity, StorageType } from 'https://deno.land/x/localdb@0.0.2/mod.ts'
import { getGameId } from '../pgn-decoder/pgn.ts'

interface Game extends Entity {
    id: string;
    pgn: string;
}

export const gamesArchive = new Collection<Game>("archive", StorageType.LOCAL_STORAGE);

export const addArchiveGames = (pgn: string[]) => {
    // on add delete all duplicates before add
    const ids = pgn.map((game) => (getGameId(game)));
    gamesArchive.removeMultiple((record: Game) => {
        return ids.includes(getGameId(record.pgn))
    });

    const games = pgn.map((game) => ({
        id: getGameId(game),
        pgn: game
    }));

    gamesArchive.addMultiple(games);
}

export const getAllArchiveGames = () => {
    return gamesArchive.getMultiple(() => (true));
}

export const getArchiveGamesById = (id: string) => {
    return gamesArchive.getSingle((record) => (record.id === id));
}