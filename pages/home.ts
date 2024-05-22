import { USERNAME } from '../config.ts';
import { getAllGames } from '../service/chess.ts'
import { getGamePage } from './checkmate.ts';

export const HomePage = async () => {

    const [
        profile,
        stats,
        games
    ] = await Promise.all([
        getProfile(USERNAME),
        getStats(USERNAME),
        getAllGamesData()
    ]);

    return `
        <html>
            <head>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/> 
                <link rel="stylesheet" href="/assets/css/animation.css"/>
                <link rel="stylesheet" href="/assets/css/bootstrap/bootstrap.css"/>
                <link rel="stylesheet" href="/assets/css/custom.css"/>
                <link rel="stylesheet" href="/assets/css/responsive.css"/>
            </head>
            
            <main class="p-2 p-lg-4">
                <body>
                    <div class="section-bg">
                        <h1 class="text-center"> <span class="flip pirate">#</span> Welcome to the Crew #</h1>
                        <p class="mx-lg-5">
                            Welcome to my realm of chess triumphs and victories, where every move tells a story of strategy and skill! Join me as I unveil the thrilling highlights of my chess odyssey, inviting fellow enthusiasts to partake in the exhilarating pursuit of mastery. Together, let's embark on a journey of discovery, where each encounter on the board unveils new horizons and shapes the champions we aspire to be!
                        </p>
                    </div>

                    <!-- HERO IMAGE HERE -->
                    <h2 class="text-center my-4"> Take what you can, Give nothing back ... </h2>

                    <div class="section-bg scale mt-2 mx-auto w-sm-100 w-md-75">
                        <h3 class="text-center"> Statistics </h3>
                        <div class="d-sm-flex mx-md-3">
                            <div class="d-flex mb-2">
                                <div>
                                    <img id="avi" alt="loading user data..." src="${profile.avatar}"/>
                                </div>
                                <div class="ms-auto ms-sm-4 record">
                                    <div>
                                        Last Online: 
                                        <span id="last-online" class="pirate" style="color: lightslategray;">${profile.last_online}</span>
                                    </div>
                                    <div class="mt-2">
                                        Friends: 
                                        <span id="friends" class="pirate" style="color: lightslategray;">${profile.followers}</span>
                                    </div>
                                    <div class="mt-2">
                                        Username: 
                                        <span id="username" class="text-uppercase pirate" style="color: lightslategray;">${profile.username}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="mb-2 ps-md-2 ms-auto">
                                <div class="record"> 
                                    Current Rapid Rating:  
                                    <span id="rating" class="pirate" style="color: lightslategray;">${stats.rating}</span>
                                </div>
                                <div class="d-flex record mt-2">
                                    <div> 
                                        Wins: 
                                        <span id="wins" class="pirate" style="color: green;">${stats.win}</span>
                                    </div>
                                    <div class="ms-4"> 
                                        Draws: 
                                        <span id="draws" class="pirate" style="color: lightslategray;">${stats.draw}</span>
                                    </div>
                                    <div class="ms-4"> 
                                        Losses: 
                                        <span id="losses" class="pirate" style="color: red;">${stats.loss}</span>
                                    </div>
                                </div>
                                <div class="d-flex record mt-2" style="height: 20px;opacity: 0.5;">
                                    <div id="win-bar" style="background-color: green; border-radius: 5px 0 0 5px; width: ${stats.percentages.win}"></div>
                                    <div id="draw-bar" style="background-color: lightslategray; width: ${stats.percentages.draw}"></div>
                                    <div id="loss-bar" style="background-color: darkred; border-radius: 0 5px 5px 0; width: ${stats.percentages.loss}"></div>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div class="section-bg scale">
                        <h3 class="text-center"> Checkmates by Finishing Blow </h6>
                            <div class="d-flex justify-content-evenly ">
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wq.png"
                                        onclick="window.location.href = '/?checkmates=queen'"
                                    > <span id="wq" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.queen.count || '*'} </span>
                                </div>
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wr.png"
                                        onclick="window.location.href = '/?checkmates=rook'"
                                    > <span id="wr" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.rook.count || '*'} </span>
                                </div>
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wb.png"
                                        onclick="window.location.href = '/?checkmates=bishop'"
                                    > <span id="wb" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.bishop.count || '*'} </span>
                                </div>
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wn.png"
                                        onclick="window.location.href = '/?checkmates=knight'"
                                    > <span id="wn" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.knight.count || '*'} </span>
                                </div>
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wp.png"
                                        onclick="window.location.href = '/?checkmates=pawn'"
                                    > <span id="wp" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.pawn.count || '*'} </span>
                                </div>
                                <div>
                                    <img class="piece-icon shake"
                                        src="https://images.chesscomfiles.com/chess-themes/pieces/tigers/150/wk.png"
                                        onclick="window.location.href = '/?checkmates=king'"
                                    > <span id="wk" class="text-center fs-3 d-block pirate" style="color: lightslategray;"> ${games.mateBypiece.king.count || '*'} </span>
                                </div>
                            </div>
                    </div>

                    <div class="section-bg scale w-100 mx-auto mt-2">
                        <h3 class="text-center"> Most Recent Victory </h3>
                        ${ await getGamePage(games.games[0]) }
                    </div>

                </body>
            </main>

        </html>
    `;
}
 // 
                    //     
                    //     <img id="recent-game" class="mx-auto w-100 mt-4 mb-4" src="${games.games[0].gif}">
                    // 

const getProfile = async (USERNAME: string) => {
    const res = await fetch(`https://api.chess.com/pub/player/${USERNAME}`);
    const data = await res.json();

    const { avatar, followers, username } = data;

    const active = new Date(0);
    active.setUTCSeconds(data.last_online);
    
    return {
        avatar,
        followers,
        username,
        last_online: active.toLocaleDateString(),
    };
}

const getStats = async (USERNAME: string) => {
    const res = await fetch(`https://api.chess.com/pub/player/${USERNAME}/stats`);
    const data = await res.json();

    const { win, draw, loss } = data.chess_rapid.record;
    const total = win + draw + loss;
    const rating = data.chess_rapid.last.rating

    return {
        rating,
        win,
        draw,
        loss,
        percentages: {
            win: (win/total)*100+'%',
            draw: (draw/total)*100+'%',
            loss: (loss/total)*100+'%',
        }
    }
}

const getAllGamesData = async () => {
    // const res = await fetch('http://localhost:8080/pgn/games');
    // const data = await res.json();
    const data = await getAllGames(USERNAME);
    //         document.querySelector('#wq').textContent = mates.mateBypiece.queen.count || '*';
    //         document.querySelector('#wr').textContent = mates.mateBypiece.rook.count || '*';
    //         document.querySelector('#wb').textContent = mates.mateBypiece.bishop.count || '*';
    //         document.querySelector('#wn').textContent = mates.mateBypiece.knight.count || '*';
    //         document.querySelector('#wp').textContent = mates.mateBypiece.pawn.count || '*';
    //         document.querySelector('#wk').textContent = mates.mateBypiece.king.count || '*';
    //         document.querySelector('#recent-game').setAttribute('src', mates.games[0].gif);
    
    return data;
}