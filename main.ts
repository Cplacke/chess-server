import { gameId2Gif } from './pgn-decoder/pgn.ts'
import { getAllGames, cacheArchiveGames } from './service/chess.ts'
import config from './config.ts'
import { HomePage } from "./pages/home.ts";
import { getCheckmatePage, getGamesElements } from "./pages/checkmate.ts";

Deno.serve(async (request: Request) => {

    const route = request.url;
    console.info(route);
    if (/\?checkmates=queen/.test(route)) {
        return await createCheckmatePageResponse('Queen')
    } else if (/\?checkmates=rook/.test(route)) {
        return await createCheckmatePageResponse('Rook')
    } else if (/\?checkmates=bishop/.test(route)) {
        return await createCheckmatePageResponse('Bishop')
    } else if (/\?checkmates=knight/.test(route)) {
        return await createCheckmatePageResponse('Knight')
    } else if (/\?checkmates=pawn/.test(route)) {
        return await createCheckmatePageResponse('Pawn')
    } else if (/\?checkmates=king/.test(route)) {
        return await createCheckmatePageResponse('King')
    } else if (/\?checkmates=special/.test(route)) {
        return await createCheckmatePageResponse('Special')
    } else if (/\games/.test(route)) {
        return await createAdditionalGamesPageResponse(request)
    } else if (/generate\/gif/.test(route)) {
        return await createGifResponse(route)
    } else if (/assets\//.test(route)) {
        return await getAssetResponse(
            route.substring(route.indexOf('assets/'))
        )
    } else if (/pages\//.test(route)) {
        return await getAssetResponse(
            route.substring(route.indexOf('pages/'))
        )
    } else if (/pgn\/games/.test(route)) {
        return await createPgnPraserResponse()
    }

    return await createHomePageResponse()

})

const createHomePageResponse = async () => {
    const html = await HomePage();
    return new Response(html, {
        status: 200,
        headers: {
            'Content-Type': 'HTML'
        }
    });
}

const createCheckmatePageResponse = async (piece: string) => {
    const data = await getCheckmatePage(piece);
    return new Response(data, {
        status: 200,
        headers: {
            'Content-Type': 'HTML'
        }
    });
}

const createAdditionalGamesPageResponse = async (req: Request) => {
    const body = await req.json();
    let response = '';
    let status = 200;
    if (!body) {
        status = 400;
    } else {
        response = await getGamesElements(body);
    }

    return new Response(response, {
        status: status,
        headers: {
            'Content-Type': 'HTML'
        }
    });
}

const createPgnPraserResponse = async () => {
    const data = await getAllGames(config.username)
    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json'
        }
    });
}

const getAssetResponse = async (asset: string) => {  
    console.info('attempting access of ', asset);
    const file = await Deno.open(`./${asset}`, { read: true });

    let contentType = 'NONE';
    if (/\.png/.test(asset)) {
        contentType = 'image/png'
    } else if (/\.jpe?g/.test(asset)) {
        contentType = 'image/jpg'
    } else if (/\.gif/.test(asset)) {
        contentType = 'image/gif'
    } else if (/\.ttf/.test(asset)) {
        contentType = 'font/ttf'
    } else if (/\.css/.test(asset)) {
        contentType = 'text/css'
    } else if (/\.js/.test(asset)) {
        contentType = 'application/javascript'
    } 

    return new Response(file.readable, {
        status: 200,
        headers: {
            'Content-Type': contentType
        }
    });
}

const createGifResponse = async (route: string) => {  
    const gameId = /generate\/gif\/(.*)/.exec(route)?.at(1);
    if (!gameId) {
        return new Response('Missing GameId', { status: 404 });
    }

    const gif = await gameId2Gif(gameId);
    return new Response(gif, {
        status: 200,
        headers: {
            'Content-Type': 'image/gif'
        }
    });
}

cacheArchiveGames(config.username)