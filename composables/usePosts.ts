// ~/composables/usePosts.ts
import { ref } from 'vue'
import { useSupabase } from './useSupabase.js'

export type PostRecord = Record<string, any>

export function usePosts() {
  const posts = ref<PostRecord[]>([])
  const isLoading = ref(false)
  const totalPostsCount = ref(0)

  // Load recent posts with a safe paginated query, then simple fallback
  const loadPosts = async () => {
    // Ensure we only attempt to use Supabase on the client. Nuxt already calls
    // this from onMounted in app.vue, but this extra guard keeps the composable
    // SSR-safe if invoked elsewhere.
    if (typeof window === 'undefined') {
      return
    }

    const { supabase } = useSupabase()
    isLoading.value = true
    try {
      // Paginated attempt
      const pageSize = 50
      const from = 0
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error || !data || data.length === 0) {
        // Fallback simple select (covers count limitations or RLS quirks)
        const { data: dataAll, error: errAll } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (errAll) {
          console.error('Error loading posts (simple):', errAll)
          posts.value = []
          totalPostsCount.value = 0
          return
        }
        posts.value = dataAll || []
        totalPostsCount.value = dataAll?.length || 0
        return
      }

      posts.value = data || []
      totalPostsCount.value = count || 0
    } catch (err) {
      console.error('Error loading posts (exception):', err)
      posts.value = []
      totalPostsCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  return { posts, isLoading, totalPostsCount, loadPosts }
}
