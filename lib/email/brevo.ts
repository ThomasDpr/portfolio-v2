import 'server-only'

import { sendBrevoEmail } from '@/services/brevo.service'
import type { SendContactEmailParams, BrevoEmailRequestBody } from '@/lib/brevo/'
import { generateContactEmailContent } from '@/lib/email/contact-email-content'

export async function sendContactEmail(
    params: SendContactEmailParams
): Promise<{ messageId: string }> {
    // Mode dev : on ne call pas Brevo, on log juste
    if (process.env.NODE_ENV !== 'production') {
        console.log('[DEV Contact] Email not sent (Brevo disabled in dev). Payload:', params)
        return { messageId: 'dev-console' }
    }

    const senderEmail = process.env.BREVO_SENDER_EMAIL
    const senderName = process.env.BREVO_SENDER_NAME || 'Portfolio Contact'
    const receiverEmail = process.env.BREVO_RECEIVER_EMAIL || process.env.BREVO_SENDER_EMAIL

    if (!senderEmail) {
        throw new Error('BREVO_SENDER_EMAIL is not defined in environment variables')
    }
    if (!receiverEmail) {
        throw new Error('BREVO_RECEIVER_EMAIL is not defined in environment variables')
    }

    // 1. Génération du contenu via React Email (externalisé)
    const { htmlContent, textContent } = await generateContactEmailContent(params)

    // 2. Construction du body attendu par Brevo
    const requestBody: BrevoEmailRequestBody = {
        sender: {
            name: senderName,
            email: senderEmail,
        },
        to: [
            {
                email: receiverEmail,
                name: 'Portfolio Owner',
            },
        ],
        replyTo: {
            email: params.email,
            name: params.name,
        },
        subject: `[Portfolio] ${params.subject}`,
        htmlContent,
        textContent,
    }

    // 3. Appel du service HTTP Brevo
    const data = await sendBrevoEmail(requestBody)

    console.log('[Brevo] Email sent successfully', {
        messageId: data.messageId,
        to: receiverEmail,
        from: params.email,
    })

    return { messageId: data.messageId || 'unknown' }
}
