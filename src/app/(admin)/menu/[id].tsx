import { View, Text, StyleSheet, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Link, Stack, useLocalSearchParams } from 'expo-router'

import { defaultPizzaImage } from '@/src/components/ProductListItem'

import { PizzaSize } from '@/src/types'
import { FontAwesome } from '@expo/vector-icons'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import { useProduct } from '@/src/api/products'
import RemoteImage from '@/src/components/RemoteImage'

const sizes: PizzaSize[] = ['S', 'M', 'L', 'XL']

const ProductDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams()
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0] ?? "")

  const { data: product, error, isLoading } = useProduct(id)

  if (isLoading) return <ActivityIndicator />
  if (error || !product) return <Text>Failed to fetch product detail</Text>

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

      <RemoteImage path={product.image} fallback={defaultPizzaImage} style={styles.image} resizeMode='contain' />

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