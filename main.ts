import { parse, split } from './pgn-decoder/pgn.ts'

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
    } else if (/pgn\/parse/.test(route)) {
        return createPgnPraserResponse(
            await request.text()
        )
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

const createPgnPraserResponse = (data: string) => {
    const pgn = parse(split(data))
    const body = JSON.stringify(pgn);
    return new Response(body, {
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


