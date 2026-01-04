import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Database } from './types';
import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = "https://ebwgnhujgiodnmmxyznv.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVid2duaHVqZ2lvZG5tbXh5em52Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njc1MjE5NTQsImV4cCI6MjA4MzA5Nzk1NH0.VOQn3gTmT0HMrA7xomK9cn3MmPvfOsRum9wMZ_F1HMY";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
})
