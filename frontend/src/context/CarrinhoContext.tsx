

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { carrinhoAPI } from '@/services/api'
import { useAuth } from './AuthContext'

export interface ItemCarrinho {
  id_carrinho: number
  id_usuario: number
  id_produto: number
  quantidade: number
  produto?: any
}

interface CarrinhoContextType {
  itens: ItemCarrinho[]
  loading: boolean
  error: string | null
  carregarCarrinho: () => Promise<void>
  adicionarItem: (id_produto: number, quantidade: number) => Promise<void>
  atualizarQuantidade: (id_carrinho: number, quantidade: number) => Promise<void>
  removerItem: (id_carrinho: number) => Promise<void>
  limparCarrinho: () => Promise<void>
}

const CarrinhoContext = createContext<CarrinhoContextType | null>(null)

export function CarrinhoProvider({ children }: { children: ReactNode }) {
  const { usuario } = useAuth()
  const [itens, setItens] = useState<ItemCarrinho[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarCarrinho = async () => {
    if (!usuario) return
    try {
      setLoading(true)
      setError(null)
      const data = await carrinhoAPI.getByUser(usuario.id)
      setItens(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao carregar carrinho:', err)
    } finally {
      setLoading(false)
    }
  }

  const adicionarItem = async (id_produto: number, quantidade: number) => {
    if (!usuario) throw new Error('Faça login para adicionar itens')
    try {
      setLoading(true)
      setError(null)
      await carrinhoAPI.addItem(usuario.id, id_produto, quantidade)
      await carregarCarrinho()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const atualizarQuantidade = async (id_carrinho: number, quantidade: number) => {
    try {
      setLoading(true)
      setError(null)
      await carrinhoAPI.updateItem(id_carrinho, quantidade)
      await carregarCarrinho()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const removerItem = async (id_carrinho: number) => {
    try {
      setLoading(true)
      setError(null)
      await carrinhoAPI.removeItem(id_carrinho)
      await carregarCarrinho()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const limparCarrinho = async () => {
    if (!usuario) return
    try {
      setLoading(true)
      setError(null)
      await carrinhoAPI.clear(usuario.id)
      await carregarCarrinho()
    } catch (err: any) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  // Carregar carrinho quando usuário faz login
  useEffect(() => {
    if (usuario) {
      carregarCarrinho()
    }
  }, [usuario])

  return (
    <CarrinhoContext.Provider
      value={{ itens, loading, error, carregarCarrinho, adicionarItem, atualizarQuantidade, removerItem, limparCarrinho }}
    >
      {children}
    </CarrinhoContext.Provider>
  )
}

export function useCarrinho() {
  const ctx = useContext(CarrinhoContext)
  if (!ctx) throw new Error('useCarrinho deve estar dentro de CarrinhoProvider')
  return ctx
}
