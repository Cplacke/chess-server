import * as base64 from "https://deno.land/std@0.207.0/encoding/base64.ts";
import { ChessGif, parseMoves } from "npm:pgn2gif";
const decoder = new TextDecoder('utf-8');

export const decodeChessNotation = (data: string) => {
    const pgnDataBuffer = base64.decodeBase64(data);
    const pgnDataString = decoder.decode(pgnDataBuffer);
    const pgnData = split(pgnDataString);

    return pgnData;
}

export const split = (pgnDatas: string) => {
    return pgnDatas.split('\n\n\n');
}

export const parse = (pgnData: string[]) => {    
    const mateByPeice = { 
        q: { count: 0, ids: [] as string[] }, 
        r: { count: 0, ids: [] as string[] }, 
        b: { count: 0, ids: [] as string[] }, 
        n: { count: 0, ids: [] as string[] }, 
        p: { count: 0, ids: [] as string[] }, 
        k: { count: 0, ids: [] as string[] } 
    }
    const checkmates = pgnData.filter((game) => {
        return getTermination(game)?.includes("Cplacke won by checkmate")
    });
    checkmates.forEach((game) => {
        const endMove = getEndMove(game);
        const gameId = getGameId(game);
        if (endMove.startsWith('Q')) {
            mateByPeice.q.count += 1;
            mateByPeice.q.ids.push(gameId);
        } else if (endMove.startsWith('R')) {
            mateByPeice.r.count += 1;
            mateByPeice.r.ids.push(gameId);
        } else if (endMove.startsWith('B')) {
            mateByPeice.b.count += 1;
            mateByPeice.b.ids.push(gameId);
        } else if (endMove.startsWith('N')) {
            mateByPeice.n.count += 1;
            mateByPeice.n.ids.push(gameId);
        } else if (endMove.startsWith('K')) {
            mateByPeice.k.count += 1;
            mateByPeice.k.ids.push(gameId);
        } else { // if (endMove.length == 2) {
            mateByPeice.p.count += 1;
            mateByPeice.p.ids.push(gameId);
        }
    });

    return {
        checkmates, mateByPeice
    }

}

export const pgnToGif = (pgnGames: string[]) => {
    const files = pgnGames
    .filter((game) => (/\[Termination \"Cplacke won by checkmate\"\]/.test(game)))
    .map(async (game, i) => {
        const gameId = getGameId(game);
        const moves = parseMoves(game);
        const chessgif = new ChessGif();
        chessgif.resetCache(); // reset boardCache (optional first time)
        chessgif.loadMoves(moves); // load moves 

        await chessgif.createGif(moves.length -3, moves.length, isPlayingBlack(game)); // generate blobs of gif file
        const url = chessgif.asBase64Gif(); // export file blobs  typeof gif

        Deno.writeFileSync(
            `./assets/gif/game-${gameId}.gif`,
            new Uint8Array(await url.arrayBuffer())
        ); // write it to a file
        console.info('wrote', `./assets/gif/game-${gameId}.gif`);
    });

    return Promise.all(files)
}

const getGameId = (pgn: string) => {
    return /\[Link \"https:\/\/www.chess.com\/game\/live\/(\d+)\"\]/.exec(pgn)?.at(1) || 'UNKNOWN'
}
const getTermination = (pgn: string) => {
    return /\[Termination \"(.*?)\"\]/.exec(pgn)?.at(1) || 'UNKNOWN'
}
const getEndMove = (pgn: string) => {
    return /\W(\w+\#)/.exec(pgn)?.at(1) || 'NO MATE'
}
const isPlayingBlack = (pgn: string) => {
    return /\[Black \"Cplacke\"\]/.test(pgn)
}