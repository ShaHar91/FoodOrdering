import { View, Text, Image, StyleSheet, ViewStyle, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

import products from '@/assets/data/products'
import { defaultPizzaImage } from '@/src/components/ProductListItem'

import Button from '@/src/components/Button'

const sizes = ['S', 'M', 'L', 'XL']

const ProductDetailsScreen = () => {
  const { id } = useLocalSearchParams()
  const [selectedSize, setSelectedSize] = useState('M')

  const product = products.find((p) => p.id.toString() === id)

  const addToCart = () => {
    console.warn("Adding to cart, size: ", selectedSize)
  }

  if (!product) {
    return <Text>Product not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: product.name }} />

      <Image source={{ uri: product.image || defaultPizzaImage }} style={styles.image} />

      <Text>Select size</Text>

      <View style={styles.sizes}>
        {sizes.map(size =>
          <TouchableOpacity onPress={() => { setSelectedSize(size) }} style={[styles.size, { backgroundColor: size === selectedSize ? 'gainsboro' : 'white' }]} key={size}>
            <Text style={[styles.sizeText, { color: size === selectedSize ? 'black' : 'gray' }]}>{size}</Text>
          </TouchableOpacity>
        )}
      </View>
      <Text style={styles.price}>${product.price}</Text>

      <Button text="Add to cart" onPress={addToCart} />
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
    marginTop: 'auto'
  },
  sizes: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 10
  },
  size: {
    backgroundColor: 'gainsboro',
    width: 50,
    aspectRatio: 1,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center'
  },
  sizeText: {
    fontSize: 20,
    fontWeight: '500'
  }
})