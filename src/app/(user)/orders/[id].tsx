import { View, Text, StyleSheet, FlatList } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

import orders from '@/assets/data/orders'

import { PizzaSize } from '@/src/types'
import OrderListItem from '@/src/components/OrderListItem'
import OrderItemListItem from '@/src/components/OrderItemListItem'

const OrderDetailsScreen = () => {
  const { id } = useLocalSearchParams()

  const order = orders.find((p) => p.id.toString() === id)

  if (!order) {
    return <Text>order not found</Text>
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem orderItem={item} />}
        contentContainerStyle={{ gap: 10, paddingTop: 10 }}
      />

    </View>
  )
}

export default OrderDetailsScreen

const styles = StyleSheet.create({
  container: {
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