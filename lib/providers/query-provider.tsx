/**
 * =============================================================================
 * TANSTACK QUERY PROVIDER
 * =============================================================================
 *
 * Ce composant fournit le contexte TanStack Query à toute l'application.
 *
 * Pourquoi TanStack Query ?
 * =========================
 *
 * TanStack Query (anciennement React Query) est une bibliothèque de gestion
 * d'état serveur pour React. Elle offre :
 *
 *   - Caching automatique des données
 *   - Invalidation intelligente
 *   - États de chargement et d'erreur
 *   - Retry automatique
 *   - Mutations avec gestion d'états (pending, success, error)
 *
 * Pour notre formulaire de contact, on utilise principalement les MUTATIONS :
 *   - useMutation pour envoyer les données au serveur
 *   - isPending pour l'état de chargement
 *   - isError / isSuccess pour la gestion des résultats
 *
 * Configuration du QueryClient :
 * ==============================
 *
 * Le QueryClient est configuré une seule fois et passé via le Provider.
 * On utilise useState pour éviter de recréer le client à chaque render.
 *
 * IMPORTANT : Ce composant doit être un "use client" car il utilise
 * des hooks React (useState) et du contexte.
 */

'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

interface QueryProviderProps {
    children: React.ReactNode
}

/**
 * Provider TanStack Query pour l'application.
 *
 * @example
 * ```tsx
 * // Dans app/layout.tsx
 * <QueryProvider>
 *   {children}
 * </QueryProvider>
 * ```
 */
export function QueryProvider({ children }: QueryProviderProps) {
    // On crée le QueryClient une seule fois avec useState
    // Cela évite de recréer le client à chaque render
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // Évite les refetch automatiques lors du focus de la fenêtre
                        // Utile pour les formulaires où on ne veut pas perdre l'état
                        refetchOnWindowFocus: false,
                        // Nombre de tentatives en cas d'échec
                        retry: 1,
                        // Durée pendant laquelle les données sont considérées "fraîches"
                        staleTime: 60 * 1000, // 1 minute
                    },
                    mutations: {
                        // Pas de retry pour les mutations (formulaires)
                        // On veut éviter les envois multiples
                        retry: false,
                    },
                },
            })
    )

    return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}
