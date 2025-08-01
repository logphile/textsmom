// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      supabaseUrl: process.env.SUPABASE_URL || '',
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY || ''
    }
  },
  app: {
    head: {
      htmlAttrs: {
        lang: 'en'
      },

      link: [
        // Preload Bebas Neue
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/BebasNeue-Regular.woff2',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        // Preload Nunito
        {
          rel: 'preload',
          as: 'font',
          href: '/fonts/Nunito-Regular.woff2',
          type: 'font/woff2',
          crossorigin: 'anonymous'
        },
        {
          rel: 'apple-touch-icon',
          sizes: '180x180',
          href: '/apple-touch-icon.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '32x32',
          href: '/favicon-32x32.png'
        },
        {
          rel: 'icon',
          type: 'image/png',
          sizes: '16x16',
          href: '/favicon-16x16.png'
        },
        {
          rel: 'manifest',
          href: '/site.webmanifest'
        }
      ]
    }
  }
})
