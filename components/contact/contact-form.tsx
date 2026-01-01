/**
 * =============================================================================
 * COMPOSANT FORMULAIRE DE CONTACT
 * =============================================================================
 *
 * Ce composant gère le formulaire de contact avec :
 *   - TanStack Form pour la gestion du formulaire
 *   - Zod pour la validation
 *   - TanStack Query pour la mutation (envoi au serveur)
 *   - shadcn/ui pour les composants UI
 *   - Sonner pour les toasts
 *
 * Pourquoi "use client" ?
 * =======================
 *
 * Ce composant DOIT être un Client Component car il utilise :
 *   - useState (via TanStack Form et Query)
 *   - useEffect (lifecycle)
 *   - Événements onClick, onChange, onSubmit
 *   - Contexte React (QueryClientProvider)
 *
 * Les Server Components ne peuvent pas utiliser ces fonctionnalités
 * car ils s'exécutent uniquement sur le serveur.
 *
 * Architecture TanStack Form :
 * ============================
 *
 *   useForm() → Crée le formulaire avec les valeurs par défaut
 *       │
 *       ├── form.Field → Composant pour chaque champ
 *       │       │
 *       │       └── field.state.value → Valeur actuelle
 *       │           field.handleChange → Mise à jour
 *       │           field.state.meta.errors → Erreurs de validation
 *       │
 *       └── form.handleSubmit() → Soumission du formulaire
 *
 * Flux de soumission :
 * ====================
 *
 *   1. Utilisateur clique "Envoyer"
 *   2. TanStack Form valide avec Zod
 *   3. Si valide → mutation TanStack Query
 *   4. Mutation POST /api/contact
 *   5. Réponse → toast succès/erreur
 *   6. Reset du formulaire si succès
 */

'use client'

import { useForm } from '@tanstack/react-form'
import { useSendContactMessageMutation } from '@/queries/contact.queries'
import { toast } from 'sonner'
import { Loader2, Send } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import {
    contactFormDefaultValues,
    projectTypes,
    projectTypeLabels,
    contactSchema,
    type ProjectType,
    type BudgetRange,
    budgetRanges,
    budgetRangeLabels,
} from '@/lib/contact'

// =============================================================================
// COMPOSANT PRINCIPAL
// =============================================================================

export function ContactForm() {
    // ===========================================================================
    // MUTATION TANSTACK QUERY
    // ===========================================================================

    /**
     * Mutation pour envoyer le formulaire à l'API.
     *
     * useMutation offre :
     *   - isPending : état de chargement
     *   - isSuccess : envoi réussi
     *   - isError : erreur survenue
     *   - mutate() : fonction pour déclencher la mutation
     */
    const mutation = useSendContactMessageMutation()

    // ===========================================================================
    // FORMULAIRE TANSTACK FORM
    // ===========================================================================

    /**
     * Configuration du formulaire avec TanStack Form.
     *
     * Contrairement à React Hook Form, TanStack Form utilise une approche
     * plus déclarative avec des composants Field.
     */
    const form = useForm({
        defaultValues: contactFormDefaultValues,
        onSubmit: async ({ value }) => {
            // Soumission via TanStack Query
            mutation.mutate(value, {
                onSuccess: () => {
                    toast.success('Message envoyé !', {
                        description: 'Merci pour votre message. Je vous répondrai rapidement.',
                    })
                    form.reset()
                },
                onError: (error: Error) => {
                    toast.error("Erreur d'envoi", {
                        description:
                            error.message || 'Une erreur est survenue. Veuillez réessayer.',
                    })
                },
            })
        },
        validators: {
            // Validation au niveau du formulaire avec Zod
            onSubmit: ({ value }) => {
                const result = contactSchema.safeParse(value)
                if (!result.success) {
                    // Retourne les erreurs par champ
                    // Zod 4 utilise .issues au lieu de .errors
                    const fieldErrors: Record<string, string> = {}
                    for (const issue of result.error.issues) {
                        const field = issue.path[0] as string
                        fieldErrors[field] = issue.message
                    }
                    return fieldErrors
                }
                return undefined
            },
        },
    })

    // État de chargement pour le bouton
    const isSubmitting = mutation.isPending

    // ===========================================================================
    // RENDU
    // ===========================================================================

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault()
                e.stopPropagation()
                form.handleSubmit()
            }}
            className="space-y-6"
        >
            {/* ===================================================================== */}
            {/* CHAMP NOM */}
            {/* ===================================================================== */}
            <form.Field
                name="name"
                validators={{
                    onBlur: ({ value }) => {
                        if (!value || value.length < 2) {
                            return 'Le nom doit contenir au moins 2 caractères'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>
                            Nom <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Votre nom"
                            aria-invalid={field.state.meta.errors.length > 0}
                            disabled={isSubmitting}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            {/* ===================================================================== */}
            {/* CHAMP EMAIL */}
            {/* ===================================================================== */}
            <form.Field
                name="email"
                validators={{
                    onBlur: ({ value }) => {
                        if (!value) {
                            return "L'email est requis"
                        }
                        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
                        if (!emailRegex.test(value)) {
                            return 'Veuillez entrer une adresse email valide'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>
                            Email <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            type="email"
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="votre@email.com"
                            aria-invalid={field.state.meta.errors.length > 0}
                            disabled={isSubmitting}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            {/* ===================================================================== */}
            {/* CHAMP SUJET */}
            {/* ===================================================================== */}
            <form.Field
                name="subject"
                validators={{
                    onBlur: ({ value }) => {
                        if (!value || value.length < 3) {
                            return 'Le sujet doit contenir au moins 3 caractères'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>
                            Sujet <span className="text-destructive">*</span>
                        </Label>
                        <Input
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Sujet de votre message"
                            aria-invalid={field.state.meta.errors.length > 0}
                            disabled={isSubmitting}
                        />
                        <FieldError errors={field.state.meta.errors} />
                    </div>
                )}
            </form.Field>

            {/* ===================================================================== */}
            {/* CHAMPS OPTIONNELS : TYPE DE PROJET ET BUDGET */}
            {/* ===================================================================== */}
            <div className="grid gap-6 sm:grid-cols-2">
                {/* Type de projet */}
                <form.Field name="projectType">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Type de projet</Label>
                            <Select
                                value={field.state.value || ''}
                                onValueChange={(value) => field.handleChange(value as ProjectType)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder="Sélectionnez un type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {projectTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                            {projectTypeLabels[type]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.Field>

                {/* Budget */}
                <form.Field name="budget">
                    {(field) => (
                        <div className="space-y-2">
                            <Label htmlFor={field.name}>Budget estimé</Label>
                            <Select
                                value={field.state.value || ''}
                                onValueChange={(value) => field.handleChange(value as BudgetRange)}
                                disabled={isSubmitting}
                            >
                                <SelectTrigger id={field.name}>
                                    <SelectValue placeholder="Sélectionnez un budget" />
                                </SelectTrigger>
                                <SelectContent>
                                    {budgetRanges.map((range) => (
                                        <SelectItem key={range} value={range}>
                                            {budgetRangeLabels[range]}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )}
                </form.Field>
            </div>

            {/* ===================================================================== */}
            {/* CHAMP MESSAGE */}
            {/* ===================================================================== */}
            <form.Field
                name="message"
                validators={{
                    onBlur: ({ value }) => {
                        if (!value || value.length < 20) {
                            return 'Le message doit contenir au moins 20 caractères'
                        }
                        return undefined
                    },
                }}
            >
                {(field) => (
                    <div className="space-y-2">
                        <Label htmlFor={field.name}>
                            Message <span className="text-destructive">*</span>
                        </Label>
                        <Textarea
                            id={field.name}
                            name={field.name}
                            value={field.state.value}
                            onBlur={field.handleBlur}
                            onChange={(e) => field.handleChange(e.target.value)}
                            placeholder="Décrivez votre projet ou votre demande..."
                            rows={5}
                            aria-invalid={field.state.meta.errors.length > 0}
                            disabled={isSubmitting}
                        />
                        <FieldError errors={field.state.meta.errors} />
                        <p className="text-muted-foreground text-xs">Minimum 20 caractères</p>
                    </div>
                )}
            </form.Field>

            {/* ===================================================================== */}
            {/* HONEYPOT (ANTI-SPAM) */}
            {/* ===================================================================== */}
            {/**
             * Champ honeypot : invisible pour les humains, visible pour les bots.
             *
             * Les bots remplissent automatiquement tous les champs qu'ils trouvent.
             * Si ce champ est rempli, on sait que c'est un bot.
             *
             * On utilise plusieurs techniques pour le cacher :
             *   - aria-hidden : caché pour les lecteurs d'écran
             *   - tabIndex -1 : non focusable au clavier
             *   - position absolute + opacity 0 : invisible visuellement
             *   - autocomplete off : pas de suggestion
             */}
            <form.Field name="honeypot">
                {(field) => (
                    <div className="absolute -left-[9999px] opacity-0" aria-hidden="true">
                        <Label htmlFor="website">Ne pas remplir ce champ</Label>
                        <Input
                            id="website"
                            name="website"
                            type="text"
                            value={field.state.value || ''}
                            onChange={(e) => field.handleChange(e.target.value)}
                            tabIndex={-1}
                            autoComplete="off"
                        />
                    </div>
                )}
            </form.Field>

            {/* ===================================================================== */}
            {/* BOUTON DE SOUMISSION */}
            {/* ===================================================================== */}
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
                {isSubmitting ? (
                    <>
                        <Loader2 className="animate-spin" />
                        Envoi en cours...
                    </>
                ) : (
                    <>
                        <Send />
                        Envoyer le message
                    </>
                )}
            </Button>
        </form>
    )
}

// =============================================================================
// COMPOSANT HELPER : AFFICHAGE DES ERREURS
// =============================================================================

/**
 * Affiche les erreurs de validation pour un champ.
 */
function FieldError({ errors }: { errors: Array<string | undefined> }) {
    const filteredErrors = errors.filter(Boolean)

    if (filteredErrors.length === 0) {
        return null
    }

    return (
        <div className="text-destructive text-sm" role="alert">
            {filteredErrors.map((error, index) => (
                <p key={index}>{error}</p>
            ))}
        </div>
    )
}
