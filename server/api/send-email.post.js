export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)
    const { name, email, message, country, state } = body

    // Validate required fields
    if (!name || !email || !message || !country) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Missing required fields'
      })
    }

    // Create location string
    const location = state ? `${state}, ${country}` : country

    // Email configuration - using Nodemailer with Gmail
    const nodemailer = await import('nodemailer')
    
    // Create transporter (you'll need to set up Gmail app password)
    const transporter = nodemailer.default.createTransporter({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER || 'your-email@gmail.com',
        pass: process.env.GMAIL_APP_PASSWORD || 'your-app-password'
      }
    })

    // Email content
    const emailContent = {
      from: process.env.GMAIL_USER || 'noreply@texts.mom',
      to: 'phoyce@gmail.com',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #FF007A;">New Contact Form Submission - TextsMom</h2>
          
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Location:</strong> ${location}</p>
          </div>
          
          <div style="background: #fff; padding: 20px; border-left: 4px solid #FF007A; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Message</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${message}</p>
          </div>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; font-size: 12px;">
            <p>This message was sent from the TextsMom contact form at ${new Date().toLocaleString()}</p>
            <p>Reply directly to this email to respond to ${name} at ${email}</p>
          </div>
        </div>
      `
    }

    // Send email
    const info = await transporter.sendMail(emailContent)
    
    console.log('Email sent successfully:', info.messageId)
    
    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId
    }

  } catch (error) {
    console.error('Email sending error:', error)
    
    // Return a user-friendly error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to send email. Please try again later.'
    })
  }
})
