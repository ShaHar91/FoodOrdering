import { View, Text, StyleSheet, FlatList, Pressable, ActivityIndicator } from 'react-native'
import React from 'react'
import { Stack, useLocalSearchParams } from 'expo-router'

import orders from '@/assets/data/orders'

import OrderListItem from '@/src/components/OrderListItem'
import OrderItemListItem from '@/src/components/OrderItemListItem'
import { OrderStatusList } from '@/src/types'
import Colors from '@/src/constants/Colors'
import { useOrderDetails, useUpdateOrder } from '@/src/api/orders'

const OrderDetailsScreen = () => {
  const { id: idString } = useLocalSearchParams()
  const id = parseFloat(typeof idString === 'string' ? idString : idString?.[0] ?? "")
  const { data: order, error, isLoading } = useOrderDetails(id);

  const { mutate: updateOrder } = useUpdateOrder()

  const updateStatus = (status: string) => {
    updateOrder({ id: id, updatedFields: { status } })
  }

  if (!order) {
    return <Text>order not found</Text>
  }

  if (isLoading) return <ActivityIndicator />
  if (error) return <Text>Failed to fetch product detail</Text>

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: `Order #${order.id}` }} />

      <OrderListItem order={order} />

      <FlatList
        data={order.order_items}
        renderItem={({ item }) => <OrderItemListItem orderItem={item} />}
        contentContainerStyle={{ gap: 10, paddingTop: 10 }}
        ListFooterComponent={() => (
          <>
            <Text style={{ fontWeight: 'bold' }}>Status</Text>
            <View style={{ flexDirection: 'row', gap: 5 }}>
              {OrderStatusList.map((status => (
                <Pressable
                  key={status}
                  onPress={() => updateStatus(status)}
                  style={{
                    borderColor: Colors.light.tint,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 5,
                    marginVertical: 10,
                    backgroundColor: order.status === status ? Colors.light.tint : 'transparent'
                  }}
                >
                  <Text
                    style={{ color: order.status === status ? 'white' : Colors.light.tint }}
                  >
                    {status}
                  </Text>
                </Pressable>
              )))}
            </View>
          </>
        )}
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