import { createClient } from '@supabase/supabase-js'

// Agregar logging para debug
console.log('Variables de entorno:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
})

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://dxbhibhidmxikmujkjnh.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR4YmhpYmhpZG14aWttdWpram5oIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0ODU3MDAwMCwiZXhwIjoyMDY0MTQ2MDAwfQ.5HO69YwhPj3RSZej86d0SJl9PjDqKDjyc8h47DeRI3s'

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL no está definida en las variables de entorno')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 