import type { z } from 'zod'
import type { contactSchema } from './schema'

/**
 * Type TS dérivé du schéma Zod.
 */
export type ContactFormValues = z.infer<typeof contactSchema>

/**
 * Type pour les valeurs par défaut du formulaire.
 */
export type ContactFormDefaultValues = Partial<ContactFormValues>
