import 'server-only'

import * as React from 'react'
import { render } from '@react-email/render'

import ContactEmail from '@/emails/contact-email'
import type { SendContactEmailParams } from '@/lib/brevo/'

/**
 * Génère le contenu HTML et texte d'un email de contact
 * à partir du template React Email `ContactEmail`.
 */
export async function generateContactEmailContent(params: SendContactEmailParams): Promise<{
    htmlContent: string
    textContent: string
}> {
    const emailElement = React.createElement(ContactEmail, params)

    const htmlContent = await render(emailElement)
    const textContent = await render(emailElement, { plainText: true })

    return { htmlContent, textContent }
}
