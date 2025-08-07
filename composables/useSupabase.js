import { createClient } from '@supabase/supabase-js'

// Supabase client - will be initialized in the composable
let supabase = null

// Initialize Supabase client
const initSupabase = () => {
  if (!supabase) {
    let supabaseUrl, supabaseAnonKey
    
    // Try to get from runtime config first
    try {
      const config = useRuntimeConfig()
      supabaseUrl = config.public.supabaseUrl
      supabaseAnonKey = config.public.supabaseAnonKey
    } catch (error) {
      console.log('Runtime config not available, using fallback credentials')
    }
    
    // Fallback to hardcoded credentials for development
    if (!supabaseUrl || !supabaseAnonKey) {
      supabaseUrl = 'https://dkugwkjmxkdwgihlrcsh.supabase.co'
      supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWd3a2pteGtkd2dpaGxyY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODA2MTEsImV4cCI6MjA2ODQ1NjYxMX0.4RuyeQBnX5JxnPbF37mqf6GkIsX2R04Cne-eUgjEcpY'
    }
    
    console.log('Initializing Supabase with URL:', supabaseUrl)
    supabase = createClient(supabaseUrl, supabaseAnonKey)
  }
  return supabase
}

// Export a shared client getter so all callers use the same initialized instance
export const getSupabase = () => initSupabase()

// Posts database functions
export const usePosts = () => {
  // Fetch posts with pagination
  const fetchPosts = async (page = 1, limit = 10) => {
    const client = initSupabase()
    if (!client) {
      return { posts: [], totalCount: 0, error: 'Supabase not configured' }
    }

    const from = (page - 1) * limit
    const to = from + limit - 1

    const { data, error, count } = await client
      .from('posts')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(from, to)

    if (error) {
      console.error('Error fetching posts:', error)
      return { posts: [], totalCount: 0, error }
    }

    return { 
      posts: data || [], 
      totalCount: count || 0, 
      error: null 
    }
  }

  // Add a new post
  const addPost = async (postData) => {
    const client = initSupabase()
    if (!client) {
      return { post: null, error: 'Supabase not configured' }
    }

    const { data, error } = await client
      .from('posts')
      .insert([{
        name: postData.name,
        message: postData.message,
        location: postData.location,
        created_at: new Date().toISOString()
      }])
      .select()

    if (error) {
      console.error('Error adding post:', error)
      return { post: null, error }
    }

    return { post: data[0], error: null }
  }

  // Get total posts count
  const getPostsCount = async () => {
    const client = initSupabase()
    if (!client) {
      return { count: 0, error: 'Supabase not configured' }
    }

    const { count, error } = await client
      .from('posts')
      .select('*', { count: 'exact', head: true })

    if (error) {
      console.error('Error getting posts count:', error)
      return { count: 0, error }
    }

    return { count: count || 0, error: null }
  }

  return {
    fetchPosts,
    addPost,
    getPostsCount
  }
}
