import { PropsWithChildren, createContext, useContext, useEffect, useState } from "react"
import { supabase } from "../lib/supabase"
import { Session } from "@supabase/supabase-js"
import { Profile } from "../types"
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'


const client = new QueryClient();

export default function QueryProvider({ children }: PropsWithChildren) {
    return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}