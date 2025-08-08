// ~/composables/useComments.ts
import { ref } from 'vue'
import { useToast } from 'vue-toastification'
import { useSupabase } from './useSupabase.js'

export type CommentRecord = {
  id?: number
  post_id: number
  author: string
  content: string
  created_at?: string
}

export function useComments() {
  // Create a safe toast accessor that won't crash during SSR
  const getToast = () => {
    if (typeof window === 'undefined') {
      return { success: (_msg?: string) => {}, error: (_msg?: string) => {} } as any
    }
    return useToast()
  }

  // Map of post_id -> array of comments
  const comments = ref<Record<number, CommentRecord[]>>({})
  const isSubmitting = ref(false)
  const errorMessage = ref('')

  // Load all comments, grouped by post_id
  const loadAllComments = async () => {
    // Avoid SSR crashes; this is intended for client-side hydration
    if (typeof window === 'undefined') return
    const { supabase } = useSupabase()
    try {
      const { data, error } = await supabase
        .from('comments')
        .select('*')
        .order('created_at', { ascending: true })

      if (error) throw error

      const grouped = (data || []).reduce((acc, c: any) => {
        const pid = Number(c.post_id)
        if (!Number.isNaN(pid)) {
          ;(acc[pid] ||= []).push(c as CommentRecord)
        }
        return acc
      }, {} as Record<number, CommentRecord[]>)

      comments.value = grouped
    } catch (err) {
      console.error('Error loading comments', err)
    }
  }

  // Return comments array for a given post
  const getCommentsForPost = (postId: number) => {
    return comments.value[postId] || []
  }

  // Guard for disabling Post button
  const isPostDisabled = (author: string, content: string) =>
    !author?.trim() || !content?.trim() || isSubmitting.value

  // Insert a new comment with optimistic UI update
  const submitComment = async (
    postId: number,
    author: string,
    content: string
  ) => {
    if (isPostDisabled(author, content)) return

    errorMessage.value = ''
    isSubmitting.value = true

    // Prepare optimistic local record
    const pid = Number(postId)
    const optimistic: CommentRecord = {
      id: undefined,
      post_id: pid,
      author: author.trim(),
      content: content.trim(),
      created_at: new Date().toISOString(),
    }

    // Optimistically add to local state
    comments.value[pid] = [...(comments.value[pid] || []), optimistic]

    try {
      if (typeof window === 'undefined') throw new Error('Cannot submit on server')
      const { supabase } = useSupabase()
      // Prefer not to select-after-insert to avoid RLS issues; rely on optimistic update
      const { error } = await supabase
        .from('comments')
        .insert([
          {
            post_id: pid,
            author: optimistic.author,
            content: optimistic.content,
            // Write both fields to satisfy schemas where comment_text is NOT NULL
            comment_text: optimistic.content,
          },
        ])

      if (error) throw error

      // Optionally, you could refresh just this post's comments here if desired
      // but to reduce load, we keep the optimistic item.
      getToast().success('Comment posted!')
    } catch (err: any) {
      console.error('Failed to post comment', err)
      errorMessage.value = err?.message || 'Failed to post comment.'

      // Roll back optimistic update on failure
      comments.value[pid] = (comments.value[pid] || []).filter((c) => c !== optimistic)
      getToast().error(errorMessage.value)
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    comments,
    loadAllComments,
    getCommentsForPost,
    submitComment,
    isSubmitting,
    isPostDisabled,
    errorMessage,
  }
}
