import { PropsWithChildren, useEffect, useRef, useState } from "react";
import { registerForPushNotificationsAsync } from "../lib/notifications";
import { ExpoPushToken } from "expo-notifications";
import * as Notifications from 'expo-notifications'
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthProvider";

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false
    })
})

const NotificationProvider = ({ children }: PropsWithChildren) => {
    const { profile } = useAuth()

    const [expoPushToken, setExpoPushToken] = useState<string>()
    const [notification, setNotification] = useState<Notifications.Notification>()
    const notificationListener = useRef<Notifications.Subscription>()
    const responseListener = useRef<Notifications.Subscription>()

    const savePushToken = async (newToken: string | undefined) => {
        setExpoPushToken(newToken)
        if (!newToken) return

        // Update the token in the database
        await supabase.from('profiles').update({ expo_push_token: newToken }).eq('id', profile.id)
    }

    useEffect(() => {
        registerForPushNotificationsAsync().then((token) =>
            savePushToken(token)
        )

        notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
            setNotification(notification)
        })

        responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
            console.log(response)
        })

        return () => {
            if (notificationListener.current) {
                Notifications.removeNotificationSubscription(notificationListener.current)
            }

            if (responseListener.current) {
                Notifications.removeNotificationSubscription(responseListener.current)
            }
        }
    }, [])

    console.log('pushe token: ', expoPushToken)
    console.log("notif: ", notification)


    return (
        <>
            {children}
        </>
    )
}

export default NotificationProvider