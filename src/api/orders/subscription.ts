import { useEffect } from 'react';
import { supabase } from '@/src/lib/supabase';
import { useQueryClient } from '@tanstack/react-query'

export const useInsertOrderSubscription = () => {
    const queryClient = useQueryClient()

    useEffect(() => {
        const ordersSubscription = supabase
            .channel('custom-insert-channel')
            .on(
                'postgres_changes',
                { event: 'INSERT', schema: 'public', table: 'orders' },
                () => {
                    queryClient.invalidateQueries({ queryKey: ['orders'] })
                }
            )
            .subscribe()

        return () => {
            // The return statement gets called when react unmounts the component to make sure we don't leak memory.
            ordersSubscription.unsubscribe()
        }
    }, [])
}

export const useUpdateOrderSubscription = (id: number) => {
    const queryClient = useQueryClient()

    const channels = supabase
        .channel('custom-update-channel')
        .on(
            'postgres_changes',
            {
                event: 'UPDATE',
                schema: 'public',
                table: 'orders',
                filter: `id=eq.${id}`
            },
            () => {
                queryClient.invalidateQueries({ queryKey: ['orders', id] })
            }
        )
        .subscribe()
}