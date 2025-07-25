export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { text, name } = body

    if (!text && !name) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Text or name is required for moderation'
      })
    }

    // Check if OpenAI API key is configured
    const openaiApiKey = process.env.OPENAI_API_KEY
    if (!openaiApiKey) {
      console.warn('OpenAI API key not configured, skipping moderation')
      return {
        flagged: false,
        categories: {},
        message: 'Moderation skipped - API key not configured'
      }
    }

    // Combine text and name for comprehensive moderation
    const contentToModerate = [name, text].filter(Boolean).join(' ')

    // Call OpenAI Moderation API
    const response = await fetch('https://api.openai.com/v1/moderations', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openaiApiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        input: contentToModerate
      })
    })

    if (!response.ok) {
      const errorData = await response.text()
      console.error('OpenAI API error:', response.status, errorData)
      
      // Fallback to allowing content if API fails
      return {
        flagged: false,
        categories: {},
        message: 'Moderation service temporarily unavailable - content allowed'
      }
    }

    const moderationResult = await response.json()
    const result = moderationResult.results[0]

    // Return detailed moderation results
    return {
      flagged: result.flagged,
      categories: result.categories,
      categoryScores: result.category_scores,
      message: result.flagged ? 'Content flagged by moderation' : 'Content approved'
    }

  } catch (error) {
    console.error('Moderation endpoint error:', error)
    
    // Fallback to allowing content if there's an error
    return {
      flagged: false,
      categories: {},
      message: 'Moderation error - content allowed as fallback'
    }
  }
})
