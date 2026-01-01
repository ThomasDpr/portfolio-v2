/**
 * =============================================================================
 * API ROUTE : POST /api/contact
 * =============================================================================
 *
 * Cette API Route gère les soumissions du formulaire de contact.
 *
 * Fonctionnalités :
 *   - Validation des données avec Zod
 *   - Protection anti-spam (honeypot + rate limiting)
 *   - Envoi d'email via Brevo
 *   - Codes de réponse HTTP appropriés
 *
 * Pourquoi une API Route plutôt qu'une Server Action ?
 * =====================================================
 *
 * 1. TESTABILITÉ : Cette route peut être testée avec Postman, curl, ou
 *    n'importe quel client HTTP. Une Server Action ne peut être appelée
 *    que depuis React.
 *
 * 2. RATE LIMITING : On a un contrôle total sur les headers HTTP et l'IP
 *    du client, ce qui facilite l'implémentation du rate limiting.
 *
 * 3. CODES HTTP : On peut retourner des codes de statut précis (400, 429, 500)
 *    pour une meilleure gestion des erreurs côté client.
 *
 * 4. RÉUTILISABILITÉ : Cette API peut être appelée par une future app mobile
 *    ou un autre client.
 *
 * 5. TANSTACK QUERY : Les mutations TanStack Query fonctionnent naturellement
 *    avec des endpoints HTTP REST.
 *
 * Architecture de la requête :
 * ============================
 *
 *   Client (TanStack Query)
 *        │
 *        ▼ POST /api/contact
 *   ┌────────────────────────────────────┐
 *   │ 1. Extraction de l'IP              │
 *   │ 2. Vérification rate limit         │
 *   │ 3. Parsing du body JSON            │
 *   │ 4. Validation Zod                  │
 *   │ 5. Vérification honeypot           │
 *   │ 6. Appel Brevo API                 │
 *   │ 7. Réponse JSON                    │
 *   └────────────────────────────────────┘
 *        │
 *        ▼
 *   200 OK / 400 Bad Request / 429 Too Many Requests / 500 Server Error
 */

import { NextRequest, NextResponse } from 'next/server'
import { contactSchema } from '@/lib/contact/'
import { sendContactEmail } from '@/lib/email/brevo'
import { getClientIp } from '@/lib/server/get-client-ip'
import { isRateLimited } from '@/lib/server/rate-limit'

// =============================================================================
// HANDLER POST
// =============================================================================

/**
 * Handler pour les requêtes POST.
 *
 * Codes de réponse :
 *   - 200 : Succès (email envoyé)
 *   - 400 : Erreur de validation (données invalides)
 *   - 429 : Rate limit dépassé
 *   - 500 : Erreur serveur (Brevo, etc.)
 */
export async function POST(request: NextRequest) {
    try {
        // =========================================================================
        // 1. RATE LIMITING
        // =========================================================================

        const clientIp = getClientIp(request)

        if (isRateLimited(clientIp)) {
            console.warn(`[Rate Limit] IP blocked: ${clientIp}`)

            return NextResponse.json(
                {
                    success: false,
                    error: 'Trop de requêtes. Veuillez réessayer dans une minute.',
                    code: 'RATE_LIMIT_EXCEEDED',
                },
                {
                    status: 429,
                    headers: { 'Retry-After': '60' },
                }
            )
        }

        // =========================================================================
        // 2. PARSING DU BODY JSON
        // =========================================================================

        let body: unknown

        try {
            body = await request.json()
        } catch {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Invalid JSON body',
                    code: 'INVALID_JSON',
                },
                { status: 400 }
            )
        }

        // =========================================================================
        // 3. VALIDATION ZOD
        // =========================================================================

        const validationResult = contactSchema.safeParse(body)

        if (!validationResult.success) {
            const errors = validationResult.error.issues.map((issue) => ({
                field: issue.path.join('.'),
                message: issue.message,
            }))

            console.warn('[Validation Error]', { ip: clientIp, errors })

            return NextResponse.json(
                {
                    success: false,
                    error: 'Données invalides',
                    code: 'VALIDATION_ERROR',
                    errors,
                },
                { status: 400 }
            )
        }

        const data = validationResult.data

        // =========================================================================
        // 4. VÉRIFICATION HONEYPOT (ANTI-SPAM)
        // =========================================================================

        if (data.honeypot && data.honeypot.length > 0) {
            console.warn('[Honeypot Triggered]', {
                ip: clientIp,
                honeypotValue: data.honeypot,
            })

            return NextResponse.json({
                success: true,
                message: 'Message envoyé avec succès !',
            })
        }

        // =========================================================================
        // 5. ENVOI DE L'EMAIL VIA BREVO
        // =========================================================================

        const { messageId } = await sendContactEmail({
            name: data.name,
            email: data.email,
            subject: data.subject,
            message: data.message,
            projectType: data.projectType,
            budget: data.budget,
        })

        console.log('[Contact Form] Email sent successfully', {
            ip: clientIp,
            messageId,
            from: data.email,
        })

        // =========================================================================
        // 6. RÉPONSE SUCCÈS
        // =========================================================================

        return NextResponse.json({
            success: true,
            message: 'Message envoyé avec succès !',
            messageId,
        })
    } catch (error) {
        // =========================================================================
        // GESTION DES ERREURS
        // =========================================================================

        console.error('[Contact Form Error]', error)

        return NextResponse.json(
            {
                success: false,
                error: "Une erreur est survenue lors de l'envoi du message.",
                code: 'SERVER_ERROR',
            },
            { status: 500 }
        )
    }
}

// =============================================================================
/**
 * Handler pour les requêtes OPTIONS (preflight CORS).
 * Nécessaire si l'API est appelée depuis un autre domaine.
 */
export async function OPTIONS() {
    return new NextResponse(null, {
        status: 204,
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type',
        },
    })
}
