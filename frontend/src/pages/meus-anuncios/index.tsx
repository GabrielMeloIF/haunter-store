import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import { useRouter } from 'next/router'
import { useAuth } from '@/context/AuthContext'
import { produtosAPI } from '@/services/api'
import { useState, useEffect } from 'react'

interface MeuProduto {
  id: number
  nome: string
  descricao: string
  preco: number
  imagens?: string[]
  imagem_url?: string
  condicao?: string
  cidade?: string
  negociavel?: boolean
}

export default function MeusAnuncios() {
  const router = useRouter()
  const { usuario, token } = useAuth()
  const [produtos, setProdutos] = useState<MeuProduto[]>([])
  const [loading, setLoading]   = useState(true)

  useEffect(() => {
    if (!usuario) return
    produtosAPI.getAll(token ?? undefined)
      .then((data: MeuProduto[]) => {
        setProdutos(data.filter((p: any) => p.id_usuario === usuario.id))
      })
      .finally(() => setLoading(false))
  }, [usuario])

  async function handleDelete(id: number) {
    if (!token) return
    await produtosAPI.delete(id, token)
    setProdutos(prev => prev.filter(p => p.id !== id))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <div className="flex-1 max-w-7xl mx-auto p-15 w-full">

        <div className="flex items-center justify-between mb-8">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-black text-white">Meus anúncios</h2>
            <p className="text-white text-sm">
              {loading ? 'Carregando...' : produtos.length === 0
                ? 'Nenhum anúncio publicado ainda.'
                : `${produtos.length} anúncio${produtos.length > 1 ? 's' : ''} publicado${produtos.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => router.push('/anunciar')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full text-sm scale-100 hover:scale-102 transition-transform"
          >
            + Novo anúncio
          </button>
        </div>

        {/* Estado vazio */}
        {!loading && produtos.length === 0 && (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mb-5 border-2 border-purple-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-10 h-10 text-purple-400"
                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0119 9.414V19a2 2 0 01-2 2z"/>
              </svg>
            </div>
            <h3 className="text-white font-black text-lg mb-2">Nenhum anúncio ainda</h3>
            <p className="text-gray-400 text-sm mb-6">Crie seu primeiro anúncio e comece a vender!</p>
            <button
              onClick={() => router.push('/anunciar')}
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-sm"
            >
              Criar anúncio
            </button>
          </div>
        )}

        {/* Grid de anúncios */}
        {!loading && produtos.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {produtos.map(p => (
              <div key={p.id}
                className="bg-[#1a1a2e] rounded-2xl border-2 border-purple-500/30 overflow-hidden hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 group">

                {/* Foto */}
                <div className="relative h-48 bg-gray-800 overflow-hidden">
                  {(p.imagens?.[0] || p.imagem_url) ? (
                    <img
                      src={p.imagens?.[0] || p.imagem_url}
                      alt={p.nome}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                      </svg>
                    </div>
                  )}
                  {p.condicao && (
                    <span className="absolute top-2 left-2 text-xs font-black px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                      {p.condicao}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-black text-white text-sm leading-tight mb-1 line-clamp-2">{p.nome}</h3>
                  <p className="text-lg font-black text-purple-400 mb-1">
                    R$ {p.preco?.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    {p.negociavel && <span className="ml-2 text-xs font-semibold text-gray-400">(neg.)</span>}
                  </p>
                  {p.descricao && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{p.descricao}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-3">
                    <span>📍 {p.cidade || 'Local não informado'}</span>
                  </div>

                  <button
                    onClick={() => handleDelete(p.id)}
                    className="w-full text-xs font-bold text-red-400 border-2 border-red-200 rounded-full py-2 hover:bg-red-50 hover:border-red-400 transition-colors"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  )
}