import { createClient } from '@supabase/supabase-js'
import { useRuntimeConfig } from '#imports'

let supabaseClient = null

// Shared Supabase client via Nuxt state (singleton)
export const useSupabase = () => {
  const config = useRuntimeConfig()
  const url = config.public?.supabaseUrl
  const anonKey = config.public?.supabaseAnonKey

  if (!url || !anonKey) {
    console.warn('[useSupabase] Missing supabaseUrl or supabaseAnonKey in runtimeConfig.public')
  }

  if (!supabaseClient) {
    supabaseClient = createClient(url, anonKey)
  }

  return { supabase: supabaseClient }
}

export default useSupabase
