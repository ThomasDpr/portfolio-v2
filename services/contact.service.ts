import type { ContactFormValues } from '@/lib/contact/'

export type ContactApiErrorCode =
    | 'RATE_LIMIT_EXCEEDED'
    | 'INVALID_JSON'
    | 'VALIDATION_ERROR'
    | 'SERVER_ERROR'

export type ContactApiResponse =
    | { success: true; message?: string; messageId?: string }
    | {
          success: false
          error: string
          code?: ContactApiErrorCode
          errors?: Array<{ field: string; message: string }>
      }

export async function sendContactMessage(data: ContactFormValues): Promise<ContactApiResponse> {
    const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
    })

    const result = (await response.json()) as ContactApiResponse

    if (!response.ok) {
        throw new Error(!result.success && result.error ? result.error : "Erreur lors de l'envoi")
    }

    return result
}
