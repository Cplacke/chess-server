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

export const getGamesThisYear = async (username: string) => {

    // const allGames = await getGamesFromService(username);

    const decoder = new TextDecoder('utf-8');
    const file = await Deno.readFile('./assets/archive.pgn');
    const allGames = decoder.decode(file).split('\n\n\n');

    // const encoder = new TextEncoder();
    // Deno.writeFileSync('./assets/archive.pgn', encoder.encode(pgns.join('\n\n\n')))

    // combine all request data into mega data, and parse
    const summary = parse(allGames)
    // console.info(summary.mateByPeice);
    console.info('mate count', summary.checkmates.length);

    // pgnToGif(summary.checkmates)
    return summary;
}

const getGamesFromService = async (username: string) => {
    const now = new Date(Date.now())
    let cursor = datefns.startOfYear(
        datefns.setYear(now, 2021)
    );
    const requests: Promise<any>[] = [];

    while (
        !(cursor.getFullYear() == now.getFullYear() && 
        cursor.getMonth() == now.getMonth())
    ) {
        console.info('req for ',`${cursor.getFullYear()}/${cursor.getMonth()+1}/pgn`);
        requests.push(
            fetch(`https://api.chess.com/pub/player/${username}/games/${cursor.getFullYear()}/${cursor.getMonth()+1}/pgn`)
        );
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

    // combine into single data file for parsing
    const allGames = pgns.join('\n\n\n').split('\n\n\n');
    console.info('all request retruned', responses.length);
    console.info(allGames.length, 'Games returned');
    return allGames;
}

getGamesThisYear('cplacke');