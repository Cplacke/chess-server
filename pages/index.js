window.onload = () => {
    // set player profile
    fetch('https://api.chess.com/pub/player/cplacke').then((res) => {
        res.json().then((data) => {
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
            const total = data.chess_rapid.record.win +
                data.chess_rapid.record.draw +
                data.chess_rapid.record.loss;
            document.querySelector('#win-bar').style.width = (data.chess_rapid.record.win/total)*100+'%'
            document.querySelector('#draw-bar').style.width = (data.chess_rapid.record.draw/total)*100+'%'
            document.querySelector('#loss-bar').style.width = (data.chess_rapid.record.loss/total)*100+'%'
        });
    });
    // get all games from player
    fetch('/pgn/games').then((data) => {
        data.json().then((mates) => {
            document.querySelector('#wq').textContent = mates.mateBypiece.queen.count || '*';
            document.querySelector('#wr').textContent = mates.mateBypiece.rook.count || '*';
            document.querySelector('#wb').textContent = mates.mateBypiece.bishop.count || '*';
            document.querySelector('#wn').textContent = mates.mateBypiece.knight.count || '*';
            document.querySelector('#wp').textContent = mates.mateBypiece.pawn.count || '*';
            document.querySelector('#wk').textContent = mates.mateBypiece.king.count || '*';
            document.querySelector('#recent-game').setAttribute('src', mates.games[0].gif);
            
        });
    });
}
