// lib/server/rate-limit.ts

/**
 * Rate limiting simple en mémoire, basé sur une clé (IP, userId, etc.).
 *
 * ATTENTION : adapté pour un seul process / instance.
 * En prod multi-instances, utiliser Redis / Upstash / etc.
 */

const DEFAULT_MAX_REQUESTS = 5
const DEFAULT_WINDOW_MS = 60 * 1000 // 1 minute

type RateLimitRecord = {
    count: number
    resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

/**
 * Vérifie si une clé (par ex. IP) a dépassé la limite de requêtes.
 *
 * @param key - Identifiant (IP, userId, etc.)
 * @param options.maxRequests - Nombre max de requêtes (par fenêtre)
 * @param options.windowMs - Durée de la fenêtre en ms
 * @returns true si la limite est dépassée, false sinon
 */
export function isRateLimited(
    key: string,
    options?: {
        maxRequests?: number
        windowMs?: number
    }
): boolean {
    const now = Date.now()
    const maxRequests = options?.maxRequests ?? DEFAULT_MAX_REQUESTS
    const windowMs = options?.windowMs ?? DEFAULT_WINDOW_MS

    const record = rateLimitMap.get(key)

    // Première requête ou fenêtre expirée → on reset
    if (!record || now > record.resetTime) {
        rateLimitMap.set(key, {
            count: 1,
            resetTime: now + windowMs,
        })
        return false
    }

    // Incrémenter le compteur
    record.count++

    // Dépassé ?
    if (record.count > maxRequests) {
        return true
    }

    return false
}

/**
 * Nettoie les entrées expirées du rate limit map.
 * Appelé périodiquement pour éviter les fuites mémoire.
 */
function cleanupRateLimitMap(): void {
    const now = Date.now()
    for (const [key, record] of rateLimitMap.entries()) {
        if (now > record.resetTime) {
            rateLimitMap.delete(key)
        }
    }
}

// Nettoyage toutes les 5 minutes
setInterval(cleanupRateLimitMap, 5 * 60 * 1000)
