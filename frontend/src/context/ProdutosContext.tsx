'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { produtosAPI } from '@/services/api'

export interface Produto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagem_url: string
  estoque: number
  categoria?: any
}

interface ProdutosContextType {
  produtos: Produto[]
  loading: boolean
  error: string | null
  carregarProdutos: () => Promise<void>
  carregarProduto: (id: number) => Promise<Produto | null>
}

const ProdutosContext = createContext<ProdutosContextType | null>(null)

export function ProdutosProvider({ children }: { children: ReactNode }) {
  const [produtos, setProdutos] = useState<Produto[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const carregarProdutos = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await produtosAPI.getAll()
      setProdutos(data)
    } catch (err: any) {
      setError(err.message)
      console.error('Erro ao carregar produtos:', err)
    } finally {
      setLoading(false)
    }
  }

  const carregarProduto = async (id: number): Promise<Produto | null> => {
    try {
      setLoading(true)
      setError(null)
      return await produtosAPI.getById(id)
    } catch (err: any) {
      setError(err.message)
      return null
    } finally {
      setLoading(false)
    }
  }

  // Carregar produtos ao iniciar
  useEffect(() => {
    carregarProdutos()
  }, [])

  return (
    <ProdutosContext.Provider value={{ produtos, loading, error, carregarProdutos, carregarProduto }}>
      {children}
    </ProdutosContext.Provider>
  )
}

export function useProdutos() {
  const ctx = useContext(ProdutosContext)
  if (!ctx) throw new Error('useProdutos deve estar dentro de ProdutosProvider')
  return ctx
}
