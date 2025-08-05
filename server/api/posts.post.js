import { createClient } from '@supabase/supabase-js';

// Define the event handler for the API route
export default defineEventHandler(async (event) => {
  // Read the body of the request
  const body = await readBody(event);

  // Initialize Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // Insert the post directly with 'approved' status
  const { data: post, error: insertError } = await supabase
    .from('posts')
    .insert({
      ...body,
      status: 'approved', // Set status directly to approved
      created_at: new Date().toISOString(),
    })
    .select()
    .single();

  if (insertError) {
    console.error('Error inserting post:', insertError);
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to submit post.',
    });
  }

  // Return success to the user
  return { success: true, post };
});
