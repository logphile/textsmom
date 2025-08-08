import { createClient } from '@supabase/supabase-js'

// Define the event handler for the API route
export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  // Prefer runtime config when available, fallback to process.env
  let runtimeConfig
  try {
    // useRuntimeConfig is available in Nitro handlers
    // @ts-ignore
    runtimeConfig = useRuntimeConfig(event)
  } catch {}

  const SUPABASE_URL = (runtimeConfig?.supabaseUrl || runtimeConfig?.public?.supabaseUrl || process.env.SUPABASE_URL || '').trim()
  const SUPABASE_SERVICE_ROLE_KEY = (runtimeConfig?.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || '').trim()

  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    console.error('[api/posts] Missing Supabase env:', {
      hasUrl: !!SUPABASE_URL,
      hasServiceKey: !!SUPABASE_SERVICE_ROLE_KEY
    })
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit post.',
      message: 'Supabase configuration missing. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.'
    })
  }

  const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

  try {
    // Insert the post; if you intend optimistic flow, set status: 'pending'
    const { data, error } = await supabase
      .from('posts')
      .insert([{ 
        ...body,
        // status: 'pending', // enable if using background moderation
        status: 'approved',
        created_at: new Date().toISOString()
      }])
      .select('*')
      .single()

    if (error) {
      console.error('[api/posts] Insert error:', error)
      throw createError({ statusCode: 500, statusMessage: 'Failed to submit post.' })
    }

    return { success: true, post: data }
  } catch (err) {
    // Common cause: network issues ("fetch failed") or invalid URL
    console.error('[api/posts] Unexpected error:', err)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit post.',
      message: err?.message || 'Unexpected error while contacting Supabase.'
    })
  }
})
