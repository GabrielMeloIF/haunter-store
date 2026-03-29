'use client'

import Header from "@/Components/Header/Header";
import Hero from "@/Components/Hero/Hero";
import Footer from "@/Components/Footer/Footer";
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'

type ContactMethod = 'chat' | 'whatsapp' | 'phone'

type AdFormData = {
  category:    string
  subcategory: string
  title:       string
  description: string
  price:       string
  negotiable:  boolean
  condition:   string
  cep:         string
  city:        string
  contacts:    ContactMethod[]
  photos:      string[]
}

const EMPTY_FORM: AdFormData = {
  category:    '',
  subcategory: '',
  title:       '',
  description: '',
  price:       '',
  negotiable:  false,
  condition:   '',
  cep:         '',
  city:        '',
  contacts:    [],
  photos:      [],
}

const AD_STORAGE_KEY = 'ad_form_data'

interface Props {
  // Props opcionais: se não fornecidas, lê do sessionStorage
  form?:      AdFormData
  terms?:     boolean
  onTerms?:   (v: boolean) => void
  onBack?:    () => void
  onPublish?: () => void
}

export default function StepReview(props: Props) {
  const router = useRouter()
  const [localTerms, setLocalTerms] = useState(false)

  const [form, setForm] = useState<AdFormData>(props.form ?? EMPTY_FORM)

  // Lê o sessionStorage apenas no cliente, após montagem, para evitar hydration mismatch
  useEffect(() => {
    if (props.form) return // se veio via props, não sobrescreve
    try {
      const saved = sessionStorage.getItem(AD_STORAGE_KEY)
      if (saved) setForm({ ...EMPTY_FORM, ...JSON.parse(saved) })
    } catch { /* sessionStorage indisponível */ }
  }, [props.form])

  const terms    = props.terms    ?? localTerms
  const setTerms = props.onTerms  ?? setLocalTerms

  const formattedPrice =
    form.price && !isNaN(Number(form.price))
      ? 'R$ ' + Number(form.price).toLocaleString('pt-BR', { minimumFractionDigits: 2 })
      : 'A combinar'

  const shortDesc = form.description
    ? form.description.slice(0, 120) + (form.description.length > 120 ? '…' : '')
    : '(sem descrição)'

  function handleBack() {
    if (props.onBack) {
      props.onBack()
    } else {
      router.push('/anunciar')
    }
  }

  function handlePublish() {
    if (!terms) return
    if (props.onPublish) {
      props.onPublish()
    } else {
      // Limpa o rascunho após publicar
      sessionStorage.removeItem(AD_STORAGE_KEY)
      router.push('/anuncio-finalizado')
    }
  }

  return (
    <div className="animate-fadeUp">
      <Header />
      <Hero />

      <div className="max-w-7xl mx-auto p-15">

        <h2 className="text-xl font-black text-white mb-1">Revise seu anúncio</h2>
        <p className="text-white text-sm mb-6">
          Veja como ficará para os compradores antes de publicar.
        </p>

        {/* Visualização */}
        <div className="bg-white rounded-2xl border-2 border-purple-600 shadow-sm overflow-hidden mb-10">
          <div className="bg-gray-100 h-125 flex items-center justify-center text-gray-300 overflow-hidden">
            {form.photos?.length > 0 ? (
       
              <img
                src={form.photos[0]}
                alt={form.title || 'Imagem do anúncio'}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 mx-auto"
                  fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14" />
                </svg>
                <p className="text-xs mt-2">Sem imagem</p>
              </div>
            )}
          </div>

          <div className="p-5">
            <p className="text-xl font-black text-gray-800 mb-1">
              {form.title || '(sem título)'}
            </p>

            <p className="text-2xl font-black text-brand mb-2">
              {formattedPrice}
              {form.negotiable && (
                <span className="ml-2 text-sm font-semibold text-gray-400">(negociável)</span>
              )}
            </p>

            <p className="text-sm text-gray-500 font-semibold mb-3">
              {shortDesc}
            </p>

            <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
              📍 {form.city || 'Localização não informada'} · Agora
            </div>
          </div>
        </div>

        {/* Termos */}
        <label className="flex items-start gap-3 cursor-pointer mb-6">
          <input
            type="checkbox"
            checked={terms}
            onChange={e => setTerms(e.target.checked)}
            className="accent-purple-600 mt-0.5 w-4 h-4"
          />
          <span className="text-xs text-gray-500 font-semibold">
            Li e aceito os{' '}
            <a href="/termos" className="text-purple-400 underline hover:text-purple-300">
              Termos de Uso
            </a>{' '}
            e{' '}
            <a href="/privacidade" className="text-purple-400 underline hover:text-purple-300">
              Política de Privacidade
            </a>
            .
          </span>
        </label>

        {/* Ações */}
        <div className="flex justify-between mt-4">
          <button
            onClick={handleBack}
            className="text-purple-400 font-bold px-6 py-3 rounded-full text-sm border-2 border-purple-500/40 bg-white hover:bg-purple-500/10 transition-colors"
          >
            ← Voltar
          </button>

          <button
            onClick={handlePublish}
            disabled={!terms}
            className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-sm border-2 border-white transition-colors shadow-lg shadow-purple-500/30
                       disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-purple-600"
          >
            🚀 Publicar anúncio
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}
