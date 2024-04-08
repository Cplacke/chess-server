const decoder = new TextDecoder('utf-8');
const data = await Deno.readFile('./pages/checkmates.html');
decoder.decode(data)

// deno-lint-ignore no-explicit-any
const config: any = {
    King: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wk.png",
        quote: "Captain of the chessboard, ruling the seas with wisdom and might."
    },
    Queen: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wq.png",
        quote: "The Queen, she be the fiercest beauty of the seas, striking fear into the hearts of all who dare cross her path."
    },
    Bishop: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wb.png",
        quote: "The Bishop, a cunning navigator, guiding the crew through treacherous waters with divine insight."
    },
    Knight: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wn.png",
        quote: "The Knight, swift as the wind, charging across the battlefield with daring bravery."
    },
    Rook: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wr.png",
        quote: "The Rook, sturdy fortress of the crew, standing tall and resolute, protecting the King's treasure."
    },
    Pawn: {
        image: "https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wp.png",
        quote: "Lowly pawn, but beware, for even the smallest deckhand can rise to claim the treasure and become a legend of the seas."
    }
}

export const getCheckmatePage = async (piece: string) => {

    const decoder = new TextDecoder('utf-8');
    const data = await Deno.readFile('./pages/checkmates.html');
    let html = decoder.decode(data);

    html = html.replaceAll('{{piece}}', `${piece}`)
    html = html.replaceAll('{{image}}', config[piece].image)
    html = html.replaceAll('{{quote}}', config[piece].quote)
    html = html.replaceAll('{{games}}', await getGamesElements(piece))

    return html;
}

import { getAllGames } from '../service/chess.ts';

export const getGamesElements = async (piece: string) => {
    const data = await getAllGames('cplacke');
    const gameTemplate = `
        <div class="mx-2 my-5 d-block d-md-flex">
            <div class="d-block mt-3 mb-3 mb-md-0 w-100">
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">White :</span> 
                    {{whitePlayer}} 
                    <span style="color: lightslategray">[{{whiteElo}}]</span>
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Black :</span> 
                    {{blackPlayer}} 
                    <span style="color: lightslategray">[{{blackElo}}]</span>
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Opening :</span> 
                    {{opening}}
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Date :</span> 
                    {{date}}
                </span>
                <button type="button" class="btn btn-primary pirate fs-5 fs-md-3 mt-2" onclick="window.location.href='{{gameLink}}'">
                    VIEW FULL GAME
                </button>
            </div>
            <img class="ms-auto d-block w-100 w-md-75" src="{{imgSrc}}" />
        </div>
    `;
    //@ts-ignore
    const html = data.mateBypiece[piece.toLocaleLowerCase()].ids.map((gameId) => {
        const game = data.games.find((game) => (game.gameId === gameId));
        if (!game) {
        return;
        }
        return gameTemplate
        .replace('{{imgSrc}}', game.gif)
        .replace('{{whitePlayer}}', game.whitePlayer)
        .replace('{{whiteElo}}', game.whiteElo)
        .replace('{{blackPlayer}}', game.blackPlayer)
        .replace('{{blackElo}}', game.blackElo)
        .replace('{{opening}}', game.opening)
        .replace('{{date}}', game.date)
        .replace('{{gameLink}}', game.gameLink);
    });
    return html.join('');
};


