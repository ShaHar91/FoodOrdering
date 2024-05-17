import { createClient } from "@supabase/supabase-js";
import { getItem } from "expo-secure-store";
import * as SecureStore from 'expo-secure-store'
import { Database } from "../database.types";

const ExpoSecureStoreAdapter = {
    getItem: (key: string) => {
        return SecureStore.getItemAsync(key)
    },
    setItem: (key: string, value: string) => {
        SecureStore.setItemAsync(key, value)
    },
    removeItem: (key: string) => {
        SecureStore.deleteItemAsync(key)
    }
}

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || ""
// It's "safe" to share this key
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON || ""

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
})