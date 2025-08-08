// ~/composables/usePosts.ts
import { ref } from 'vue'
import { useSupabase } from './useSupabase.js'

export type PostRecord = Record<string, any>

export function usePosts() {
  const posts = ref<PostRecord[]>([])
  const isLoading = ref(false)
  const totalPostsCount = ref(0)

  // Load recent posts with a safe paginated query, then simple fallback
  const loadPosts = async (opts?: { from?: number; size?: number; disableFallback?: boolean }) => {
    // Ensure we only attempt to use Supabase on the client. Nuxt already calls
    // this from onMounted in app.vue, but this extra guard keeps the composable
    // SSR-safe if invoked elsewhere.
    if (typeof window === 'undefined' || (typeof import.meta !== 'undefined' && (import.meta as any).server)) {
      // Running on server during SSR. Skip DB calls to keep SSR safe.
      if (process?.env?.NITRO_LOG_LEVEL === 'debug') {
        console.warn('[usePosts] loadPosts skipped on server (SSR)')
      }
      return
    }

    const { supabase } = useSupabase()
    isLoading.value = true
    try {
      // Paginated attempt
      const pageSize = Math.max(1, Math.min(200, opts?.size ?? 50))
      const from = Math.max(0, opts?.from ?? 0)
      const to = from + pageSize - 1

      const { data, error, count } = await supabase
        .from('posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to)

      if (error || !data || data.length === 0) {
        // Fallback simple select (covers count limitations or RLS quirks)
        if (opts?.disableFallback) {
          if (error) console.error('[usePosts] error loading posts (paged):', error)
          posts.value = data || []
          totalPostsCount.value = count || (data?.length ?? 0)
          return
        }

        const { data: dataAll, error: errAll } = await supabase
          .from('posts')
          .select('*')
          .order('created_at', { ascending: false })

        if (errAll) {
          console.error('[usePosts] Error loading posts (simple fallback):', errAll)
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
    } catch (err: any) {
      console.error('[usePosts] Error loading posts (exception):', err?.message || err)
      posts.value = []
      totalPostsCount.value = 0
    } finally {
      isLoading.value = false
    }
  }

  return { posts, isLoading, totalPostsCount, loadPosts }
}
