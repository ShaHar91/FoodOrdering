import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Tables } from '../types';
import { Link, useSegments } from 'expo-router';
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

type OrderListItemProps = {
    order: Tables<'orders'>
}

const OrderListItem = ({ order }: OrderListItemProps) => {
    const segments = useSegments()

    return (
        // Use the "segments[0]" to get the "admin" or "user" path depending on the login credentials...
        <Link href={`${segments[0]}/orders/${order.id}`} asChild>
            <TouchableOpacity style={styles.container}>
                <View>
                    <Text style={styles.title}>Order #{order.id}</Text>
                    <Text style={styles.time}>{dayjs(order.created_at).fromNow()}</Text>
                </View>

                <Text style={styles.status}>{order.status}</Text>
            </TouchableOpacity>
        </Link>
    )
}

export default OrderListItem;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    time: {
        color: 'gray'
    },
    title: {
        marginVertical: 5,
        fontWeight: 'bold',
    },
    status: {
        fontWeight: '500',
    }
});
