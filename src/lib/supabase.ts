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

const supabaseUrl = "https://vkltfzigdgqyfrxkgenx.supabase.co"
// It's "safe" to share this key
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZrbHRmemlnZGdxeWZyeGtnZW54Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTU2Nzg1MTMsImV4cCI6MjAzMTI1NDUxM30.PUsCZqjg52pgUp45FddII1GmazoM5ZSkTsIeJZ4Br3o"

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: ExpoSecureStoreAdapter as any,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false
    }
})