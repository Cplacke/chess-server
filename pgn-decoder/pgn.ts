import * as base64 from "https://deno.land/std@0.207.0/encoding/base64.ts";
import { getArchiveGamesById } from "../service/local-db.ts";
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
    const mateBypiece = { 
        queen: { count: 0, ids: [] as string[] }, 
        rook: { count: 0, ids: [] as string[] }, 
        bishop: { count: 0, ids: [] as string[] }, 
        knight: { count: 0, ids: [] as string[] }, 
        pawn: { count: 0, ids: [] as string[] }, 
        king: { count: 0, ids: [] as string[] } 
    }

    // sort games by date
    const checkmates = pgnData.filter((game) => {
        return getTermination(game)?.includes("Cplacke won by checkmate")
    }).sort((a, b) => {
        return  getDate(b).localeCompare(getDate(a))
    });
    checkmates.forEach((game) => {
        const endMove = getEndMove(game);
        const gameId = getGameId(game);
        if (endMove.startsWith('Q')) {
            mateBypiece.queen.count += 1;
            mateBypiece.queen.ids.push(gameId);
        } else if (endMove.startsWith('R')) {
            mateBypiece.rook.count += 1;
            mateBypiece.rook.ids.push(gameId);
        } else if (endMove.startsWith('B')) {
            mateBypiece.bishop.count += 1;
            mateBypiece.bishop.ids.push(gameId);
        } else if (endMove.startsWith('N')) {
            mateBypiece.knight.count += 1;
            mateBypiece.knight.ids.push(gameId);
        } else if (endMove.startsWith('K')) {
            mateBypiece.king.count += 1;
            mateBypiece.king.ids.push(gameId);
        } else { // if (endMove.length == 2) {
            mateBypiece.pawn.count += 1;
            mateBypiece.pawn.ids.push(gameId);
        }
    });
    const games = checkmates.map((game) => ({
        gameId: getGameId(game),
        gif: `/generate/gif/${getGameId(game)}`,
        endMove: getEndMove(game),
        whitePlayer: getWhitePlayer(game),
        blackPlayer: getBlackPlayer(game),
        whiteElo: getWhiteElo(game),
        blackElo: getBlackElo(game),
        gameLink: getGameLink(game),
        date: getDate(game),
        opening: getOpening(game),
    }));
    return {
        games, mateBypiece
    }

}

export const pgnToGif = async (gameId: string) => {
    const record = getArchiveGamesById(gameId);
    const moves = parseMoves(record.pgn);

    const chessgif = new ChessGif();
    chessgif.resetCache(); // reset boardCache (optional first time)
    chessgif.loadMoves(moves); // load moves 

    await chessgif.createGif(moves.length -3, moves.length, isPlayingBlack(record.pgn)); // generate blobs of gif file
    const url = chessgif.asBase64Gif(); // export file blobs  typeof gif

    // return await url.text();
    return new Uint8Array(await url.arrayBuffer())
}

export const getGameId = (pgn: string) => {
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
const getWhitePlayer = (pgn: string) => {
    return /\[White \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getBlackPlayer = (pgn: string) => {
    return /\[Black \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getWhiteElo = (pgn: string) => {
    return /\[WhiteElo \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getBlackElo = (pgn: string) => {
    return /\[BlackElo \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getGameLink = (pgn: string) => {
    return /\[Link \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getDate = (pgn: string) => {
    return /\[Date \"(.*?)\"\]/.exec(pgn)?.at(1) || '?'
}
const getOpening = (pgn: string) => {
    return /\[ECOUrl \"https:\/\/www.chess.com\/openings\/(.*?)\"\]/.exec(pgn)?.at(1)?.replaceAll('-', ' ') || '?'
}