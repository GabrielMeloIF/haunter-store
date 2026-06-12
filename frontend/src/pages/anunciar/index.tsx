import Header from "@/Components/Header/Header";
import Hero from "@/Components/Hero/Hero";
import Footer from "@/Components/Footer/Footer";
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useAds, AdFormData, ContactMethod } from '@/context/AdsContext'
import { useAuth } from '@/context/AuthContext'

const CONTACT_OPTIONS: { id: ContactMethod; label: string }[] = [
  { id: 'chat',     label: 'Chat' },
  { id: 'whatsapp', label: 'WhatsApp' },
  { id: 'phone',    label: 'Telefone' },
]

const CATEGORIAS = [
  { id: 1, nome: 'Periféricos' },
  { id: 2, nome: 'Jogos' },
  { id: 3, nome: 'Consoles' },
  { id: 4, nome: 'PCs' },
]

const INITIAL_FORM: AdFormData = {
  title: '', description: '', price: '', negotiable: false,
  condition: '', cep: '', city: '', contacts: [], photos: [],
  categoriaId: null,
}

export default function Anunciar() {
  const router              = useRouter()
  const fileRef             = useRef<HTMLInputElement>(null)
  const [loadingPhotos, setLoadingPhotos] = useState(false)
  const [loadingCep, setLoadingCep] = useState(false)
  const [publishing, setPublishing]       = useState(false)
  const [erro, setErro]                   = useState<string | null>(null)
  const [form, setForm]                   = useState<AdFormData>(INITIAL_FORM)

  const { publishAd } = useAds()
  const { usuario }   = useAuth()

  function handleUpdate<K extends keyof AdFormData>(key: K, value: AdFormData[K]) {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  async function handleAddPhotos(files: FileList) {
    const remaining = 20 - form.photos.length
    if (remaining <= 0) return
    setLoadingPhotos(true)
    const toProcess = Array.from(files).slice(0, remaining)
    try {
      const base64List = await Promise.all(
        toProcess.map(file =>
          new Promise<string>((resolve, reject) => {
            const reader = new FileReader()
            reader.onload  = () => resolve(reader.result as string)
            reader.onerror = () => reject(new Error('Falha ao ler imagem'))
            reader.readAsDataURL(file)
          })
        )
      )
      setForm(prev => ({ ...prev, photos: [...prev.photos, ...base64List].slice(0, 20) }))
    } finally {
      setLoadingPhotos(false)
    }
  }

  function handleRemovePhoto(url: string) {
    setForm(prev => ({ ...prev, photos: prev.photos.filter(p => p !== url) }))
  }

  async function handleMaskCep(raw: string) {
  const digits = raw.replace(/\D/g, '').slice(0, 8)
  const masked = digits.length > 5 ? `${digits.slice(0, 5)}-${digits.slice(5)}` : digits
  setForm(prev => ({ ...prev, cep: masked }))

  if (digits.length === 8) {
    try {
      setLoadingCep(true)
      const res  = await fetch(`https://viacep.com.br/ws/${digits}/json/`)
      const data = await res.json()
      if (!data.erro) {
        setForm(prev => ({
          ...prev,
          city: `${data.bairro ? data.bairro + ' / ' : ''}${data.localidade} - ${data.uf}`,
        }))
      }
    } catch {
      // silencioso, usuário digita manualmente
    } finally {
      setLoadingCep(false)
    }
  }
}

  function handleToggleContact(method: ContactMethod) {
    setForm(prev => ({
      ...prev,
      contacts: prev.contacts.includes(method)
        ? prev.contacts.filter(c => c !== method)
        : [...prev.contacts, method],
    }))
  }

  async function handlePublish() {
    setErro(null)

    if (!usuario) {
      setErro('Você precisa estar logado para publicar um anúncio.')
      return
    }
    if (!form.title.trim()) {
      setErro('Preencha o título do anúncio.')
      return
    }
    if (!form.price || parseFloat(form.price) <= 0) {
      setErro('Informe um preço válido.')
      return
    }
    if (!form.categoriaId) {
      setErro('Selecione uma categoria.')
      return
    }

    try {
      setPublishing(true)
      await publishAd(form)
      setForm(INITIAL_FORM)
      router.push('/')
    } catch (err: any) {
      setErro(err.message || 'Erro ao publicar anúncio.')
    } finally {
      setPublishing(false)
    }
  }

  return (
    <div>
      <Header />
      <Hero />

      <div className="max-w-7xl mx-auto p-15">

        <div className="border-l-4 border-purple-500 pl-4 mb-6">
          <h2 className="text-xl font-black text-white">Fotos e detalhes do anúncio</h2>
          <p className="text-white text-sm">Anúncios com fotos vendem até 10× mais rápido.</p>
        </div>

        {/* Erro */}
        {erro && (
          <div className="mb-4 bg-red-500/20 border border-red-500 text-red-300 rounded-xl px-4 py-3 text-sm font-semibold">
            {erro}
          </div>
        )}

        {/* Fotos */}
        <div className="mb-6">
          <label className="block text-sm text-white mb-2">
            Fotos <span className="text-brand">(até 20)</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {form.photos.map(url => (
              <div key={url} className="relative rounded-xl overflow-hidden h-28">
                <img src={url} alt="preview" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemovePhoto(url)}
                  className="absolute top-1 right-1 bg-white/80 rounded-full w-5 h-5 text-xs font-black
                             text-gray-600 hover:bg-red-500 hover:text-white flex items-center justify-center"
                >×</button>
              </div>
            ))}

            {form.photos.length < 20 && (
              <label className={`border-2 border-dashed border-purple-400 rounded-xl h-28
                                flex flex-col items-center justify-center cursor-pointer
                                bg-[#1a1a2e] hover:border-brand hover:bg-brand-light transition-colors
                                ${loadingPhotos ? 'opacity-60 pointer-events-none' : ''}`}>
                {loadingPhotos ? (
                  <svg className="w-6 h-6 text-purple-400 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"/>
                  </svg>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-400 mb-1"
                         fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M3 16s1-4 5-4 5 4 5 4M3 16v2a2 2 0 002 2h14a2 2 0 002-2v-2M16 10l-4-4-4 4M12 6v10"/>
                    </svg>
                    <span className="text-xs font-bold text-brand text-white">Adicionar foto</span>
                  </>
                )}
                <input ref={fileRef} type="file" accept="image/*" multiple className="hidden"
                       onChange={e => e.target.files && handleAddPhotos(e.target.files)} />
              </label>
            )}
          </div>
        </div>

        {/* Categoria */}
        <div className="mb-4">
          <label className="block text-sm font-black text-purple-300 mb-1">
            Categoria <span className="text-red-400">*</span>
          </label>
          <select
            value={form.categoriaId ?? ''}
            onChange={e => handleUpdate('categoriaId', e.target.value ? Number(e.target.value) : null)}
            className="w-full border-2 border-purple-500/40 bg-[#1a1a2e] text-white rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"
          >
            <option value="">Selecione uma categoria…</option>
            {CATEGORIAS.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.nome}</option>
            ))}
          </select>
        </div>

        {/* Título */}
        <div className="mb-4">
          <label className="block text-sm font-black text-purple-300 mb-1">
            Título do anúncio <span className="text-red-400">*</span>
          </label>
          <input type="text" maxLength={70} value={form.title}
            placeholder="Ex: iPhone 13 128GB – Preto – Perfeito estado"
            onChange={e => handleUpdate('title', e.target.value)}
            className="w-full border-2 border-purple-500/40 bg-[#1a1a2e] text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"/>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">{form.title.length}/70</span>
          </div>
        </div>

        {/* Descrição */}
        <div className="mb-4">
          <label className="block text-sm font-black text-purple-300 mb-1">
            Descrição <span className="text-red-400">*</span>
          </label>
          <textarea rows={5} maxLength={6000} value={form.description}
            placeholder="Descreva seu produto com detalhes: estado, defeitos, motivo da venda, acessórios incluídos..."
            onChange={e => handleUpdate('description', e.target.value)}
            className="w-full border-2 border-purple-500/40 bg-[#1a1a2e] text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm font-semibold transition resize-none focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"/>
          <div className="flex justify-end mt-1">
            <span className="text-xs text-gray-500">{form.description.length}/6000</span>
          </div>
        </div>

        {/* Preço + Condição */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-sm font-black text-purple-300 mb-1">
              Preço <span className="text-red-400">*</span>
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-400 font-bold text-sm">R$</span>
              <input type="number" min={0} value={form.price} placeholder="0,00"
                onChange={e => handleUpdate('price', e.target.value)}
                className="w-full border-2 border-purple-500/40 bg-[#1a1a2e] text-white placeholder-gray-400 rounded-xl pl-10 pr-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"/>
            </div>
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={form.negotiable}
                onChange={e => handleUpdate('negotiable', e.target.checked)}
                className="accent-purple-500 w-4 h-4"/>
              <span className="text-xs font-bold text-gray-400">Preço negociável</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-black text-purple-300 mb-1">Condição</label>
            <select value={form.condition} onChange={e => handleUpdate('condition', e.target.value)}
              className="w-full border-2 border-purple-500/40 bg-[#1a1a2e] text-white rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20">
              <option value="">Selecione…</option>
              <option>Novo</option>
              <option>Seminovo</option>
              <option>Usado</option>
            </select>
          </div>
        </div>

        {/* Localização */}
        <div className="mb-6">
          <label className="block text-sm font-black text-purple-300 mb-1">
            Localização <span className="text-red-400">*</span>
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <input type="text" placeholder="CEP" maxLength={9} value={form.cep}
              onChange={e => handleMaskCep(e.target.value)}
              className="border-2 border-purple-500/40 bg-[#1a1a2e] text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"/>
            <input type="text" placeholder="Bairro / Cidade" value={form.city}
              onChange={e => handleUpdate('city', e.target.value)}
              className="border-2 border-purple-500/40 bg-[#1a1a2e] text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm font-semibold transition focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/20"/>
          </div>
        </div>

        {/* Contato */}
        <div className="mb-6">
          <label className="block text-sm font-black text-purple-300 mb-2">Forma de contato</label>
          <div className="flex flex-wrap gap-3">
            {CONTACT_OPTIONS.map(opt => {
              const isSelected = form.contacts.includes(opt.id)
              return (
                <label key={opt.id}
                  className={`bg-white flex items-center gap-2 cursor-pointer border-2 rounded-xl px-4 py-2 transition-colors ${
                    isSelected ? 'border-purple-500 text-purple-600' : 'border-purple-500/30 hover:border-purple-400 text-black'
                  }`}>
                  <input type="checkbox" checked={isSelected}
                    onChange={() => handleToggleContact(opt.id)}
                    className="accent-purple-500"/>
                  <span className="text-sm font-bold">{opt.label}</span>
                </label>
              )
            })}
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between mt-8">
          <button
            onClick={() => router.push('/')}
            className="text-purple-400 font-bold px-6 py-3 rounded-full text-sm border-2 border-purple-500/40 bg-[#1a1a2e] scale-100 hover:scale-102 transition-transform"
          >
            ← Voltar
          </button>
          <button
            onClick={handlePublish}
            disabled={publishing}
            className="bg-purple-600 hover:bg-purple-700 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold px-8 py-3 rounded-full text-sm border-2 border-purple-900 transition-colors"
          >
            {publishing ? 'Publicando...' : 'Publicar anúncio →'}
          </button>
        </div>

      </div>
      <Footer />
    </div>
  )
}