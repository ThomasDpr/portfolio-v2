import type { ContactFormValues } from './types'
import type { ProjectType, BudgetRange } from './schema'

/**
 * Valeurs par défaut pour initialiser le formulaire.
 */
export const contactFormDefaultValues: ContactFormValues = {
    name: '',
    email: '',
    subject: '',
    message: '',
    projectType: undefined,
    budget: undefined,
    honeypot: '',
}

/**
 * Labels lisibles pour les types de projets (affichage dans le select).
 */
export const projectTypeLabels: Record<ProjectType, string> = {
    website: 'Site vitrine',
    webapp: 'Application web',
    mobile: 'Application mobile',
    ecommerce: 'E-commerce',
    other: 'Autre',
}

/**
 * Labels lisibles pour les tranches de budget.
 */
export const budgetRangeLabels: Record<BudgetRange, string> = {
    'less-than-5k': 'Moins de 5 000 €',
    '5k-10k': '5 000 € - 10 000 €',
    '10k-25k': '10 000 € - 25 000 €',
    '25k-50k': '25 000 € - 50 000 €',
    'more-than-50k': 'Plus de 50 000 €',
    'not-sure': 'Je ne sais pas encore',
}
