import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'your-supabase-url'
const supabaseKey = 'your-supabase-key'

const supabase = createClient(supabaseUrl, supabaseKey)