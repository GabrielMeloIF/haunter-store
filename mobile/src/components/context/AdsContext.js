import { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'

const AdsContext = createContext(null)

const API_URL = process.env.EXPO_PUBLIC_API_URL;

export function AdsProvider({ children }) {
  const [ads, setAds] = useState([])

  function publishAd(data) {
    const newAd = {
      ...data,
      id: Date.now().toString(),
      publishedAt: new Date().toISOString(),
    }
    setAds(prev => [newAd, ...prev])
  }

  async function deleteAd(id, produtoId) {
  try {
    if (produtoId) {
      const response = await fetch(`${API_URL}/produtos/${produtoId}`, {
        method: 'DELETE',
      })

      console.log("STATUS DELETE:", response.status) // adiciona isso
      const data = await response.json()             // e isso
      console.log("RESPOSTA DELETE:", data)          // e isso

      if (!response.ok) {
        console.log('Erro ao deletar do banco:', response.status)
        return
      }
    }

    setAds(prev => prev.filter(a => a.id !== id))
  } catch (err) {
    console.log('Erro ao deletar:', err)
  }
}

  useEffect(() => {
    async function carregarAds() {
      const saved = await AsyncStorage.getItem('haunter_ads')
      if (saved) setAds(JSON.parse(saved))
    }
    carregarAds()
  }, [])

  useEffect(() => {
    AsyncStorage.setItem('haunter_ads', JSON.stringify(ads))
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