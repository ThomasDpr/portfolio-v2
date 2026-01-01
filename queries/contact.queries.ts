'use client'

import { useMutation } from '@tanstack/react-query'
import type { ContactFormValues } from '@/lib/contact/'
import { sendContactMessage } from '@/services'

export function useSendContactMessageMutation() {
    return useMutation({
        mutationFn: (data: ContactFormValues) => sendContactMessage(data),
    })
}
