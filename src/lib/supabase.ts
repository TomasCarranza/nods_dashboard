import { createClient } from '@supabase/supabase-js'

// Agregar logging para debug
console.log('Variables de entorno:', {
  url: import.meta.env.VITE_SUPABASE_URL,
  key: import.meta.env.VITE_SUPABASE_ANON_KEY
})

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Crear el cliente de Supabase solo si las variables de entorno están disponibles
export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Función auxiliar para verificar si Supabase está configurado
export const isSupabaseConfigured = () => {
  return supabase !== null
} 