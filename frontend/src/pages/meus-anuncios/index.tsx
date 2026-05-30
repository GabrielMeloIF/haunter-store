import Header from "@/Components/Header/Header";

import Footer from "@/Components/Footer/Footer";
import { useRouter } from 'next/router'
import { useAds } from '@/context/AdsContext'

export default function MeusAnuncios() {
  const router      = useRouter()
  const { ads, deleteAd } = useAds()

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
   
      <div className="flex-1  max-w-7xl mx-auto p-15 w-full">

        <div className="flex items-center justify-between mb-8">
          <div className="border-l-4 border-purple-500 pl-4">
            <h2 className="text-xl font-black text-white">Meus anúncios</h2>
            <p className="text-white text-sm">
              {ads.length === 0 ? 'Nenhum anúncio publicado ainda.' : `${ads.length} anúncio${ads.length > 1 ? 's' : ''} publicado${ads.length > 1 ? 's' : ''}`}
            </p>
          </div>
          <button
            onClick={() => router.push('/anunciar')}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-6 py-3 rounded-full text-sm border-2 border-white transition-colors shadow-lg shadow-purple-500/30"
          >
            + Novo anúncio
          </button>
        </div>

        {/* Estado vazio */}
        {ads.length === 0 && (
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
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-sm border-2 border-white transition-colors shadow-lg shadow-purple-500/30"
            >
              Criar anúncio
            </button>
          </div>
        )}

        {/* Grid de anúncios */}
        {ads.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ads.map(ad => (
              <div key={ad.id}
                className="bg-white rounded-2xl border-2 border-purple-500/30 overflow-hidden hover:border-purple-500 hover:shadow-lg hover:shadow-purple-500/10 transition-all duration-200 group">

                {/* Foto */}
                <div className="relative h-48 bg-gray-100 overflow-hidden">
                  {ad.photos?.length > 0 ? (
                    <img src={ad.photos[0]} alt={ad.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"/>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-300">
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-12 h-12"
                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14"/>
                      </svg>
                    </div>
                  )}
                  {ad.condition && (
                    <span className="absolute top-2 left-2 text-xs font-black px-2 py-1 rounded-full bg-purple-100 text-purple-700">
                      {ad.condition}
                    </span>
                  )}
                </div>

                {/* Info */}
                <div className="p-4">
                  <h3 className="font-black text-gray-800 text-sm leading-tight mb-1 line-clamp-2">
                    {ad.title || '(sem título)'}
                  </h3>
                  <p className="text-lg font-black text-purple-600 mb-1">
                    {ad.price ? 'R$ ' + Number(ad.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 }) : 'A combinar'}
                    {ad.negotiable && <span className="ml-2 text-xs font-semibold text-gray-400">(neg.)</span>}
                  </p>
                  {ad.description && (
                    <p className="text-xs text-gray-500 line-clamp-2 mb-3">{ad.description}</p>
                  )}
                  <div className="flex items-center justify-between text-xs text-gray-400 font-semibold mb-3">
                    <span>📍 {ad.city || 'Local não informado'}</span>
                  </div>

                  <button
                    onClick={() => deleteAd(ad.id)}
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