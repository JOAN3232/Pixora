// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wwsjutujviccwmwimwer.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind3c2p1dHVqdmljY3dtd2ltd2VyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5MTkxMDUsImV4cCI6MjA3NjQ5NTEwNX0.ghGnzFkJY5Yn61HeakvP27b-hgdqObPmyWzVt91Uu8Q'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
