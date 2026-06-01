'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export type ContactMethod = 'chat' | 'whatsapp' | 'phone'

export interface Ad {
  id: string
  title: string
  description: string
  price: string
  negotiable: boolean
  condition: string
  city: string
  cep: string
  contacts: ContactMethod[]
  photos: string[]
  publishedAt: string
}

interface AdsContextType {
  ads: Ad[]
  publishAd: (data: Omit<Ad, 'id' | 'publishedAt'>) => void
  deleteAd: (id: string) => void
}

const AdsContext = createContext<AdsContextType | null>(null)

export function AdsProvider({ children }: { children: ReactNode }) {
  const [ads, setAds] = useState<Ad[]>([])

  function publishAd(data: Omit<Ad, 'id' | 'publishedAt'>) {
    const newAd: Ad = {
      ...data,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    }
    setAds(prev => [newAd, ...prev])
  }

  function deleteAd(id: string) {
    setAds(prev => prev.filter(a => a.id !== id))
  }

  useEffect(() => {
    const saved = localStorage.getItem('haunter_ads')
    if (saved) setAds(JSON.parse(saved))
  }, [])

  useEffect(() => {
    localStorage.setItem('haunter_ads', JSON.stringify(ads))
  }, [ads])

  return (
    <AdsContext.Provider value={{ ads, publishAd, deleteAd }}>
      {children}
    </AdsContext.Provider>
  )
}

export function useAds() {
  const ctx = useContext(AdsContext)
  if (!ctx) throw new Error('useAds deve estar dentro de AdsProvider')
  return ctx
}
