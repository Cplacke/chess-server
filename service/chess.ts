import { parse } from '../pgn-decoder/pgn.ts'
import { addArchiveGames, getAllArchiveGames } from './kv.ts'


export const getPlayerStats = (username: string) => {
    fetch(`https://api.chess.com/pub/player/${username}`).then((res) => {
        res.json().then((data) => {
            console.info('user', { data });
        });
    });
    fetch(`https://api.chess.com/pub/player/${username}/stats`).then((res) => {
        res.json().then((data) => {
            console.info('stats', { data });
        });
    });
}

export const cacheArchiveGames = async (username: string) => {

    const archiveRes = await fetch(`https://api.chess.com/pub/player/${username}/games/archives`);
    const archiveData = await archiveRes.json();

    const pgns: string[] = [];


    for (let i=0; i<archiveData.archives.length; i++) {
        const url = `${archiveData.archives[i]}/pgn`;
        console.info('archiving', url);
        const response = await fetch(url);
        const pgn = await response.text();
        pgns.push(pgn);
    }

    const allGames = pgns.join('\n\n\n');
    const games = allGames.split('\n\n\n');

    addArchiveGames(games);
    console.info(`${games.length} Archived games persisted to Deno.kv`);
}

export const getAllGames = async (username: string) => {

    const now = new Date(Date.now());
    const request = getGames(username, now);
    const response = await request;
    const newGames = await response.text();
    const pgns = newGames.split('\n\n\n');

    addArchiveGames(pgns);

    const allGames = await getAllArchiveGames();
    const summary = parse(allGames)
    console.info('mate count', summary.games.length);

    return summary;
}

const getGames = (username: string, date: Date) => {
    console.info('getGames for month',`${date.getFullYear()}/${date.getMonth()+1}/pgn`);
    return fetch(`https://api.chess.com/pub/player/${username}/games/${date.getFullYear()}/${date.getMonth()+1}/pgn`);
}
