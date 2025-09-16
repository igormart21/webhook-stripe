import React, { createContext, useContext, useEffect, useState } from 'react'
import { User, Session, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  isSuperAdmin: boolean
  signUp: (email: string, password: string, fullName?: string) => Promise<{ error: AuthError | null }>
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<{ error: AuthError | null }>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSuperAdmin, setIsSuperAdmin] = useState(false)

  // Lista de emails de superadmin (você pode mover isso para variáveis de ambiente)
  const SUPER_ADMIN_EMAILS = [
    'admin@pokedex.com',
    'superadmin@pokedex.com',
    'wikiwoo@example.com',
    'igormartins1993@gmail.com' // Superadmin principal
  ]

  const checkSuperAdminStatus = (userEmail: string | undefined) => {
    if (!userEmail) {
      setIsSuperAdmin(false)
      return
    }
    setIsSuperAdmin(SUPER_ADMIN_EMAILS.includes(userEmail))
  }

  useEffect(() => {
    // Obter sessão inicial
    const getInitialSession = async () => {
      console.log('AuthContext: Obtendo sessão inicial...');
      const { data: { session } } = await supabase.auth.getSession()
      console.log('AuthContext: Sessão inicial:', session?.user?.id);
      setSession(session)
      setUser(session?.user ?? null)
      checkSuperAdminStatus(session?.user?.email)
      setLoading(false)
    }

    getInitialSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('AuthContext: Mudança de auth:', event, session?.user?.id);
        setSession(session)
        setUser(session?.user ?? null)
        checkSuperAdminStatus(session?.user?.email)
        setLoading(false)

        // Criar perfil do usuário se for um novo registro
        if (event === 'SIGNED_UP' && session?.user) {
          await createUserProfile(session.user)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const createUserProfile = async (user: User) => {
    try {
      const { error } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          email: user.email!,
          full_name: user.user_metadata?.full_name || null,
          avatar_url: user.user_metadata?.avatar_url || null,
        })

      if (error) {
        console.error('Erro ao criar perfil:', error)
      }
    } catch (error) {
      console.error('Erro ao criar perfil:', error)
    }
  }

  const signUp = async (email: string, password: string, fullName?: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
        },
      },
    })
    return { error }
  }

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    return { error }
  }

  const signOut = async () => {
    const { error } = await supabase.auth.signOut()
    return { error }
  }

  const resetPassword = async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })
    return { error }
  }

  const value = {
    user,
    session,
    loading,
    isSuperAdmin,
    signUp,
    signIn,
    signOut,
    resetPassword,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
