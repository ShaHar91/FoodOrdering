import { useAuth } from "@/src/providers/AuthProvider";
import { Redirect, Stack } from "expo-router";

export default function MenuStack() {
    const { session } = useAuth()

    if (session) {
        // We don't want the logged in users to be able to visit the sign-in/up screens
        return <Redirect href={'/'} />
    }

    return <Stack />
}