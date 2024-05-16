import { Tables, TablesInsert, TablesUpdate } from '@/src/database.types'
import { supabase } from '@/src/lib/supabase'
import { useAuth } from '@/src/providers/AuthProvider'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export const useAdminOrderList = ({ archived = false }) => {
    const statuses = archived ? ['Delivered'] : ['New', 'Cooking', 'Delivering']

    return useQuery({
        queryKey: ['orders', { archived }],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .in('status', statuses)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data
        }
    })
}

export const useMyOrderList = () => {
    const { session } = useAuth()
    const id = session?.user.id

    return useQuery({
        queryKey: ['orders', { userId: id }],
        queryFn: async () => {
            if (!id) return null

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('user_id', id)
                .order('created_at', { ascending: false })

            if (error) throw error

            return data
        }
    })
}

export const useOrderDetails = (id: number) => {
    return useQuery({
        queryKey: ['orders', id],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('*, order_items(*, products(*))')
                .eq('id', id)
                .single()

            if (error) throw error

            return data
        }
    })
}

export const useInsertOrder = () => {
    const queryClient = useQueryClient()
    const { session } = useAuth()
    const userId = session?.user.id

    return useMutation({
        async mutationFn(data: TablesInsert<'orders'>) {
            const { error, data: newOrder } = await supabase
                .from('orders')
                .insert({ ...data, user_id: userId })
                .select()
                .single()

            if (error) throw error

            return newOrder
        },
        async onSuccess() {
            // Invalidate all caches where the key starts with 'products', makes sure we can refetch the data when being routed back to the menu.
            await queryClient.invalidateQueries({ queryKey: ['orders'] })
        },
        onError(error) {
            console.log(error)
        }
    })
}

export const useUpdateOrder = () => {
    const queryClient = useQueryClient()
    const { session } = useAuth()
    const userId = session?.user.id

    return useMutation({
        async mutationFn(
            {
                id,
                updatedFields
            }: {
                id: number,
                updatedFields: TablesUpdate<'orders'>
            }) {
            const { error, data: newOrder } = await supabase
                .from('orders')
                .update(updatedFields)
                .eq('id', id)
                .select()
                .single()

            if (error) throw error

            return newOrder
        },
        async onSuccess(_, { id }) {
            // Invalidate all caches where the key starts with 'products', makes sure we can refetch the data when being routed back to the menu.
            await queryClient.invalidateQueries({ queryKey: ['orders'] })
            await queryClient.invalidateQueries({ queryKey: ['orders', id] })
        },
        onError(error) {
            console.log(error)
        }
    })
}
