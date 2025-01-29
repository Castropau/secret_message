import { createClient } from '@supabase/supabase-js';


const supabaseUrl = 'https://lcuiwaljmzgkockdayer.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjdWl3YWxqbXpna29ja2RheWVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzgwNDk2MTUsImV4cCI6MjA1MzYyNTYxNX0.HtvKOr5Q3rLeClm53dufQ9hdjpCvD55WbH7C_omnQQY';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
