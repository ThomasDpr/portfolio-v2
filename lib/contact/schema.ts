import { z } from 'zod'

/**
 * Types de projets disponibles.
 */
export const projectTypes = ['website', 'webapp', 'mobile', 'ecommerce', 'other'] as const
export type ProjectType = (typeof projectTypes)[number]

/**
 * Tranches de budget disponibles.
 */
export const budgetRanges = [
    'less-than-5k',
    '5k-10k',
    '10k-25k',
    '25k-50k',
    'more-than-50k',
    'not-sure',
] as const
export type BudgetRange = (typeof budgetRanges)[number]

/**
 * Schéma Zod pour le formulaire de contact.
 */
export const contactSchema = z.object({
    name: z
        .string()
        .min(2, 'Le nom doit contenir au moins 2 caractères')
        .max(100, 'Le nom ne peut pas dépasser 100 caractères'),
    email: z
        .email('Veuillez entrer une adresse email valide')
        .max(255, "L'email ne peut pas dépasser 255 caractères"),
    subject: z
        .string()
        .min(3, 'Le sujet doit contenir au moins 3 caractères')
        .max(200, 'Le sujet ne peut pas dépasser 200 caractères'),
    message: z
        .string()
        .min(20, 'Le message doit contenir au moins 20 caractères')
        .max(5000, 'Le message ne peut pas dépasser 5000 caractères'),
    projectType: z.enum(projectTypes).optional(),
    budget: z.enum(budgetRanges).optional(),
    honeypot: z.string().max(0, 'Ce champ doit rester vide').optional(),
})
