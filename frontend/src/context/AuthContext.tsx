'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { authAPI, usersAPI } from '@/services/api'

export interface Usuario {
  id: number
  nome: string
  email: string
  tipo?: string
  foto?: string
}

interface AuthContextType {
  usuario: Usuario | null
  token: string | null
  loading: boolean
  error: string | null
  login: (email: string, senha: string) => Promise<void>
  register: (nome: string, email: string, senha: string, confirmar_senha: string) => Promise<void>
  logout: () => void
  updateUsuario: (data: Partial<Usuario>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(null)
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Carregar usuário do localStorage ao iniciar
  useEffect(() => {
  const savedUsuario = localStorage.getItem('user')
  const savedToken = localStorage.getItem('token')
  if (savedUsuario && savedToken) {
    const parsed = JSON.parse(savedUsuario)
    // garante que id sempre existe
    setUsuario({ ...parsed, id: parsed.id ?? parsed.id_usuario })
    setToken(savedToken)
  }
  setLoading(false)
}, [])

  const login = async (email: string, senha: string) => {
    try {
      setLoading(true)
      setError(null)
      const response = await authAPI.login(email, senha)
      const { token: newToken, usuario: userData } = response

      setToken(newToken)
      setUsuario(userData)
      localStorage.setItem('token', newToken)
      localStorage.setItem('user', JSON.stringify(userData))
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const register = async (nome: string, email: string, senha: string, confirmar_senha: string) => {
    try {
      setLoading(true)
      setError(null)
      await usersAPI.create(nome, email, senha, confirmar_senha)
      // Após registro, já faz login automaticamente
      await login(email, senha)
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUsuario(null)
    setToken(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  const updateUsuario = async (data: Partial<Usuario>) => {
  if (!usuario || !token) throw new Error('Usuário não autenticado')
  
  console.log('usuario no update:', usuario) // ← add isso temporariamente
  
  const id = usuario.id ?? (usuario as any).id_usuario // ← fallback
  if (!id) throw new Error('ID do usuário não encontrado')
  
  try {
    setLoading(true)
    const updated = await usersAPI.update(id, data, token)
    setUsuario({ ...updated, id: updated.id ?? updated.id_usuario }) // ← normaliza
    localStorage.setItem('user', JSON.stringify({ ...updated, id: updated.id ?? updated.id_usuario }))
  } catch (err: any) {
    setError(err.message)
    throw err
  } finally {
    setLoading(false)
  }
}

  return (
    <AuthContext.Provider value={{ usuario, token, loading, error, login, register, logout, updateUsuario }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve estar dentro de AuthProvider')
  return ctx
}
