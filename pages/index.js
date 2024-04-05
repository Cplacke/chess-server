window.onload = () => {
    // set player profile
    fetch('https://api.chess.com/pub/player/cplacke').then((res) => {
        res.json().then((data) => {
            console.info({ data });
            document.querySelector('#avi').setAttribute(
                "src",
                data.avatar
            )
            const active = new Date(0);
            active.setUTCSeconds(data.last_online);
            document.querySelector('#last-online').append(
                active.toLocaleDateString()
            )
            document.querySelector('#friends').append(
                data.followers
            )
            document.querySelector('#username').append(
                data.username
            )
        });
    });
    // set player stats 
    fetch('https://api.chess.com/pub/player/cplacke/stats').then((res) => {
        res.json().then((data) => {
            document.querySelector('#rating').append(
                data.chess_rapid.last.rating
            )
            document.querySelector('#wins').append(
                data.chess_rapid.record.win
            )
            document.querySelector('#draws').append(
                data.chess_rapid.record.draw
            )
            document.querySelector('#losses').append(
                data.chess_rapid.record.loss
            )
        });
    });
    // get all games from player
    fetch('/pgn/games').then((data) => {
        data.json().then((mates) => {
            document.querySelector('#wq').textContent = mates.mateByPeice.q.count || '*';
            document.querySelector('#wr').textContent = mates.mateByPeice.r.count || '*';
            document.querySelector('#wb').textContent = mates.mateByPeice.b.count || '*';
            document.querySelector('#wn').textContent = mates.mateByPeice.n.count || '*';
            document.querySelector('#wp').textContent = mates.mateByPeice.p.count || '*';
            document.querySelector('#wk').textContent = mates.mateByPeice.k.count || '*';
        });
    });
}
