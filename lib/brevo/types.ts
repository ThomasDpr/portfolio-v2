/**
 * Paramètres nécessaires pour envoyer un email de contact
 * via Brevo (côté serveur).
 */
export interface SendContactEmailParams {
    name: string
    email: string
    subject: string
    message: string
    projectType?: string
    budget?: string
}

/**
 * Shape du body envoyé à Brevo.
 * (facultatif, mais ça documente bien ton intégration)
 */
export interface BrevoEmailRequestBody {
    sender: {
        name: string
        email: string
    }
    to: Array<{
        email: string
        name?: string
    }>
    replyTo?: {
        email: string
        name?: string
    }
    subject: string
    htmlContent: string
    textContent: string
}

/**
 * Réponse brute de l'API Brevo.
 */
export interface BrevoApiResponse {
    messageId?: string
}

/**
 * Shape d'une erreur renvoyée par Brevo.
 */
export interface BrevoApiError {
    message: string
    code: string
}
