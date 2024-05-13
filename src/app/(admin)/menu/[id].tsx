import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity, Pressable } from 'react-native'
import React, { useState } from 'react'
import { Link, Stack, useLocalSearchParams, useRouter } from 'expo-router'

import products from '@/assets/data/products'
import { defaultPizzaImage } from '@/src/components/ProductListItem'

import Button from '@/src/components/Button'
import { useCart } from '@/src/providers/CartProvider'
import { PizzaSize } from '@/src/types'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const { addItem } = useCart()
  const [selectedSize, setSelectedSize] = useState<PizzaSize>('M')
  const router = useRouter()

  const product = products.find((p) => p.id.toString() === id)

  const addToCart = () => {
    if (!product) return

    addItem(product, selectedSize)
    router.push('/cart')
  }

  if (!product) {
    return <Text>Product not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{
        headerRight: () => (
          <Link href={`/(admin)/menu/create?id=${id}`} asChild>
            <Pressable>
              {({ pressed }) => (
                <FontAwesome
                  name="pencil"
                  size={25}
                  color={Colors.light.tint}
                  style={{ marginRight: 15, opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Link>
        )
      }} />

      <Stack.Screen options={{ title: product.name }} />

      <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />

      <Text style={styles.price}>${product.price}</Text>
    </View>
  )
}

export default ProductDetailsScreen

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'white',
    flex: 1,
    padding: 10
  },
  image: {
    width: '100%',
    aspectRatio: 1
  },
  price: {
    fontSize: 18,
    fontWeight: 'bold',
  }
})