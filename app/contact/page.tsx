/**
 * =============================================================================
 * PAGE CONTACT
 * =============================================================================
 *
 * Cette page est un SERVER COMPONENT.
 *
 * Qu'est-ce que ça signifie ?
 * ===========================
 *
 * 1. Ce code s'exécute UNIQUEMENT sur le serveur
 * 2. Le HTML est généré côté serveur et envoyé au client
 * 3. Aucun JavaScript de ce fichier n'est envoyé au navigateur
 * 4. On peut accéder aux variables d'environnement serveur (process.env.*)
 * 5. On peut faire des appels DB directs, lire des fichiers, etc.
 *
 * Ce qu'on NE PEUT PAS faire dans un Server Component :
 * =====================================================
 *
 * ❌ useState, useEffect, useContext (hooks React)
 * ❌ onClick, onChange (événements)
 * ❌ window, document (APIs navigateur)
 * ❌ Animations/interactions client
 *
 * Comment combiner Server et Client Components ?
 * ===============================================
 *
 * On peut imbriquer un Client Component dans un Server Component :
 *
 *   Server Component (cette page)
 *       │
 *       └── <ContactForm /> ← Client Component
 *
 * Le Server Component génère le HTML statique (titre, description),
 * et le Client Component gère l'interactivité (formulaire).
 *
 * Avantages de cette approche :
 * =============================
 *
 * ✅ SEO optimisé (le titre et la description sont dans le HTML initial)
 * ✅ Temps de chargement réduit (moins de JS)
 * ✅ Meilleure performance (le serveur fait le travail)
 * ✅ Séparation claire des responsabilités
 */

import type { Metadata } from 'next'
import { ContactForm } from '@/components/contact/contact-form'
import { Mail, MessageSquare, Clock } from 'lucide-react'

// =============================================================================
// MÉTADONNÉES SEO
// =============================================================================

/**
 * Métadonnées de la page pour le SEO.
 * Ces métadonnées sont générées côté serveur et incluses dans le HTML.
 */
export const metadata: Metadata = {
    title: 'Contact | Portfolio',
    description:
        'Contactez-moi pour discuter de votre projet web, application mobile ou autre. Je réponds généralement sous 24 heures.',
    openGraph: {
        title: 'Contact | Portfolio',
        description:
            'Contactez-moi pour discuter de votre projet web, application mobile ou autre.',
        type: 'website',
    },
}

// =============================================================================
// COMPOSANT PAGE
// =============================================================================

export default function ContactPage() {
    return (
        <main className="min-h-screen bg-zinc-50 py-12 dark:bg-zinc-950">
            <div className="container mx-auto max-w-4xl px-4">
                {/* ================================================================= */}
                {/* EN-TÊTE */}
                {/* ================================================================= */}
                <header className="mb-12 text-center">
                    <h1 className="mb-4 text-4xl font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                        Me contacter
                    </h1>
                    <p className="mx-auto max-w-2xl text-lg text-zinc-600 dark:text-zinc-400">
                        Vous avez un projet en tête ? Une question ? N&apos;hésitez pas à
                        m&apos;envoyer un message. Je réponds généralement sous 24 heures.
                    </p>
                </header>

                {/* ================================================================= */}
                {/* CONTENU PRINCIPAL */}
                {/* ================================================================= */}
                <div className="grid gap-12 lg:grid-cols-3">
                    {/* =============================================================== */}
                    {/* INFORMATIONS DE CONTACT */}
                    {/* =============================================================== */}
                    <aside className="lg:col-span-1">
                        <div className="space-y-6">
                            <InfoCard
                                icon={<Mail className="size-5" />}
                                title="Email"
                                description="La façon la plus rapide de me joindre"
                            />
                            <InfoCard
                                icon={<MessageSquare className="size-5" />}
                                title="Réponse garantie"
                                description="Je réponds à chaque message personnellement"
                            />
                            <InfoCard
                                icon={<Clock className="size-5" />}
                                title="Délai de réponse"
                                description="Généralement sous 24 heures ouvrées"
                            />
                        </div>
                    </aside>

                    {/* =============================================================== */}
                    {/* FORMULAIRE */}
                    {/* =============================================================== */}
                    <section className="lg:col-span-2">
                        <div className="rounded-xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8 dark:border-zinc-800 dark:bg-zinc-900">
                            {/**
                             * ContactForm est un CLIENT COMPONENT.
                             *
                             * Il est importé et rendu ici, mais son code JavaScript
                             * sera exécuté dans le navigateur, pas sur le serveur.
                             *
                             * Le serveur génère un "placeholder" qui sera hydraté
                             * par React côté client.
                             */}
                            <ContactForm />
                        </div>
                    </section>
                </div>
            </div>
        </main>
    )
}

// =============================================================================
// COMPOSANT HELPER : CARTE D'INFORMATION
// =============================================================================

/**
 * Carte d'information affichée dans la sidebar.
 * C'est un composant purement présentationnel, donc pas besoin de "use client".
 */
function InfoCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode
    title: string
    description: string
}) {
    return (
        <div className="flex items-start gap-4 rounded-lg border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-400">
                {icon}
            </div>
            <div>
                <h3 className="font-medium text-zinc-900 dark:text-zinc-100">{title}</h3>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{description}</p>
            </div>
        </div>
    )
}




