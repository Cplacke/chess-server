import { parse, split } from './pgn-decoder/pgn.ts'
import { getPlayerStats, getGamesThisYear } from './service/chess.ts'

Deno.serve(async (request: Request) => {

    const route = request.url;
    if (/\?checkmates=queen/.test(route)) {
        return await createPageResponse('queen mates')
    } else if (/\?checkmates=rook/.test(route)) {
        return await createPageResponse('rook mates')
    } else if (/\?checkmates=bishop/.test(route)) {
        return await createPageResponse('bishop mates')
    } else if (/\?checkmates=knight/.test(route)) {
        return await createPageResponse('knight mates')
    } else if (/\?checkmates=pawn/.test(route)) {
        return await createPageResponse('pawn mates')
    } else if (/\?checkmates=king/.test(route)) {
        return await createPageResponse('king mates')
    } else if (/\?checkmates=special/.test(route)) {
        return await createPageResponse('special mates')
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

    return await createPageResponse('Hello World!')

})

const decoder = new TextDecoder('utf-8');

const createPageResponse = async (_: string) => {
    const data = await Deno.readFile('./pages/index.html');
    return new Response(decoder.decode(data), {
        status: 200,
        headers: {
            'Content-Type': 'HTML'
        }
    });
}

const createPgnPraserResponse = async () => {
    const data = await getGamesThisYear('Cplacke')
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


