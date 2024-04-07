import * as datefns from "npm:date-fns"
import { parse, pgnToGif } from '../pgn-decoder/pgn.ts'


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
        datefns.setYear(now, 2020)
    );
    const requests: Promise<any>[] = [];

    while (
        !(cursor.getFullYear() == now.getFullYear() && 
        cursor.getMonth() == now.getMonth())
    ) {
        requests.push(getGames(username, cursor));
        cursor = datefns.add(cursor, { months: 1 })
    }

    const responses = await Promise.all(requests);
    const pgns: string[] = [];
    for (let i=0; i<responses.length; i++) {
        const pgn = await responses[i].text();
        if (pgn.length > 0) {
            pgns.push(pgn);
        }
    }

    const allGames = pgns.join('\n\n\n');
    const games = allGames.split('\n\n\n');
    console.info(games.length, 'Archived games returned');

    await pgnToGif(allGames.split('\n\n\n'));

    const encoder = new TextEncoder();
    await Deno.writeFile(
        './assets/archive.pgn', 
        encoder.encode(pgns)
    );
}

export const getAllGames = async (username: string) => {

    const now = new Date(Date.now());
    const request = getGames(username, now);

    const decoder = new TextDecoder('utf-8');
    const file = await Deno.readFile('./assets/archive.pgn');
    const allGames = decoder.decode(file).split('\n\n\n');

    const response = await request;
    const newGames = await response.text();

    allGames.push(... newGames.split('\n\n\n'))
    // combine all request data into mega data, and parse
    const summary = parse(allGames)
    // console.info(summary.mateByPeice);
    console.info('mate count', summary.games.length);
    await pgnToGif(newGames.split('\n\n\n'))

    return summary;
}

const getGames = (username: string, date: Date) => {
    console.info('getGames for month',`${date.getFullYear()}/${date.getMonth()+1}/pgn`);
    return fetch(`https://api.chess.com/pub/player/${username}/games/${date.getFullYear()}/${date.getMonth()+1}/pgn`);
}
