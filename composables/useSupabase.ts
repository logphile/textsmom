import { createClient, type SupabaseClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

let supabaseClient: SupabaseClient | null = null

// Shared Supabase client (singleton per server/client instance)
export const useSupabase = (): { supabase: SupabaseClient } => {
  const config = useRuntimeConfig()
  const url = config.public.supabaseUrl
  const anonKey = config.public.supabaseAnonKey

  if (!url || !anonKey) {
    console.warn('[useSupabase] Missing supabaseUrl or supabaseAnonKey in runtimeConfig.public')
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url as string, anonKey as string)
  }

  return { supabase: supabaseClient }
}

export default useSupabase
