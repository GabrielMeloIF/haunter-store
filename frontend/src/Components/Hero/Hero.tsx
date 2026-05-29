const STATS = [
  { value: '67M+', label: 'Usuários ativos' },
  { value: 'R$0',  label: 'Para anunciar'  },
  { value: '3min', label: 'Para publicar'  },
]

export default function Hero() {
  return (
    <div className="bg-gradient-to-br from-purple-700  text-white py-10 px-4">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center gap-6">
      

        {/* copy */}
        <div className="flex-1">
          <p className="text-purple-200 text-sm font-bold uppercase tracking-widest mb-1">
            100% gratuito
          </p>
          <h1 className="text-3xl md:text-4xl font-black leading-tight mb-3">
            Anuncie de graça<br />e venda mais rápido!
          </h1>
          <p className="text-purple-100 text-base font-semibold max-w-md">
            Milhões de compradores estão esperando pelo seu produto.
            Crie seu anúncio em minutos sem pagar nada.
          </p>
        </div>

        {/* stats */}
        <div className="hidden md:flex gap-6 text-center">
          {STATS.map(s => (
            <div key={s.label} className="bg-white/10 rounded-2xl p-5 backdrop-blur-sm">
              <p className="text-3xl font-black">{s.value}</p>
              <p className="text-purple-200 text-xs font-bold mt-1">{s.label}</p>
            </div>
          ))}
        </div>
 
      </div>
    </div>
   
  )
}
