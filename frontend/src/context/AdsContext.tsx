'use client'

import { createContext, useContext, ReactNode } from 'react'
import { produtosAPI } from '@/services/api'
import { useProdutos } from '@/context/ProdutosContext'
import { useAuth } from '@/context/AuthContext'

export type ContactMethod = 'chat' | 'whatsapp' | 'phone'

export interface AdFormData {
  title:       string
  description: string
  price:       string
  negotiable:  boolean
  condition:   string
  cep:         string
  city:        string
  contacts:    ContactMethod[]
  photos:      string[]
  categoriaId: number | null
}

interface AdsContextType {
  publishAd: (data: AdFormData) => Promise<void>
}

const AdsContext = createContext<AdsContextType | null>(null)

export function AdsProvider({ children }: { children: ReactNode }) {
  const { carregarProdutos } = useProdutos()
  const { usuario, token } = useAuth()

  async function publishAd(data: AdFormData) {
    if (!usuario || !token) throw new Error('Usuário não autenticado')
    if (!data.categoriaId)  throw new Error('Selecione uma categoria')

    await produtosAPI.create(
  {
    nome:        data.title,
    descricao:   data.description,
    preco:       parseFloat(data.price),
    estoque:     1,
    categoriaId: data.categoriaId,
    imagem_url:  data.photos[0] ?? null,
    imagens:     data.photos,    
    negociavel:  data.negotiable,
    condicao:    data.condition,
    cep:         data.cep,
    cidade:      data.city,
    contatos:    data.contacts,
    marketplace: true,
    id_usuario:  usuario.id,
  },
  token,
)

    await carregarProdutos()
  }

  return (
    <AdsContext.Provider value={{ publishAd }}>
      {children}
    </AdsContext.Provider>
  )
}

export function useAds() {
  const ctx = useContext(AdsContext)
  if (!ctx) throw new Error('useAds deve estar dentro de AdsProvider')
  return ctx
}