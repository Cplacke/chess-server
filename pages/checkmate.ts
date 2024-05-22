import { USERNAME } from '../config.ts'
import { game2Gif } from '../pgn-decoder/pgn.ts';

// deno-lint-ignore no-explicit-any
const titleConfig: any = {
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

    const pageSize = 20;
    const data = await getAllGames(USERNAME);
    // @ts-ignore
    const gamesByPiece: any[] = data.mateBypiece[piece.toLocaleLowerCase()].ids.map((gameId) => {
        return data.games.find((game) => (game.gameId === gameId));
    });

    

    return `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
                <link rel="stylesheet" href="/assets/css/animation.css"/>
                <link rel="stylesheet" href="/assets/css//bootstrap/bootstrap.css"/>
                <link rel="stylesheet" href="/assets/css/custom.css"/>
                <script>
                    const pageSize = ${pageSize};
                    let pageIndex = 1;
                    const GAMES = ${JSON.stringify(gamesByPiece)};

                    const loadMoreGames = async() => {
                        document.querySelector('#load-more').textContent = '****\t\t\tLOADING\t\t\t****';
                        const start = pageIndex*pageSize;
                        const end = start+pageSize;
                        const res = await fetch("/games", { 
                            method: 'POST',
                            body: JSON.stringify(GAMES.slice(start, end)),
                        });
                        const html = await res.text();
                        document.querySelector('#games').innerHTML += html;
                        document.querySelector('#load-more').textContent = 'LOAD MORE GAMES';
                        pageIndex++;
                        if (pageIndex*pageSize > GAMES.length) {
                            document.querySelector('#load-more').classList.add('d-none')
                        }
                    }
                </script>
            </head>
            
            <main class="p-2 p-lg-4">
                <body>
                    <div class="section-bg w-100 lg-w-75 mx-auto">
                        <h1 class="text-center"> The ${piece} </h1>
                        <div class="d-flex align-items-center">
                            <img src="${titleConfig[piece].image}" class="">
                            <p class="pirate fs-2 m-0" style="line-height: 30px;">
                                ${titleConfig[piece].quote}
                            </p>
                        </div>
                    </div>

                    <div class="section-bg mx-auto mt-5">
                        <h3 class="text-center"> Explore Checkmates by ${piece} </h3>
                        <div id="games">
                            ${await getGamesElements(gamesByPiece.slice(0, pageSize))}
                        </div>
                        <button id="load-more" type="button" 
                            class="btn btn-primary d-block pirate text-center w-50 fs-5 fs-md-3 my-4 mx-auto" 
                            onclick="loadMoreGames()"
                        >
                            LOAD MORE GAMES
                        </button>
                    </div>

                </body>
            </main>

        </html>
    `;
}

import { getAllGames } from '../service/chess.ts';

export const getGamesElements = async (games: any[]) => {
    const html = await Promise.all(
        games.map((game) => (getGamePage(game)))
    );
    return html.join('');
};

export const getGamePage = async (game: any) => {
    if (!game) {
        return;
    }
    return `
        <div class="mx-2 my-5 d-block d-md-flex">
            <div class="d-block mt-3 mb-3 mb-md-0 w-100">
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">White :</span> 
                    ${game.whitePlayer} 
                    <span style="color: lightslategray">[${game.whiteElo}]</span>
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Black :</span> 
                    ${game.blackPlayer} 
                    <span style="color: lightslategray">[${game.blackElo}]</span>
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Opening :</span> 
                    ${game.opening}
                </span>
                <span class="d-block fs-5 fs-md-3 ">
                    <span class="pirate fs-3" style="color: lightgoldenrodyellow">Date :</span> 
                    ${game.date}
                </span>
                <button type="button" class="btn btn-primary pirate fs-5 fs-md-3 mt-2" onclick="window.location.href='${game.gameLink}'">
                    VIEW FULL GAME
                </button>
            </div>
            <img class="ms-auto d-block w-100 w-md-75" src="data:image/gif;base64, ${await game2Gif(game)}" />
        </div>
    `;
}


