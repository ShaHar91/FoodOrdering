import { PropsWithChildren, createContext, useContext, useState } from "react";
import { CartItem, Tables } from "../types";
import { randomUUID } from 'expo-crypto'
import { useInsertOrder } from "../api/orders";
import { useRouter } from "expo-router";
import { useInsertOrderItems } from "../api/order-items";

type Product = Tables<'products'>

type CartType = {
    items: CartItem[],
    addItem: (product: Product, size: CartItem['size']) => void
    updateQuantity: (itemId: string, amount: -1 | 1) => void
    total: number,
    checkout: () => void
}

const CartContext = createContext<CartType>({
    items: [],
    addItem: () => { },
    updateQuantity: () => { },
    total: 0,
    checkout: () => { }
})

const CartProvider = ({ children }: PropsWithChildren) => {
    const [items, setItems] = useState<CartItem[]>([])

    const { mutate: insertOrder } = useInsertOrder()
    const { mutate: insertOrderItems } = useInsertOrderItems()
    const router = useRouter()

    const addItem = (product: Product, size: CartItem['size']) => {
        const existingItem = items.find(item => item.product === product && item.size === size)
        if (existingItem) {
            updateQuantity(existingItem.id, 1)
            return
        }

        const newCartItem: CartItem = {
            id: randomUUID(),
            product,
            product_id: product.id,
            size,
            quantity: 1,
        }

        setItems([newCartItem, ...items])
    }

    const updateQuantity = (itemId: string, amount: -1 | 1) => {
        const updatedItems = items
            .map((item) => item.id !== itemId ? item : { ...item, quantity: item.quantity + amount })
            .filter((item) => item.quantity > 0)

        setItems(updatedItems)
    }

    const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)

    const clearCart = () => {
        setItems([])
    }

    const checkout = () => {
        insertOrder({ total }, {
            onSuccess: saveOrderItems
        })
    }

    const saveOrderItems = (order: Tables<'orders'>) => {
        const orderItems = items.map(cartItem => ({
            order_id: order.id,
            product_id: cartItem.product_id,
            quantity: cartItem.quantity,
            size: cartItem.size
        }))

        insertOrderItems(orderItems, {
            onSuccess() {
                clearCart()
                router.push(`/(user)/orders/${order.id}`)
            }
        })
    }

    return (
        <CartContext.Provider value={{ items, addItem, updateQuantity, total, checkout }}>
            {children}
        </CartContext.Provider>
    )
}

export default CartProvider;

// Custom hook, so we don't have to add 2 imports and do this in every screen we need it
export const useCart = () => useContext(CartContext)