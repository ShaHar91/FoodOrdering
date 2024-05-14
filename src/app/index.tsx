import { Link, Redirect } from "expo-router"
import { View } from "react-native"
import Button from "../components/Button"
import { useAuth } from "../providers/AuthProvider"
import { ActivityIndicator } from "react-native"
import { supabase } from "../lib/supabase"

const index = () => {
    const { session, loading, isAdmin } = useAuth()

    if (loading) {
        return <ActivityIndicator />
    }

    if (!session) {
        return <Redirect href={'/sign-in'} />
    }

    if (!isAdmin) {
        return <Redirect href={'/(user)'} />
    }

    // When logged in as an admin, they may want to see the app as a user, so leave this UI as is
    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 10 }}>
            <Link href={'/(user)'} asChild>
                <Button text="User" />
            </Link>
            <Link href={'/(admin)'} asChild>
                <Button text="Admin" />
            </Link>

            <Button text="Sign out" onPress={() => supabase.auth.signOut()} />
        </View>
    )
}

export default index