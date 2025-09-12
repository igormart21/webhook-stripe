import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://qvgomxzheevixmcktcao.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF2Z29teHpoemV2aXhtY2t0Y2FvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3MDU5MjEsImV4cCI6MjA3MzI4MTkyMX0.kT5ehre8eLfqBYTZpxtY5gByBoMlFamGFUE179UXaLo'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      albums: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          is_public: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          is_public?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      album_cards: {
        Row: {
          id: string
          album_id: string
          card_id: string
          quantity: number
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          album_id: string
          card_id: string
          quantity?: number
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          album_id?: string
          card_id?: string
          quantity?: number
          notes?: string | null
          created_at?: string
        }
      }
    }
  }
}
