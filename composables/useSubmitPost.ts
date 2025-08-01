/**
 * Composable for submitting posts with auto-generated SEO fields
 * Handles the complete post submission process for texts.mom
 */

import { ref, readonly } from 'vue'
import { createClient } from '@supabase/supabase-js'
import { generateSeoFields } from '../utils/seoHelpers'

export interface PostData {
  name: string
  message: string
  location: string
}

export interface PostSubmissionResult {
  success: boolean
  error?: string
  data?: any
}

export const useSubmitPost = () => {
  // Use the same Supabase configuration as in app.vue
  const supabaseUrl = 'https://dkugwkjmxkdwgihlrcsh.supabase.co'
  const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWd3a2pteGtkd2dpaGxyY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODA2MTEsImV4cCI6MjA2ODQ1NjYxMX0.4RuyeQBnX5JxnPbF37mqf6GkIsX2R04Cne-eUgjEcpY'
  const supabase = createClient(supabaseUrl, supabaseAnonKey)
  
  const isSubmitting = ref(false)

  /**
   * Submits a new post with auto-generated SEO fields
   * @param postData - The post data (name, message, location)
   * @returns Promise with submission result
   */
  const submitPost = async (postData: PostData): Promise<PostSubmissionResult> => {
    if (isSubmitting.value) {
      return { success: false, error: 'Submission already in progress' }
    }

    isSubmitting.value = true

    try {
      // Validate required fields
      if (!postData.name?.trim() || !postData.message?.trim() || !postData.location?.trim()) {
        throw new Error('All fields are required')
      }

      // Generate SEO fields from the message
      console.log('Generating SEO fields for message:', postData.message)
      const seoFields = generateSeoFields(postData.message)
      console.log('Generated SEO fields:', seoFields)

      // Prepare the complete post object
      const postToInsert = {
        name: postData.name.trim(),
        message: postData.message.trim(),
        location: postData.location.trim(),
        slug: seoFields.slug,
        seoTitle: seoFields.seoTitle,
        seoDescription: seoFields.seoDescription,
        created_at: new Date().toISOString()
      }
      
      console.log('Complete post object to insert:', postToInsert)

      // Insert into Supabase
      const { data, error } = await supabase
        .from('posts')
        .insert([postToInsert])
        .select()

      if (error) {
        console.error('Supabase error:', error)
        throw new Error(error.message || 'Failed to submit post')
      }

      console.log('Post submitted successfully:', data)
      
      return {
        success: true,
        data: data?.[0]
      }

    } catch (error) {
      console.error('Post submission error:', error)
      
      return {
        success: false,
        error: error instanceof Error ? error.message : 'An unexpected error occurred'
      }
    } finally {
      isSubmitting.value = false
    }
  }

  return {
    submitPost,
    isSubmitting: readonly(isSubmitting)
  }
}
