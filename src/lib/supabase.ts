import { createClient } from '@supabase/supabase-js'

// Agregar logging para debug
console.log('Variables de entorno:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
})

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl) {
  throw new Error('VITE_SUPABASE_URL no está definida en las variables de entorno')
}

if (!supabaseAnonKey) {
  throw new Error('VITE_SUPABASE_ANON_KEY no está definida en las variables de entorno')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey) 