window.onload = () => {
    // get all games from player
    fetch('/pgn/games').then((data) => {
        data.json().then((data) => {
            const gameTemplate = `
                <div class="mx-2 my-5 py-4 d-flex"">
                    <div class="d-block mt-3 w-100">
                        <span class="fs-5 d-block">
                            <span class="pirate fs-3" style="color: lightgoldenrodyellow">White :</span> 
                            {{whitePlayer}} 
                            <span style="color: lightslategray">[{{whiteElo}}]</span>
                        </span>
                        <span class="fs-5 d-block">
                            <span class="pirate fs-3" style="color: lightgoldenrodyellow">Black :</span> 
                            {{blackPlayer}} 
                            <span style="color: lightslategray">[{{blackElo}}]</span>
                        </span>
                        <span class="fs-5 d-block">
                            <span class="pirate fs-3" style="color: lightgoldenrodyellow">Opening :</span> 
                            {{opening}}
                        </span>
                        <span class="fs-5 d-block">
                            <span class="pirate fs-3" style="color: lightgoldenrodyellow">Date :</span> 
                            {{date}}
                        </span>
                        <button type="button" class="btn btn-primary pirate fs-5 mt-2" onclick="window.location.href='{{gameLink}}'">
                            VIEW FULL GAME
                        </button>
                    </div>
                    <img class="ms-auto d-block w-75" src="{{imgSrc}}" />
                </div>
            `;
            const html = data.mateBypiece.n.ids.map((gameId) => {
                const game = data.games.find((game) => (game.gameId === gameId));
                return gameTemplate
                    .replace('{{imgSrc}}', game.gif)
                    .replace('{{whitePlayer}}', game.whitePlayer)
                    .replace('{{whiteElo}}', game.whiteElo)
                    .replace('{{blackPlayer}}', game.blackPlayer)
                    .replace('{{blackElo}}', game.blackElo)
                    .replace('{{opening}}', game.opening)
                    .replace('{{date}}', game.date)
                    .replace('{{gameLink}}', game.gameLink)
            })

            html.forEach((element) => {
                document.querySelector('#games').innerHTML += element;
            });
        });
    });
}
