import { createClient } from '@supabase/supabase-js'

// 🔁 Replace with your actual project URL and anon key
const supabaseUrl = 'https://lggfgonlqvlrrzvtesvi.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxnZ2Znb25scXZscnJ6dnRlc3ZpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQzOTM1NDQsImV4cCI6MjA2OTk2OTU0NH0.m9vGqTpJwutxh574k9IvKGd8yK9LicvpghIWX7PHhww'

export const supabase = createClient(supabaseUrl, supabaseKey)
