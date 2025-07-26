<template>
  <div class="site-container">
    <NuxtRouteAnnouncer />
    <header class="site-header">
      <NuxtLink to="/" class="site-name-link">
        <div class="site-name">
          <span class="texts">texts</span><span class="dot">.</span><span class="mom">mom</span>
        </div>
      </NuxtLink>
      
      <!-- Desktop Navigation -->
      <nav class="site-nav desktop-nav">
        <NuxtLink to="/post" class="nav-link nav-link-post">POST!</NuxtLink>
        <NuxtLink to="/about" class="nav-link">ABOUT</NuxtLink>
        <NuxtLink to="/contact" class="nav-link">CONTACT</NuxtLink>
      </nav>
      
      <!-- Mobile Hamburger Menu -->
      <div class="mobile-nav">
        <button @click="toggleMobileMenu" class="hamburger-btn" :class="{ 'active': showMobileMenu }">
          <span></span>
          <span></span>
          <span></span>
        </button>
        
        <!-- Mobile menu backdrop -->
        <div class="mobile-backdrop" :class="{ 'active': showMobileMenu }" @click="closeMobileMenu"></div>
        
        <nav class="mobile-menu" :class="{ 'active': showMobileMenu }">
          <NuxtLink to="/post" class="mobile-nav-link" @click="closeMobileMenu">POST!</NuxtLink>
          <NuxtLink to="/about" class="mobile-nav-link" @click="closeMobileMenu">ABOUT</NuxtLink>
          <NuxtLink to="/contact" class="mobile-nav-link" @click="closeMobileMenu">CONTACT</NuxtLink>
        </nav>
      </div>
    </header>
    <main v-if="$route.path === '/post'">
      <hr class="site-hr">
      <div class="post-form-container">
        <h1 class="post-title">DROP THE TEXT<span class="green-period">.</span> CLEANSE YOUR SOUL<span class="green-period">.</span></h1>
        <form class="post-form" @submit.prevent="submitPost">
          <div class="form-group">
            <label for="name" class="form-label">NAME</label>
            <input 
              type="text" 
              id="name" 
              v-model="form.name" 
              class="form-input"
              placeholder="Your name, not your mom's..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="text" class="form-label">TEXT</label>
            <textarea 
              id="text" 
              v-model="form.text" 
              class="form-textarea" 
              rows="6"
              maxlength="280"
              placeholder="Share the mom text that made you laugh, cry, or question reality..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="country" class="form-label">COUNTRY</label>
            <select 
              id="country" 
              v-model="form.country" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a country</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
          
          <div v-if="form.country === 'United States'" class="form-group">
            <label for="state" class="form-label">STATE</label>
            <select 
              id="state" 
              v-model="form.state" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a state</option>
              <option v-for="state in usStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>
          
          <button type="submit" class="submit-btn">SUBMIT</button>
        </form>
      </div>
    </main>
    <main v-else-if="$route.path === '/contact'">
      <hr class="site-hr">
      <div class="post-form-container">
        <h1 class="post-title">GET IN TOUCH<span class="green-period">.</span> WE'RE LISTENING<span class="green-period">.</span></h1>
        <form class="post-form" @submit.prevent="submitContact">
          <div class="form-group">
            <label for="contact-name" class="form-label">NAME</label>
            <input 
              type="text" 
              id="contact-name" 
              v-model="contactForm.name" 
              class="form-input"
              placeholder="Your actual name this time..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="contact-email" class="form-label">EMAIL</label>
            <input 
              type="email" 
              id="contact-email" 
              v-model="contactForm.email" 
              class="form-input"
              placeholder="We promise not to spam you with mom jokes..."
              required
            />
          </div>
          
          <div class="form-group">
            <label for="contact-message" class="form-label">MESSAGE</label>
            <textarea 
              id="contact-message" 
              v-model="contactForm.message" 
              class="form-textarea" 
              rows="6"
              placeholder="Tell us what's on your mind. Complaints about your mom are welcome..."
              required
            ></textarea>
          </div>
          
          <div class="form-group">
            <label for="contact-country" class="form-label">COUNTRY</label>
            <select 
              id="contact-country" 
              v-model="contactForm.country" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a country</option>
              <option v-for="country in countries" :key="country" :value="country">
                {{ country }}
              </option>
            </select>
          </div>
          
          <div v-if="contactForm.country === 'United States'" class="form-group">
            <label for="contact-state" class="form-label">STATE</label>
            <select 
              id="contact-state" 
              v-model="contactForm.state" 
              class="form-select" 
              required
            >
              <option value="" disabled>Select a state</option>
              <option v-for="state in usStates" :key="state" :value="state">
                {{ state }}
              </option>
            </select>
          </div>
          
          <button type="submit" class="submit-btn">SEND MESSAGE</button>
        </form>
      </div>
    </main>
    <main v-else-if="$route.path === '/about'">
      <hr class="site-hr">
      <div class="about-container">
        <h1 class="about-title">She typed it<span class="green-period">.</span> You read it<span class="green-period">.</span> We all suffer together<span class="green-period">.</span></h1>
        
        <div class="about-content">
          <p>She means well<span class="green-period">.</span> She really does<span class="green-period">.</span></p>
          <p>But somewhere between the missed punctuation, the all-caps threats, the cryptic emojis, and the "who is this" follow-ups… something unravels<span class="green-period">.</span></p>
          
          <p>texts<span class="green-period">.</span>mom is a shrine to the glorious dysfunction of modern motherhood—one, unhinged message at a time<span class="green-period">.</span></p>
          <p>We don't judge<span class="green-period">.</span> Okay, maybe a little<span class="green-period">.</span> We just document<span class="green-period">.</span></p>
          <p>Whether it's passive-aggressive guilt, baffling autocorrects, or love disguised as psychological warfare, if she texted it—you can post it<span class="green-period">.</span></p>
          
          <p class="about-final">You're not alone<span class="green-period">.</span> Your mom just texts like this<span class="green-period">.</span></p>
        </div>
      </div>
    </main>
    <main v-else>
      <hr class="site-hr">
      <h1 class="sr-only">TextsMom - Share Your Unhinged Mom Texts</h1>
      <div class="main-blurb">
        <div class="fade-word fade-word-1">UNHINGED<span class="green-period">.</span></div>
        <div class="fade-word fade-word-2">DERANGED<span class="green-period">.</span></div>
        <div class="fade-word fade-word-3">CONFUSING<span class="green-period">.</span></div>
      </div>
      <div class="main-blurb2">
      You know a <span class="blurb2">mom</span> text when you see one<span class="green-period">.</span>
      </div>
      <hr class="site-hr2">
      <div class="main-postit">
        <div class="postit2"><span class="green-notice">NOTICE:</span> Every 60 seconds, over 2 million texts are sent by... mothers... all over the world. If you get a mom text, stay calm and immediately share it here.</div>        
      </div>
      
      <!-- Posts Section -->
      <div v-if="posts.length > 0" class="posts-section">
        <hr class="site-hr">
        <div class="feed-title-container">
          <div class="feed-title-main">
            <span class="live-indicator">● LIVE</span>
            <span class="feed-title-text">FRESH TEXTS</span>
            <span class="mom-text-highlight">FROM MOMS</span>
          </div>
          <div class="feed-subtitle">Real texts<span class="green-period">.</span> Real chaos<span class="green-period">.</span> Real moms<span class="green-period">.</span></div>
        </div>
        
        <!-- Search and Filter Bar -->
        <div class="search-filter-bar">
          <div class="search-container">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search texts..."
              class="search-input"
              @input="filterPosts"
            >
            <span class="search-icon">🔍</span>
          </div>
          
          <div class="filter-container">
            <select v-model="filterOption" @change="filterPosts" class="filter-select">
              <option value="all">All Posts</option>
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="most-liked">Most Liked</option>
              <option value="most-disliked">Most Controversial</option>
            </select>
          </div>
        </div>
        
        <div class="posts-container">
          <div v-for="post in paginatedPosts" :key="post.id" class="post-card">
            <div class="post-header">
              <span class="post-author">{{ post.name }}</span>
              <span class="post-location">{{ post.location }}</span>
            </div>
            <div class="post-content">{{ post.message }}</div>
            <div class="post-footer">
              <div class="post-timestamp">{{ formatDate(post.created_at) }}</div>
              <div class="post-voting">
                <button 
                  @click="voteOnPost(post.id, 'up')"
                  :class="['vote-btn', 'vote-up', { 'voted': hasUserVoted(post.id, 'up') }]"
                  :disabled="isVoting"
                >
                  👍 <span class="vote-count">{{ post.likes || 0 }}</span>
                </button>
                <button 
                  @click="voteOnPost(post.id, 'down')"
                  :class="['vote-btn', 'vote-down', { 'voted': hasUserVoted(post.id, 'down') }]"
                  :disabled="isVoting"
                >
                  👎 <span class="vote-count">{{ post.dislikes || 0 }}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Pagination Controls -->
        <div v-if="totalPages > 1" class="pagination">
          <button 
            @click="previousPage" 
            :disabled="currentPage === 1" 
            class="pagination-btn pagination-prev"
          >
            ← PREVIOUS
          </button>
          
          <div class="pagination-info">
            <span class="page-indicator">{{ currentPage }} of {{ totalPages }}</span>
          </div>
          
          <button 
            @click="nextPage" 
            :disabled="currentPage === totalPages" 
            class="pagination-btn pagination-next"
          >
            NEXT →
          </button>
        </div>
      </div>
    </main>
    <footer class="site-footer">
      <div class="copyright">
        2025 texts.mom - All rights reserved
      </div>
    </footer>
    
    <!-- Success Modal -->
    <div v-if="showSuccessModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="success-icon">✓</div>
          <h2 class="modal-title">TEXT SUBMITTED<span class="green-period">!</span></h2>
        </div>
        <div class="modal-body">
          <p class="modal-message">Thank you for sharing your mom text! It has been posted and is now live on the homepage.</p>
          <p class="modal-submessage">Your contribution helps others laugh, cry, and question reality together.</p>
        </div>
        <div class="modal-actions">
          <button @click="viewHomepage" class="modal-btn modal-btn-primary">VIEW ON HOMEPAGE</button>
          <button @click="closeModal" class="modal-btn modal-btn-secondary">SUBMIT ANOTHER</button>
        </div>
      </div>
    </div>
    
    <!-- Profanity Filter Modal -->
    <div v-if="showProfanityModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="warning-icon">🚫</div>
          <h2 class="modal-title">CONTENT FILTERED<span class="green-period">!</span></h2>
        </div>
        <div class="modal-body">
          <p class="modal-message" v-if="profanityModalType === 'name'">Your mom says a lot of things but she didn't name you that. Keep your name clean and family-friendly.</p>
          <p class="modal-message" v-else>Your mom text contains inappropriate language. We were shocked too.</p>
          <p class="modal-submessage" v-if="profanityModalType === 'name'">We want to maintain a positive community for everyone.</p>
          <p class="modal-submessage" v-else>We know mom texts can be wild, but let's keep the language clean!</p>
        </div>
        <div class="modal-actions">
          <button @click="closeModal" class="modal-btn modal-btn-primary">GOT IT</button>
        </div>
      </div>
    </div>
    
    <!-- Rate Limit Modal -->
    <div v-if="showRateLimitModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="warning-icon">⏰</div>
          <h2 class="modal-title">WHOA! SLOW DOWN THERE!<span class="green-period">!</span></h2>
        </div>
        <div class="modal-body">
          <p class="modal-message">You can submit another post in {{ rateLimitRemainingTime }} seconds.</p>
          <p class="modal-submessage">This helps prevent spam and keeps the quality high.</p>
        </div>
        <div class="modal-actions">
          <button @click="closeModal" class="modal-btn modal-btn-primary">UNDERSTOOD</button>
        </div>
      </div>
    </div>
    
    <!-- OpenAI Moderation Modal -->
    <div v-if="showModerationModal" class="modal-overlay" @click="closeModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <div class="warning-icon">🤖</div>
          <h2 class="modal-title">CONTENT FLAGGED<span class="green-period">!</span></h2>
        </div>
        <div class="modal-body">
          <p class="modal-message">Our AI moderation system has flagged your content.</p>
          <p class="modal-submessage">Detected: <strong>{{ moderationViolationType }}</strong></p>
          <p class="modal-submessage">Please revise your message to comply with our community guidelines.</p>
        </div>
        <div class="modal-actions">
          <button @click="closeModal" class="modal-btn modal-btn-primary">REVISE CONTENT</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { createClient } from '@supabase/supabase-js'

// Dynamic page titles for SEO
const route = useRoute()
const getPageTitle = () => {
  switch (route.path) {
    case '/':
      return 'TextsMom - Share Your Unhinged Mom Texts | Funny Mom Messages'
    case '/post':
      return 'Submit Your Mom Text - Share Funny Mom Messages | TextsMom'
    case '/contact':
      return 'Contact Us - Get in Touch | TextsMom'
    case '/about':
      return 'About TextsMom - The Home of Unhinged Mom Texts'
    default:
      return 'TextsMom - Share Your Unhinged Mom Texts'
  }
}

// Set dynamic page title and meta description
useHead({
  title: computed(() => getPageTitle()),
  meta: [
    {
      name: 'description',
      content: computed(() => {
        switch (route.path) {
          case '/':
            return 'Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world. Join our community of mom text survivors.'
          case '/post':
            return 'Submit your funny, confusing, or unhinged mom text messages to share with our community. Help others laugh and feel less alone.'
          case '/contact':
            return 'Get in touch with the TextsMom team. We welcome feedback, suggestions, and your mom text horror stories.'
          case '/about':
            return 'Learn about TextsMom, the community dedicated to sharing and celebrating the glorious dysfunction of modern motherhood through text messages.'
          default:
            return 'TextsMom - The home of unhinged mom texts from around the world.'
        }
      })
    },
    { property: 'og:title', content: computed(() => getPageTitle()) },
    { property: 'og:description', content: computed(() => {
        switch (route.path) {
          case '/':
            return 'Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world.'
          case '/post':
            return 'Submit your funny, confusing, or unhinged mom text messages to share with our community.'
          case '/contact':
            return 'Get in touch with the TextsMom team. We welcome feedback and suggestions.'
          case '/about':
            return 'Learn about TextsMom, the community dedicated to sharing the glorious dysfunction of modern motherhood.'
          default:
            return 'TextsMom - The home of unhinged mom texts from around the world.'
        }
      })
    },
    { property: 'og:type', content: 'website' },
    { property: 'og:url', content: computed(() => `https://texts.mom${route.path}`) },
    { property: 'og:site_name', content: 'TextsMom' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:site', content: '@textsmom' },
    { name: 'keywords', content: 'mom texts, funny mom messages, unhinged texts, family humor, text messages, mom jokes, parenting humor' },
    { name: 'author', content: 'TextsMom' },
    { name: 'robots', content: 'index, follow' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { 'http-equiv': 'X-UA-Compatible', content: 'IE=edge' },
    { name: 'theme-color', content: '#FF007A' },
    { name: 'msapplication-TileColor', content: '#FF007A' },
    { name: 'application-name', content: 'TextsMom' },
    { name: 'apple-mobile-web-app-title', content: 'TextsMom' },
    { name: 'apple-mobile-web-app-capable', content: 'yes' },
    { name: 'apple-mobile-web-app-status-bar-style', content: 'default' },
    { name: 'format-detection', content: 'telephone=no' },
    { name: 'generator', content: 'Nuxt.js' }
  ],
  link: [
    { rel: 'canonical', href: computed(() => `https://texts.mom${route.path}`) }
  ],
  script: [
    {
      type: 'application/ld+json',
      children: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@graph': [
          {
            '@type': 'WebSite',
            '@id': 'https://texts.mom/#website',
            'url': 'https://texts.mom/',
            'name': 'TextsMom',
            'description': 'Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world.',
            'potentialAction': {
              '@type': 'SearchAction',
              'target': 'https://texts.mom/?s={search_term_string}',
              'query-input': 'required name=search_term_string'
            }
          },
          {
            '@type': 'Organization',
            '@id': 'https://texts.mom/#organization',
            'name': 'TextsMom',
            'url': 'https://texts.mom/',
            'description': 'A community platform for sharing funny, unhinged, and confusing text messages from mothers.',
            'sameAs': [
              'https://twitter.com/textsmom',
              'https://facebook.com/textsmom'
            ]
          },
          {
            '@type': 'WebPage',
            '@id': `https://texts.mom${route.path}#webpage`,
            'url': `https://texts.mom${route.path}`,
            'name': getPageTitle(),
            'description': (() => {
              switch (route.path) {
                case '/':
                  return 'Share and discover the most unhinged, confusing, and hilarious text messages from moms around the world.'
                case '/post':
                  return 'Submit your funny, confusing, or unhinged mom text messages to share with our community.'
                case '/contact':
                  return 'Get in touch with the TextsMom team. We welcome feedback and suggestions.'
                case '/about':
                  return 'Learn about TextsMom, the community dedicated to sharing the glorious dysfunction of modern motherhood.'
                default:
                  return 'TextsMom - The home of unhinged mom texts from around the world.'
              }
            })(),
            'isPartOf': {
              '@id': 'https://texts.mom/#website'
            },
            'about': {
              '@id': 'https://texts.mom/#organization'
            }
          }
        ]
      }))
    },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-F7NW6VS4H4',
      async: true
    },
    {
      children: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-F7NW6VS4H4', {
          page_title: document.title,
          page_location: window.location.href
        });
      `
    }
  ]
})

// Supabase configuration
const supabaseUrl = 'https://dkugwkjmxkdwgihlrcsh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWd3a2pteGtkd2dpaGxyY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODA2MTEsImV4cCI6MjA2ODQ1NjYxMX0.4RuyeQBnX5JxnPbF37mqf6GkIsX2R04Cne-eUgjEcpY'
const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Supabase functions
const addPost = async (postData) => {
  const { data, error } = await supabase
    .from('posts')
    .insert([{
      name: postData.name,
      message: postData.message,
      location: postData.location,
      created_at: new Date().toISOString()
    }])
    .select()

  if (error) {
    console.error('Error adding post:', error)
    return { post: null, error }
  }

  return { post: data[0], error: null }
}

const fetchPosts = async (page = 1, limit = 10) => {
  const from = (page - 1) * limit
  const to = from + limit - 1

  const { data, error, count } = await supabase
    .from('posts')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to)

  if (error) {
    console.error('Error fetching posts:', error)
    return { posts: [], totalCount: 0, error }
  }

  return { 
    posts: data || [], 
    totalCount: count || 0, 
    error: null 
  }
}

const form = ref({
  name: '',
  text: '',
  country: '',
  state: ''
})

const contactForm = ref({
  name: '',
  email: '',
  message: '',
  country: '',
  state: ''
})

// Posts data from Supabase
const posts = ref([])
const isLoading = ref(false)
const totalPostsCount = ref(0)
const showSuccessModal = ref(false)
const showProfanityModal = ref(false)
const showRateLimitModal = ref(false)
const showModerationModal = ref(false)
const rateLimitRemainingTime = ref(0)
const profanityModalType = ref('') // 'name' or 'text'
const moderationViolationType = ref('') // OpenAI flagged categories

// Voting functionality
const isVoting = ref(false)
const userVotes = ref(new Map()) // Track user votes locally

// Mobile menu functionality
const showMobileMenu = ref(false)

const toggleMobileMenu = () => {
  showMobileMenu.value = !showMobileMenu.value
}

const closeMobileMenu = () => {
  showMobileMenu.value = false
}

// Search and filter functionality
const searchQuery = ref('')
const filterOption = ref('all')
const filteredPosts = ref([])

const filterPosts = () => {
  let filtered = [...posts.value]
  
  // Apply search filter
  if (searchQuery.value.trim()) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(post => 
      post.name.toLowerCase().includes(query) ||
      post.message.toLowerCase().includes(query) ||
      post.location.toLowerCase().includes(query)
    )
  }
  
  // Apply sort filter
  switch (filterOption.value) {
    case 'newest':
      filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      break
    case 'oldest':
      filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
      break
    case 'most-liked':
      filtered.sort((a, b) => (b.likes || 0) - (a.likes || 0))
      break
    case 'most-disliked':
      filtered.sort((a, b) => (b.dislikes || 0) - (a.dislikes || 0))
      break
    default:
      // 'all' - keep original order
      break
  }
  
  filteredPosts.value = filtered
  currentPage.value = 1 // Reset to first page when filtering
}

// Initialize filtered posts when posts are loaded
watch(posts, (newPosts) => {
  if (newPosts.length > 0 && filteredPosts.value.length === 0) {
    filteredPosts.value = [...newPosts]
  }
}, { immediate: true })

// Phase 1 Moderation: Rate limiting and profanity filter
const isSubmitting = ref(false)
const lastSubmissionTime = ref(0)
const RATE_LIMIT_SECONDS = 30

// Basic profanity word list for client-side filtering
const profanityWords = [
  'fuck', 'faggot', 'nigger', 'kill', 'die', 'suicide'
]

// Function to check for profanity
const containsProfanity = (text) => {
  const lowerText = text.toLowerCase()
  return profanityWords.some(word => {
    // Check for exact word matches with word boundaries
    const regex = new RegExp(`\\b${word}\\b`, 'i')
    return regex.test(lowerText)
  })
}

// Function to check rate limiting
const checkRateLimit = () => {
  const now = Date.now()
  const timeSinceLastSubmission = (now - lastSubmissionTime.value) / 1000
  
  if (timeSinceLastSubmission < RATE_LIMIT_SECONDS) {
    const remainingTime = Math.ceil(RATE_LIMIT_SECONDS - timeSinceLastSubmission)
    return {
      allowed: false,
      remainingTime
    }
  }
  
  return { allowed: true, remainingTime: 0 }
}

// Voting functions
const voteOnPost = async (postId, voteType) => {
  if (isVoting.value) return
  
  isVoting.value = true
  
  try {
    // Check if user has already voted on this post
    const existingVote = userVotes.value.get(postId)
    
    // If user clicks the same vote type they already voted, remove the vote
    if (existingVote === voteType) {
      await removeVote(postId, voteType)
      userVotes.value.delete(postId)
    } else {
      // If user had a different vote, remove it first
      if (existingVote) {
        await removeVote(postId, existingVote)
      }
      
      // Add the new vote
      await addVote(postId, voteType)
      userVotes.value.set(postId, voteType)
    }
    
    // Refresh posts to show updated counts
    await loadPosts(currentPage.value)
    
  } catch (error) {
    console.error('Error voting on post:', error)
  } finally {
    isVoting.value = false
  }
}

const addVote = async (postId, voteType) => {
  const column = voteType === 'up' ? 'likes' : 'dislikes'
  
  const { error } = await supabase
    .from('posts')
    .update({ [column]: supabase.raw(`${column} + 1`) })
    .eq('id', postId)
  
  if (error) {
    throw error
  }
}

const removeVote = async (postId, voteType) => {
  const column = voteType === 'up' ? 'likes' : 'dislikes'
  
  const { error } = await supabase
    .from('posts')
    .update({ [column]: supabase.raw(`GREATEST(${column} - 1, 0)`) })
    .eq('id', postId)
  
  if (error) {
    throw error
  }
}

const hasUserVoted = (postId, voteType) => {
  return userVotes.value.get(postId) === voteType
}

// Contact form submission
const submitContact = async () => {
  try {
    // Send email via API
    const response = await $fetch('/api/send-email', {
      method: 'POST',
      body: {
        name: contactForm.value.name,
        email: contactForm.value.email,
        message: contactForm.value.message,
        country: contactForm.value.country,
        state: contactForm.value.state
      }
    })
    
    if (response.success) {
      // Show success message
      alert('Message sent successfully! We\'ll get back to you soon.')
      
      // Reset form
      contactForm.value = {
        name: '',
        email: '',
        message: '',
        country: '',
        state: ''
      }
    }
  } catch (error) {
    console.error('Error sending contact message:', error)
    alert('Sorry, there was an error sending your message. Please try again later.')
  }
}

// Pagination
const currentPage = ref(1)
const postsPerPage = 10

// Use filtered posts for pagination
const postsToDisplay = computed(() => {
  return filteredPosts.value.length > 0 || searchQuery.value || filterOption.value !== 'all' 
    ? filteredPosts.value 
    : posts.value
})

const totalPages = computed(() => {
  return Math.ceil(postsToDisplay.value.length / postsPerPage)
})

const paginatedPosts = computed(() => {
  const start = (currentPage.value - 1) * postsPerPage
  const end = start + postsPerPage
  return postsToDisplay.value.slice(start, end)
})

const countries = [
  'United States',
  'Canada',
  'United Kingdom',
  'Australia',
  'Germany',
  'France',
  'Italy',
  'Spain',
  'Netherlands',
  'Sweden',
  'Norway',
  'Denmark',
  'Japan',
  'South Korea',
  'India',
  'Brazil',
  'Mexico',
  'Argentina',
  'Other'
]

const usStates = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho',
  'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana',
  'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
  'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada',
  'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
  'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington',
  'West Virginia', 'Wisconsin', 'Wyoming'
]

const submitPost = async () => {
  // Phase 1 Moderation: Check rate limiting
  const rateCheck = checkRateLimit()
  if (!rateCheck.allowed) {
    rateLimitRemainingTime.value = rateCheck.remainingTime
    showRateLimitModal.value = true
    return
  }
  
  // Phase 1 Moderation: Check for profanity in name and text
  if (containsProfanity(form.value.name)) {
    profanityModalType.value = 'name'
    showProfanityModal.value = true
    return
  }
  
  if (containsProfanity(form.value.text)) {
    profanityModalType.value = 'text'
    showProfanityModal.value = true
    return
  }
  
  // Handle form submission here
  console.log('Form submitted:', form.value)
  
  isLoading.value = true
  isSubmitting.value = true
  
  try {
    // Phase 2 Moderation: OpenAI API check
    console.log('Running Phase 2 moderation check...')
    const moderationResponse = await $fetch('/api/moderate', {
      method: 'POST',
      body: {
        text: form.value.text,
        name: form.value.name
      }
    })
    
    console.log('Moderation result:', moderationResponse)
    
    // If content is flagged by OpenAI, show specific error
    if (moderationResponse.flagged) {
      const flaggedCategories = Object.keys(moderationResponse.categories)
        .filter(key => moderationResponse.categories[key])
        .map(category => category.replace('_', ' '))
        .join(', ')
      
      // Show moderation modal with specific violation details
      showModerationModal.value = true
      moderationViolationType.value = flaggedCategories || 'inappropriate content'
      return
    }
    // Create new post from POST form
    const postData = {
      name: form.value.name,
      message: form.value.text,
      location: form.value.state ? `${form.value.state}, ${form.value.country}` : form.value.country
    }
    
    console.log('Attempting to add post:', postData)
    const { post, error } = await addPost(postData)
    
    if (error) {
      console.error('Full Supabase error object:', error)
      console.error('Error details:', JSON.stringify(error, null, 2))
      
      // Check various ways the table not found error might appear
      const errorString = JSON.stringify(error).toLowerCase()
      const errorMessage = error.message || error.details || error.hint || 'Unknown error'
      
      if (errorString.includes('relation') && errorString.includes('does not exist') ||
          errorString.includes('table') && errorString.includes('not found') ||
          errorString.includes('posts') && errorString.includes('does not exist')) {
        
        alert('❌ Database table not found!\n\nThe posts table doesn\'t exist in your Supabase database yet.\n\nPlease create it by running the SQL commands shown in the browser console.')
        
        console.log(`
🗄️ CREATE THE POSTS TABLE IN SUPABASE:

1. Go to https://supabase.com/dashboard
2. Select your project: dkugwkjmxkdwgihlrcsh
3. Go to SQL Editor (left sidebar)
4. Run this SQL:

CREATE TABLE IF NOT EXISTS posts (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  message TEXT NOT NULL,
  location TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON posts
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert access" ON posts
  FOR INSERT WITH CHECK (true);

INSERT INTO posts (name, message, location) VALUES 
  ('Sarah', 'honey can you pick up some milk on your way home also your father says the lawn mower is broken again and we need to call someone but I dont know who to call do you know anyone', 'California, United States'),
  ('Mike', 'Mom just texted: "The internet is down. How do I fix it? Also, what\'s my password for the email? And can you come over this weekend to help me with the TV remote? It\'s not working right."', 'Texas, United States'),
  ('Jessica', 'call me when you get this its important but not an emergency but kind of urgent but dont worry its nothing serious just call me ok love you', 'Ontario, Canada');

5. Click RUN to execute the SQL
6. Try submitting a post again!
`)
      } else {
        alert(`❌ Database error occurred!\n\nError: ${errorMessage}\n\nCheck the browser console for full details.`)
      }
      return
    }
    
    console.log('Post added successfully:', post)
    
    // Show success modal instead of alert
    showSuccessModal.value = true
    
    // Update rate limiting timestamp
    lastSubmissionTime.value = Date.now()
    
    // Reset form
    form.value = {
      name: '',
      text: '',
      country: '',
      state: ''
    }
    
    // Refresh posts data for homepage
    await loadPosts(1)
    
  } catch (error) {
    console.error('Unexpected error submitting post:', error)
    alert(`Unexpected error: ${error.message}. Check the console for details.`)
  } finally {
    isLoading.value = false
    isSubmitting.value = false
  }
}



// Modal action functions
const closeModal = () => {
  showSuccessModal.value = false
  showProfanityModal.value = false
  showRateLimitModal.value = false
  showModerationModal.value = false
}

const viewHomepage = async () => {
  closeModal()
  await navigateTo('/')
}

// Load posts from Supabase
const loadPosts = async (page = 1) => {
  isLoading.value = true
  currentPage.value = page
  
  try {
    
    const { posts: fetchedPosts, totalCount, error } = await fetchPosts(page, postsPerPage)
    
    if (error) {
      console.error('Error loading posts:', error)
      // Fallback to sample posts if Supabase fails
      posts.value = [
        {
          id: 1,
          name: 'Sarah',
          message: 'honey can you pick up some milk on your way home also your father says the lawn mower is broken again and we need to call someone but I dont know who to call do you know anyone',
          location: 'California, United States',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 2,
          name: 'Mike',
          message: 'Mom just texted: "The internet is down. How do I fix it? Also, what\'s my password for the email? And can you come over this weekend to help me with the TV remote? It\'s not working right."',
          location: 'Texas, United States',
          created_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 3,
          name: 'Jessica',
          message: 'call me when you get this its important but not an emergency but kind of urgent but dont worry its nothing serious just call me ok love you',
          location: 'Ontario, Canada',
          created_at: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString()
        }
      ]
      totalPostsCount.value = 3
      return
    }
    
    posts.value = fetchedPosts
    totalPostsCount.value = totalCount
    
  } catch (error) {
    console.error('Error loading posts:', error)
    // Fallback to empty array
    posts.value = []
    totalPostsCount.value = 0
  } finally {
    isLoading.value = false
  }
}

// Pagination functions
const nextPage = async () => {
  if (currentPage.value < totalPages.value) {
    await loadPosts(currentPage.value + 1)
  }
}

const previousPage = async () => {
  if (currentPage.value > 1) {
    await loadPosts(currentPage.value - 1)
  }
}

// Load posts when component mounts
onMounted(() => {
  loadPosts(1)
})

// Helper function to format dates
const formatDate = (dateString) => {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date)
}
</script>

<style>
/* Base typography setup */
body {
  background-color: #1B1B2A;
  margin: 0;
  padding: 0;
  font-family: 'Nunito', sans-serif;
  color: white;
}

html {
  background-color: #1B1B2A;
}

/* Primary typography - BebasNeue for titles and headlines */
h1, h2, h3, h4, h5, h6 {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  margin: 0;
  line-height: 1.2;
}

h1 {
  font-size: 3rem;
  text-align: center;
  padding: 2rem;
  letter-spacing: 0.05em;
}

h2 {
  font-size: 2.5rem;
  letter-spacing: 0.04em;
}

h3 {
  font-size: 2rem;
  letter-spacing: 0.03em;
}

/* Secondary typography - Nunito for everything else */
p, span, div, a, button, input, textarea, label {
  font-family: 'Nunito', sans-serif;
}

p {
  line-height: 1.6;
  margin-bottom: 1rem;
}

a {
  color: #60a5fa;
  text-decoration: none;
}

a:hover {
  color: #93c5fd;
  text-decoration: underline;
}

/* Site container for reduced width */
.site-container {
  max-width: 75%;
  margin: 0 auto;
  min-height: 100vh;
}

/* Site header and name styling */
.site-header {
  padding: 1rem 2rem;
  margin-top: 2rem;
  background: #1B1B2A;
  backdrop-filter: blur(10px);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.site-name-link {
  text-decoration: none;
  transition: transform 0.2s ease;
}

.site-name-link:hover {
  transform: scale(1.02);
}

.site-name {
  font-size: 2.5rem;
  font-weight: bold;
  display: inline-block;
  cursor: pointer;
}

.site-name .texts {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  letter-spacing: 0.02em;
}

.site-name .dot {
  font-family: 'Nunito', sans-serif;
  color: #00FFB3
}

.site-name .mom {
  font-family: 'Nunito', sans-serif;
  color: #FF007A;
}

/* Green periods for contact page heading */
.green-period {
  color: #00FFB3;
}

/* Green notice text */
.green-notice {
  color: #00FFB3;
}

/* Navigation menu styling */
.site-nav {
  display: flex;
  gap: 2rem;
}

/* Mobile navigation */
.mobile-nav {
  display: none;
}

.hamburger-btn {
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 2rem;
  height: 2rem;
  position: relative;
  z-index: 1001;
}

.hamburger-btn span {
  width: 100%;
  height: 3px;
  background-color: white;
  transition: all 0.3s ease;
  transform-origin: center;
}

.hamburger-btn.active span:nth-child(1) {
  transform: rotate(45deg) translate(5px, 5px);
}

.hamburger-btn.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-btn.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  position: fixed;
  top: 0;
  right: -100%;
  width: 250px;
  height: 100vh;
  background: #1B1B2A;
  display: flex;
  flex-direction: column;
  padding: 4rem 2rem 2rem;
  transition: right 0.3s ease;
  z-index: 1000;
  border-left: 2px solid #FF007A;
}

.mobile-menu.active {
  right: 0;
}

.mobile-nav-link {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  text-decoration: none;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  padding: 1rem 0;
  border-bottom: 1px solid #333;
  transition: color 0.3s ease;
}

.mobile-nav-link:hover {
  color: #FF007A;
}

.mobile-nav-link:first-child {
  color: #FF007A;
  text-decoration: underline;
}

.mobile-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  z-index: 999;
}

.mobile-backdrop.active {
  opacity: 1;
  visibility: visible;
}

.nav-link {
  font-family: 'Bebas Neue', sans-serif;
  color: white;
  text-decoration: none;
  font-size: 2.2rem;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #00FFB3;
}

.nav-link-post {
  color: #FF007A;
  text-decoration: none;
  border-bottom: 2px solid #FF007A;
}

.nav-link-post:hover {
  color: #ff4da6;
  border-bottom-color: #ff4da6;
}

/* Main content styling */
main {
  padding-top: 1rem;
}

.main-blurb {
  font-family: 'Nunito', sans-serif;
  font-size: 5.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
  line-height: 6rem;
}

.main-blurb2 {
  font-family: 'Bebas Neue', sans-serif !important;
  font-size: 5.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
  line-height: 1rem;
}

.blurb2 {
  font-family: 'Bebas Neue', sans-serif;
  color: #FF007A;
  border-bottom: 3px solid #FF007A;
  display: inline-block;
  line-height: 0.9;
  margin-bottom: -2px;
}

.postit {
   font-family: 'Nunito', sans-serif; 
  color: #FFF;
}

.main-postit {
  font-family: 'Nunito', sans-serif;  
  font-weight: 900;
  color: #FFF;
  font-size: 1.5rem;
  margin-left: 1.75rem;
  margin-top: 3rem;
}

.site-hr {
  border-color: #FF007A;
}

.site-hr2 {
  margin-top: 5rem;
  border-color: #FF007A;
}

/* Fade-in animation for words */
.fade-word {
  opacity: 0;
  animation: fadeIn 1.5s ease-in-out forwards;
  font-family: 'Bebas Neue', sans-serif !important;
}

.fade-word-1 {
  animation-delay: 0s;
}

.fade-word-2 {
  animation-delay: 1.5s;
}

.fade-word-3 {
  animation-delay: 3s;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Post form styling */
.post-form-container {
  margin: 3rem 1.75rem;
}

.post-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4rem;
  text-align: center;
  margin-bottom: 3rem;
  color: white;
  letter-spacing: 0.05em;
}

.post-form {
  max-width: 600px;
  margin: 0 auto;
}

.form-group {
  margin-bottom: 2rem;
}

.form-label {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  color: white;
  display: block;
  margin-bottom: 0.5rem;
  letter-spacing: 0.03em;
}

.form-input,
.form-textarea,
.form-select {
  width: 100%;
  padding: 1rem;
  background-color: #2A2A3E;
  border: 2px solid #3A3A4E;
  border-radius: 8px;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
}

.form-input:focus,
.form-textarea:focus,
.form-select:focus {
  outline: none;
  border-color: #FF007A;
}

.form-select {
  cursor: pointer;
}

.form-select option {
  background-color: #2A2A3E;
  color: white;
  padding: 0.5rem;
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.form-textarea::placeholder {
  color: #888;
  font-style: italic;
}

.submit-btn {
  background-color: #FF007A;
  color: white;
  border: none;
  padding: 1rem 3rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.5rem;
  letter-spacing: 0.05em;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s ease;
  display: block;
  margin: 2rem auto 0;
}

.submit-btn:hover {
  background-color: #ff4da6;
}

/* About page styling */
.about-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.about-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 64px;
  text-align: center;
  margin-bottom: 3rem;
  letter-spacing: 0.05em;
  line-height: 1.3;
}

.about-content {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  line-height: 1.8;
  color: white;
}

/* Posts section styling */
.posts-section {
  margin-top: 3rem;
}

.posts-title {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 55px;
  text-align: center;
  margin-top: 5rem;
  margin-bottom: 2rem;
  letter-spacing: 0.05em;
  color: white;
}

/* New Feed Title Design */
.feed-title-container {
  text-align: center;
  margin: 4rem 0 3rem 0;
  padding: 2rem;
  position: relative;
}

.feed-title-main {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.live-indicator {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.2rem;
  color: #FF007A;
  letter-spacing: 0.1em;
  animation: livePulse 2s ease-in-out infinite;
  background: linear-gradient(45deg, #FF007A, #ff4da6);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
}

@keyframes livePulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.7; transform: scale(1.05); }
}

.feed-title-text {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 3.5rem;
  color: white;
  letter-spacing: 0.08em;
  line-height: 1;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.mom-text-highlight {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 4.5rem;
  background: linear-gradient(135deg, #FF007A 0%, #00FFB3 50%, #FF007A 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% 200%;
  animation: gradientShift 3s ease-in-out infinite;
  letter-spacing: 0.1em;
  line-height: 1;
  text-shadow: 0 0 20px rgba(255, 0, 122, 0.3);
  position: relative;
}

@keyframes gradientShift {
  0%, 100% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
}

.mom-text-highlight::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(255, 0, 122, 0.1) 50%, transparent 100%);
  animation: shimmer 2s ease-in-out infinite;
  pointer-events: none;
}

@keyframes shimmer {
  0%, 100% { opacity: 0; transform: translateX(-100%); }
  50% { opacity: 1; transform: translateX(100%); }
}

.feed-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  color: #cccccc;
  font-style: italic;
  letter-spacing: 0.02em;
  margin-top: 1rem;
  opacity: 0.9;
  animation: subtitleFade 4s ease-in-out infinite;
}

@keyframes subtitleFade {
  0%, 100% { opacity: 0.9; }
  50% { opacity: 0.6; }
}

/* Responsive design for feed title */
@media (max-width: 768px) {
  .feed-title-text {
    font-size: 2.5rem;
  }
  
  .mom-text-highlight {
    font-size: 3.2rem;
  }
  
  .feed-subtitle {
    font-size: 1rem;
  }
  
  .feed-title-container {
    margin: 2rem 0;
    padding: 1rem;
  }
}

.posts-container {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 2rem;
}

.post-card {
  background-color: #2A2A3E;
  border-radius: 12px;
  padding: 1.5rem;
  border-left: 4px solid #FF007A;
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.post-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(255, 0, 122, 0.15);
}

.post-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.post-author {
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.4rem;
  color: #FF007A;
  letter-spacing: 0.05em;
}

.post-location {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  color: #00FFB3;
  font-weight: 600;
}

.post-content {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  line-height: 1.6;
  color: white;
  margin-bottom: 1rem;
  word-wrap: break-word;
}

.post-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.post-timestamp {
  font-family: 'Nunito', sans-serif;
  font-size: 0.85rem;
  color: #888;
}

.post-voting {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.vote-btn {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background-color: #2A2A3E;
  border: 2px solid #444;
  color: #ccc;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 60px;
  justify-content: center;
}

.vote-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
}

.vote-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.vote-up:hover:not(:disabled) {
  border-color: #00FFB3;
  background-color: rgba(0, 255, 179, 0.1);
  color: #00FFB3;
}

.vote-down:hover:not(:disabled) {
  border-color: #FF007A;
  background-color: rgba(255, 0, 122, 0.1);
  color: #FF007A;
}

.vote-btn.voted.vote-up {
  border-color: #00FFB3;
  background-color: rgba(0, 255, 179, 0.2);
  color: #00FFB3;
  font-weight: 600;
}

.vote-btn.voted.vote-down {
  border-color: #FF007A;
  background-color: rgba(255, 0, 122, 0.2);
  color: #FF007A;
  font-weight: 600;
}

.vote-count {
  font-weight: 600;
  min-width: 20px;
  text-align: center;
}

/* Responsive voting buttons */
@media (max-width: 768px) {
  .post-footer {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .post-voting {
    align-self: flex-end;
  }
  
  .vote-btn {
    padding: 0.4rem 0.6rem;
    font-size: 0.8rem;
    min-width: 50px;
  }
}

/* Pagination styling */
.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
  padding: 2rem 0;
}

.pagination-btn {
  background-color: #2A2A3E;
  color: white;
  border: 2px solid #FF007A;
  padding: 0.75rem 1.5rem;
  font-family: 'Bebas Neue', sans-serif;
  font-size: 1.1rem;
  letter-spacing: 0.05em;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 120px;
}

.pagination-btn:hover:not(:disabled) {
  background-color: #FF007A;
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(255, 0, 122, 0.3);
}

.pagination-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  border-color: #555;
  color: #888;
}

.pagination-info {
  display: flex;
  align-items: center;
}

.page-indicator {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: white;
  font-weight: 600;
  padding: 0.5rem 1rem;
  background-color: #2A2A3E;
  border-radius: 6px;
  border: 1px solid #444;
}

/* Comprehensive Mobile Responsiveness */
@media (max-width: 768px) {
  /* MOBILE NAVIGATION - HIGHEST PRIORITY */
  .desktop-nav,
  .site-nav {
    display: none !important;
  }
  
  .mobile-nav {
    display: block !important;
  }
  
  /* Container and layout fixes */
  .site-container {
    max-width: 100%;
    padding: 0 1rem;
  }
  
  /* Header and navigation */
  .site-header {
    padding: 1rem;
    justify-content: space-between;
    align-items: center;
  }
  
  .site-name {
    font-size: 1.8rem;
  }
  
  /* Hide desktop nav, show mobile hamburger */
  .site-nav.desktop-nav {
    display: none !important;
  }
  
  .mobile-nav {
    display: block !important;
  }
  
  /* Ensure nav links are hidden on mobile */
  .nav-link {
    display: none !important;
  }
  
  /* Fix container width and spacing */
  .site-container {
    width: 100%;
    max-width: 100%;
    padding: 0;
    margin: 0;
  }
  
  /* Better main content layout */
  main {
    padding: 0 1rem;
    width: 100%;
    box-sizing: border-box;
  }
  
  /* Main content text scaling */
  .main-blurb {
    font-size: 1.8rem;
    line-height: 2.2rem;
    margin-left: 1rem;
    margin-top: 1rem;
    margin-bottom: 1rem;
  }
  
  .main-blurb2 {
    font-size: 1.8rem;
    margin-left: 1rem;
    margin-top: 0.5rem;
    line-height: 1.4;
    margin-bottom: 1rem;
  }
  
  /* Fix MOM text overlap */
  .blurb2 {
    display: inline-block;
    margin: 0 0.2rem;
    line-height: 1.2;
  }
  
  /* Form styling */
  .post-form-container {
    padding: 1rem;
  }
  
  .post-title {
    font-size: 2rem;
    text-align: center;
  }
  
  .form-input,
  .form-textarea,
  .form-select {
    font-size: 1rem;
  }
  
  .submit-btn {
    font-size: 1.2rem;
    padding: 1rem 2rem;
  }
  
  /* Posts section */
  .posts-container {
    padding: 0 1rem;
  }
  
  .post-card {
    padding: 1rem;
    margin-bottom: 1rem;
  }
  
  .post-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.25rem;
  }
  
  .posts-title {
    font-size: 2rem;
  }
  
  /* Pagination */
  .pagination {
    flex-direction: column;
    gap: 1rem;
  }
  
  .pagination-btn {
    min-width: 140px;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
  
  /* About page */
  .about-container {
    padding: 1rem;
  }
  
  .about-title {
    font-size: 2rem;
  }
  
  /* Contact page */
  .contact-form-container {
    padding: 1rem;
  }
  
  /* Modal responsiveness */
  .modal-content {
    margin: 1rem;
    max-width: calc(100% - 2rem);
  }
  
  .modal-title {
    font-size: 1.5rem;
  }
  
  /* Notice section */
  .main-postit {
    margin: 1rem;
    font-size: 0.9rem;
    padding: 1rem;
  }
  
  .postit2 {
    font-size: 0.9rem;
    line-height: 1.4;
  }
  
  /* Feed title */
  .feed-title {
    font-size: 2rem;
  }
}

/* Extra small mobile devices */
@media (max-width: 480px) {
  .main-blurb {
    font-size: 1.4rem;
    line-height: 1.8rem;
    margin-top: 0.5rem;
  }
  
  .main-blurb2 {
    font-size: 1.4rem;
    line-height: 1.6rem;
    margin-top: 0.25rem;
  }
  
  .site-name {
    font-size: 1.3rem;
  }
  
  .nav-link {
    font-size: 1rem;
  }
  
  .post-title {
    font-size: 1.3rem;
  }
  
  .posts-title {
    font-size: 1.3rem;
  }
  
  .about-title {
    font-size: 1.3rem;
  }
  
  /* Better mobile spacing */
  .site-container {
    padding: 0 0.5rem;
  }
  
  .main-postit {
    margin: 0.5rem;
    padding: 0.75rem;
    font-size: 0.8rem;
  }
  
  .postit2 {
    font-size: 0.8rem;
  }
  
  /* Improve MOM text on small screens */
  .blurb2 {
    margin: 0 0.1rem;
    padding-bottom: 0;
    border-bottom-width: 2px;
  }
  
  /* Mobile search and filter bar */
  .search-filter-bar {
    flex-direction: column;
    gap: 0.75rem;
    margin: 1rem 0;
    padding: 0.75rem;
  }
  
  .search-container {
    max-width: 100%;
  }
  
  .search-input,
  .filter-select {
    font-size: 0.9rem;
    padding: 0.6rem 2rem 0.6rem 0.8rem;
  }
  
  .filter-select {
    min-width: 100%;
  }
}

.about-content p {
  margin-bottom: 1.5rem;
  text-align: left;
}

.about-final {
  text-align: center;
  font-weight: 600;
  font-size: 1.2rem;
  margin-top: 2.5rem;
  padding-top: 2rem;
  border-top: 1px solid #FF007A;
}

/* Screen reader only class for SEO */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Performance optimizations for Core Web Vitals */
* {
  box-sizing: border-box;
}

img {
  max-width: 100%;
  height: auto;
}

/* Reduce layout shift */
.fade-word {
  min-height: 1em;
}

/* Footer styling */
.site-footer {
  margin-top: 4rem;
  padding: 2rem 0;
  
  text-align: center;
}

/* Success Modal Styling */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background-color: #1B1B2A;
  border: 2px solid #FF007A;
  border-radius: 12px;
  padding: 2.5rem;
  max-width: 500px;
  width: 90%;
  max-height: 80vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(255, 0, 122, 0.3);
  animation: modalSlideIn 0.3s ease-out;
}

@keyframes modalSlideIn {
  from {
    opacity: 0;
    transform: translateY(-30px) scale(0.95);
  }
  to {
    opacity: 1;
    transform: translateY(0) scale(1);
  }
}

.modal-header {
  text-align: center;
  margin-bottom: 2rem;
}

.success-icon {
  width: 80px;
  height: 80px;
  background-color: #00FFB3;
  color: #1B1B2A;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  animation: successPulse 0.6s ease-out;
}

@keyframes successPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.warning-icon {
  width: 80px;
  height: 80px;
  background-color: #FF007A;
  color: white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 3rem;
  font-weight: bold;
  margin: 0 auto 1.5rem;
  animation: warningPulse 0.6s ease-out;
}

@keyframes warningPulse {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.modal-title {
  font-family: 'BebasNeue', Arial, sans-serif;
  font-size: 2.5rem;
  color: white;
  margin: 0;
  letter-spacing: 2px;
}

.modal-body {
  text-align: center;
  margin-bottom: 2.5rem;
}

.modal-m.feed-subtitle {
  font-family: 'Nunito', sans-serif;
  font-size: 1.1rem;
  color: #ccc;
  margin-top: 0.5rem;
  font-weight: 400;
}

/* Search and Filter Bar */
.search-filter-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 2rem auto 1.5rem auto;
  padding: 1rem;
  background-color: #2A2A3E;
  border-radius: 12px;
  border: 2px solid #444;
  gap: 1rem;
  max-width: 800px;
  width: 100%;
  box-sizing: border-box;
}

.search-container {
  position: relative;
  flex: 1;
  max-width: 300px;
}

.search-input {
  width: 100%;
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background-color: #1B1B2A;
  border: 2px solid #555;
  border-radius: 8px;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: #FF007A;
  box-shadow: 0 0 0 3px rgba(255, 0, 122, 0.1);
}

.search-input::placeholder {
  color: #888;
}

.search-icon {
  position: absolute;
  right: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: #888;
  pointer-events: none;
  font-size: 1rem;
}

.filter-container {
  position: relative;
}

.filter-select {
  padding: 0.75rem 2.5rem 0.75rem 1rem;
  background-color: #1B1B2A;
  border: 2px solid #555;
  border-radius: 8px;
  color: white;
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  appearance: none;
  background-image: url('data:image/svg+xml;charset=US-ASCII,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 4 5"><path fill="%23888" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 0.75rem center;
  background-size: 12px;
  min-width: 180px;
}

.filter-select:focus {
  outline: none;
  border-color: #FF007A;
  box-shadow: 0 0 0 3px rgba(255, 0, 122, 0.1);
}

.filter-select option {
  background-color: #1B1B2A;
  color: white;
  padding: 0.5rem;
}

.modal-submessage {
  font-family: 'Nunito', sans-serif;
  font-size: 1rem;
  color: #B0B0B0;
  margin: 0;
  line-height: 1.5;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.modal-btn {
  font-family: 'BebasNeue', Arial, sans-serif;
  font-size: 1.1rem;
  letter-spacing: 1px;
  padding: 1rem 2rem;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 160px;
}

.modal-btn-primary {
  background-color: #FF007A;
  color: white;
}

.modal-btn-primary:hover {
  background-color: #ff4da6;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 0, 122, 0.4);
}

.modal-btn-secondary {
  background-color: transparent;
  color: #00FFB3;
  border: 2px solid #00FFB3;
}

.modal-btn-secondary:hover {
  background-color: #00FFB3;
  color: #1B1B2A;
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(0, 255, 179, 0.4);
}

/* Mobile responsiveness for modal */
@media (max-width: 768px) {
  .modal-content {
    padding: 2rem;
    margin: 1rem;
  }
  
  .success-icon {
    width: 60px;
    height: 60px;
    font-size: 2rem;
  }
  
  .modal-title {
    font-size: 2rem;
  }
  
  .modal-message {
    font-size: 1.1rem;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-btn {
    width: 100%;
    min-width: auto;
  }
}

.copyright {
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  color: #00FFB3;
  opacity: 0.8;
}

</style>

