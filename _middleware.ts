import type { NextRequest, NextFetchEvent } from "next/server";
import { NextResponse } from "next/server";

export function middleware(req: NextRequest, ev: NextFetchEvent) {
    if(req.ua?.isBot) {
        return new Response("Plz don't be a bot. Be human.", {status: 403});
    } else if (req?.ua?.isBot !== undefined) {
        if(!req.url.includes("/api")){
            if(!req.url.includes("/enter") && !req.cookies.Carrotsession){
                return NextResponse.redirect(`${req.nextUrl.origin}/enter`)
            };
        }
    }
}