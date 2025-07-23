import { createClient } from '@supabase/supabase-js'

// Test Supabase connection
const supabaseUrl = 'https://dkugwkjmxkdwgihlrcsh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWd3a2pteGtkd2dpaGxyY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODA2MTEsImV4cCI6MjA2ODQ1NjYxMX0.4RuyeQBnX5JxnPbF37mqf6GkIsX2R04Cne-eUgjEcpY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function testConnection() {
  console.log('🔍 Testing Supabase connection...')
  
  try {
    // Test basic connection
    const { data, error } = await supabase
      .from('posts')
      .select('count', { count: 'exact', head: true })
    
    if (error) {
      console.error('❌ Connection failed:', error.message)
      return false
    }
    
    console.log('✅ Connection successful!')
    console.log(`📊 Found ${data} posts in database`)
    
    // Test fetching posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(3)
    
    if (fetchError) {
      console.error('❌ Fetch failed:', fetchError.message)
      return false
    }
    
    console.log('✅ Posts fetched successfully!')
    console.log('📝 Sample posts:')
    posts.forEach((post, index) => {
      console.log(`  ${index + 1}. ${post.name}: "${post.message.substring(0, 50)}..."`)
    })
    
    return true
    
  } catch (error) {
    console.error('❌ Test failed:', error.message)
    return false
  }
}

testConnection()
