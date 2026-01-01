// lib/server/get-client-ip.ts
import type { NextRequest } from 'next/server'

/**
 * Récupère l'adresse IP du client depuis une requête Next.js.
 *
 * Ordre de priorité :
 *   1. x-forwarded-for  (reverse proxies / load balancers / Vercel)
 *   2. x-real-ip        (ex: Nginx)
 *   3. fallback "unknown"
 *
 * Note :
 *   - x-forwarded-for peut contenir plusieurs IP séparées par des virgules.
 *     La première correspond à l’IP d’origine du client.
 */
export function getClientIp(request: NextRequest): string {
    const headers = request.headers

    const forwardedFor = headers.get('x-forwarded-for')
    if (forwardedFor) {
        return forwardedFor.split(',')[0]!.trim()
    }

    const realIp = headers.get('x-real-ip')
    if (realIp) {
        return realIp
    }

    return 'unknown'
}
