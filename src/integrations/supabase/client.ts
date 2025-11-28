import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://crvtdnhppwsjlfnshtut.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNydnRkbmhwcHdzamxmbnNodHV0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyNzMzODYsImV4cCI6MjA3OTg0OTM4Nn0.245M6dQfTmDYsyO7fHz6h3yeZlcCKIeZpmcsyRDz-7c';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
