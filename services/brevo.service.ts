import 'server-only'

import type { BrevoApiResponse, BrevoApiError } from '@/lib/brevo/types'

const BREVO_API_URL = 'https://api.brevo.com/v3/smtp/email'

/**
 * Service HTTP bas niveau pour appeler l'API Brevo.
 *
 * - Lit la clé API dans les env
 * - Fait le fetch vers Brevo
 * - Gère les erreurs HTTP / JSON
 */
export async function sendBrevoEmail(requestBody: unknown): Promise<BrevoApiResponse> {
    const apiKey = process.env.BREVO_API_KEY

    if (!apiKey) {
        throw new Error('BREVO_API_KEY is not defined in environment variables')
    }

    const response = await fetch(BREVO_API_URL, {
        method: 'POST',
        headers: {
            'api-key': apiKey,
            'Content-Type': 'application/json',
            Accept: 'application/json',
        },
        body: JSON.stringify(requestBody),
    })

    if (!response.ok) {
        const errorData = (await response
            .json()
            .catch(() => ({ message: 'Unknown error', code: 'UNKNOWN' }))) as BrevoApiError

        console.error('[Brevo API Error]', {
            status: response.status,
            error: errorData,
        })

        throw new Error(`Failed to send email: ${errorData.message || response.statusText}`)
    }

    const data = (await response.json()) as BrevoApiResponse
    return data
}
