import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = 'https://dkugwkjmxkdwgihlrcsh.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRrdWd3a2pteGtkd2dpaGxyY3NoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI4ODA2MTEsImV4cCI6MjA2ODQ1NjYxMX0.4RuyeQBnX5JxnPbF37mqf6GkIsX2R04Cne-eUgjEcpY'

const supabase = createClient(supabaseUrl, supabaseAnonKey)

async function setupDatabase() {
  console.log('Setting up TextsMom database...')
  
  try {
    // Create the posts table
    const { error: createTableError } = await supabase.rpc('exec_sql', {
      sql: `
        CREATE TABLE IF NOT EXISTS posts (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL,
          message TEXT NOT NULL,
          location TEXT NOT NULL,
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
        
        -- Enable Row Level Security
        ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
        
        -- Drop existing policies if they exist
        DROP POLICY IF EXISTS "Allow public read access" ON posts;
        DROP POLICY IF EXISTS "Allow public insert access" ON posts;
        
        -- Allow public read access
        CREATE POLICY "Allow public read access" ON posts
          FOR SELECT USING (true);
        
        -- Allow public insert access
        CREATE POLICY "Allow public insert access" ON posts
          FOR INSERT WITH CHECK (true);
      `
    })

    if (createTableError) {
      console.error('Error creating table:', createTableError)
      return
    }

    console.log('✅ Posts table created successfully!')

    // Add some sample data
    const samplePosts = [
      {
        name: 'Sarah',
        message: 'honey can you pick up some milk on your way home also your father says the lawn mower is broken again and we need to call someone but I dont know who to call do you know anyone',
        location: 'California, United States'
      },
      {
        name: 'Mike',
        message: 'Mom just texted: "The internet is down. How do I fix it? Also, what\'s my password for the email? And can you come over this weekend to help me with the TV remote? It\'s not working right."',
        location: 'Texas, United States'
      },
      {
        name: 'Jessica',
        message: 'call me when you get this its important but not an emergency but kind of urgent but dont worry its nothing serious just call me ok love you',
        location: 'Ontario, Canada'
      }
    ]

    const { error: insertError } = await supabase
      .from('posts')
      .insert(samplePosts)

    if (insertError) {
      console.error('Error inserting sample data:', insertError)
    } else {
      console.log('✅ Sample posts added successfully!')
    }

    // Test fetching posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false })

    if (fetchError) {
      console.error('Error fetching posts:', fetchError)
    } else {
      console.log(`✅ Database test successful! Found ${posts.length} posts.`)
    }

    console.log('🎉 Database setup complete!')

  } catch (error) {
    console.error('Setup failed:', error)
  }
}

setupDatabase()
