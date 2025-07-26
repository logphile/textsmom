import nodemailer from 'nodemailer'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { postId, postContent, postAuthor, postLocation, reportReason, reporterInfo } = body

    // Validate required fields
    if (!postId || !postContent || !reportReason) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Create transporter using Gmail
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
      }
    })

    // Email content for report notification
    const emailContent = {
      from: process.env.GMAIL_USER || 'noreply@texts.mom',
      to: 'phoyce@gmail.com',
      subject: `🚨 Post Reported - TextsMom Moderation Alert`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF6B6B; border-bottom: 3px solid #FF6B6B; padding-bottom: 10px;">
            🚨 Post Reported - Moderation Required
          </h2>
          
          <div style="background: #fff3cd; padding: 20px; border-left: 4px solid #FF6B6B; margin: 20px 0; border-radius: 4px;">
            <h3 style="color: #856404; margin-top: 0;">Report Details</h3>
            <p><strong>Post ID:</strong> ${postId}</p>
            <p><strong>Report Reason:</strong> <span style="color: #FF6B6B; font-weight: bold;">${reportReason}</span></p>
            <p><strong>Reported At:</strong> ${new Date().toLocaleString()}</p>
          </div>
          
          <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Post Information</h3>
            <p><strong>Author:</strong> ${postAuthor || 'Unknown'}</p>
            <p><strong>Location:</strong> ${postLocation || 'Not specified'}</p>
            <div style="background: white; padding: 15px; border-radius: 4px; border-left: 4px solid #FF007A; margin-top: 15px;">
              <h4 style="color: #333; margin-top: 0;">Post Content:</h4>
              <p style="line-height: 1.6; white-space: pre-wrap; font-style: italic;">"${postContent}"</p>
            </div>
          </div>
          
          <div style="background: #d1ecf1; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #0c5460; margin-top: 0;">Next Steps</h3>
            <ul style="color: #0c5460;">
              <li>Review the reported post content</li>
              <li>Determine if it violates community guidelines</li>
              <li>Take appropriate action (remove, warn, or dismiss)</li>
              <li>Consider updating moderation filters if needed</li>
            </ul>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This is an automated moderation alert from TextsMom</p>
            <p>Report submitted at ${new Date().toLocaleString()}</p>
            <p>Please review and take appropriate action promptly</p>
          </div>
        </div>
      `
    }

    // Send email
    const info = await transporter.sendMail(emailContent)
    
    console.log('Report notification email sent successfully:', info.messageId)
    
    return {
      success: true,
      message: 'Report notification sent successfully',
      messageId: info.messageId
    }

  } catch (error) {
    console.error('Error sending report notification:', error)
    
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send report notification'
    })
  }
})
