import * as datefns from "npm:date-fns"
import { parse } from '../pgn-decoder/pgn.ts'
import { addArchiveGames, getAllArchiveGames, getArchiveGamesById } from './local-db.ts'


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
    const now = new Date(Date.now())
    let cursor = datefns.startOfYear(
        datefns.setYear(now, 2022)
    );
    const responses: Response[] = [];

    while (
        !(cursor.getFullYear() == now.getFullYear() && 
        cursor.getMonth() == now.getMonth())
    ) {
        responses.push(await getGames(username, cursor));
        cursor = datefns.add(cursor, { months: 1 })
    }

    // const responses = await Promise.all(requests);
    const pgns: string[] = [];
    for (let i=0; i<responses.length; i++) {
        const pgn = await responses[i].text();
        if (pgn.length > 0) {
            pgns.push(pgn);
        }
    }

    const allGames = pgns.join('\n\n\n');
    const games = allGames.split('\n\n\n');
    
    addArchiveGames(games);
    console.info(`${games.length} Archived games persisted to localStorage`);
}

export const getAllGames = async (username: string) => {

    const now = new Date(Date.now());
    const request = getGames(username, now);
    const response = await request;
    const newGames = await response.text();
    const pgns = newGames.split('\n\n\n');

    addArchiveGames(pgns);

    const allGames = getAllArchiveGames().map((record) => (record.pgn));
    const summary = parse(allGames)
    console.info('mate count', summary.games.length);

    return summary;
}

const getGames = (username: string, date: Date) => {
    console.info('getGames for month',`${date.getFullYear()}/${date.getMonth()+1}/pgn`);
    return fetch(`https://api.chess.com/pub/player/${username}/games/${date.getFullYear()}/${date.getMonth()+1}/pgn`);
}
