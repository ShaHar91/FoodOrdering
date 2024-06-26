import Colors from '@/src/constants/Colors';
import { StyleSheet, Text, View, Image, Pressable, TouchableOpacity } from 'react-native';
import { Order, OrderItem, Tables } from '../types';
import { useSegments } from 'expo-router';
import { defaultPizzaImage } from './ProductListItem';
import RemoteImage from './RemoteImage';


type OrderItemListItemProps = {
    orderItem: { products: Tables<'products'> } & Tables<'order_items'>
}

const OrderItemListItem = ({ orderItem }: OrderItemListItemProps) => {
    const segments = useSegments()

    return (
        <View style={styles.container}>
            <RemoteImage path={orderItem.products.image} fallback={defaultPizzaImage} style={styles.image} resizeMode='contain' />

            <View style={{ flex: 1 }}>
                <Text style={styles.title}>{orderItem.products.name}</Text>

                <View style={styles.subtitleContainer}>
                    <Text style={styles.price}>${orderItem.products.price * orderItem.quantity}</Text>
                    <Text>Size: {orderItem.size}</Text>
                </View>
            </View>

            <Text style={styles.quantity}>{orderItem.quantity}</Text>
        </View>
    )
}

export default OrderItemListItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    subtitleContainer: {
        flexDirection: 'row',
        gap: 5,
    },
    image: {
        width: 75,
        aspectRatio: 1,
        alignSelf: 'center',
        marginRight: 10,
    },
    wrapper: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    price: {
        color: Colors.light.tint,
        fontWeight: 'bold',
    },
    title: {
        marginVertical: 5,
        fontWeight: 'bold',
    },
    quantity: {
        fontWeight: '500',
        fontSize: 18,
    },
});
