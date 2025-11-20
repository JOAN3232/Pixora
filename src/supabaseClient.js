// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://vrlecpwxobmnjroftblg.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZybGVjcHd4b2Jtbmpyb2Z0YmxnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM2Mjg4MjAsImV4cCI6MjA3OTIwNDgyMH0.deYkij7Eszfx94HjZvzf71rDkYiC3tV-Oo_sYIHgsXM'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
