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

    // Custom thresholds for more lenient moderation (higher = more strict)
    const customThresholds = {
      'hate': 0.8,           // Very high threshold for hate speech
      'hate/threatening': 0.9, // Very high threshold for threatening hate
      'harassment': 0.95,     // Almost never flag harassment (mom texts are confusing!)
      'harassment/threatening': 0.8, // High threshold for threatening harassment
      'self-harm': 0.7,      // Moderate threshold for self-harm
      'self-harm/intent': 0.8, // High threshold for self-harm intent
      'self-harm/instructions': 0.9, // Very high threshold for self-harm instructions
      'sexual': 0.9,         // Very high threshold for sexual content
      'sexual/minors': 0.5,  // Keep strict for minors
      'violence': 0.8,       // High threshold for violence
      'violence/graphic': 0.9 // Very high threshold for graphic violence
    }

    // Check if any category exceeds our custom thresholds
    let customFlagged = false
    const flaggedCategories = {}
    const scores = result.category_scores

    for (const [category, threshold] of Object.entries(customThresholds)) {
      if (scores[category] && scores[category] > threshold) {
        customFlagged = true
        flaggedCategories[category] = true
      }
    }

    // Special handling for typical "mom text" patterns
    const contentLower = contentToModerate.toLowerCase()
    const momTextPatterns = [
      'why are you',
      'just tell me',
      'you know',
      'your uncle',
      'your aunt',
      'your cousin',
      'deacon',
      'church',
      'family',
      'mom',
      'mother',
      'dad',
      'father'
    ]

    // If content contains mom text patterns and was only flagged for harassment, allow it
    const containsMomPattern = momTextPatterns.some(pattern => contentLower.includes(pattern))
    if (containsMomPattern && customFlagged && Object.keys(flaggedCategories).length === 1 && flaggedCategories['harassment']) {
      customFlagged = false
      delete flaggedCategories['harassment']
    }

    // Return detailed moderation results with custom logic
    return {
      flagged: customFlagged,
      categories: flaggedCategories,
      categoryScores: result.category_scores,
      originallyFlagged: result.flagged,
      message: customFlagged ? 'Content flagged by custom moderation' : 'Content approved'
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
