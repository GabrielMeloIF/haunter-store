"use client"

import Image from "next/image"
import { useState } from "react"
import { Heart, MessageCircle, Share2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { toast } from "react-toastify"

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

function Input({ error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={`w-full h-12 px-4 rounded-lg border bg-white/50 focus:outline-none
      ${error ? "border-red-500" : "border-gray-300"}`}
    />
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full h-12 rounded-lg bg-purple-600 text-white font-semibold hover:opacity-90 disabled:opacity-60"
    />
  )
}

type AuthMode = "login" | "register" | "forgot"

export default function AuthPage() {
  const [mode, setMode]               = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const [forgotEmail, setForgotEmail]   = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [senhaTmp, setSenhaTmp]         = useState<string | null>(null)
  const router = useRouter()
  const { login, register, loading } = useAuth()

  const [formData, setFormData] = useState({ identifier: '', password: '', name: '' })
  const [errors, setErrors]     = useState({ identifier: false, password: false, name: false })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors = {
      identifier: !formData.identifier.trim(),
      password:   !formData.password.trim(),
      name:       mode === "register" && !formData.name.trim(),
    }
    setErrors(newErrors)
    if (Object.values(newErrors).some(Boolean)) return

    try {
      if (mode === "register") {
        await register(formData.name, formData.identifier, formData.password, formData.password)
        toast.success("Cadastro realizado com sucesso!")
        router.push("/")
      } else {
        await login(formData.identifier, formData.password)
        toast.success("Login realizado com sucesso!")
        router.push("/")
      }
    } catch (error: any) {
      toast.error(error.message || "Erro ao autenticar")
    }
  }

  async function handleForgot(e: React.FormEvent) {
    e.preventDefault()
    if (!forgotEmail.trim()) return

    try {
      setForgotLoading(true)
      console.log('API_URL:', API_URL)
      const res  = await fetch(`${API_URL}/auth/esqueci-senha`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: forgotEmail }),
      })
      const data = await res.json()
      if (data.senhaTmp) {
        setSenhaTmp(data.senhaTmp)
      } else {
        // email não encontrado — não revela, mostra mensagem genérica
        setSenhaTmp('EMAIL_NAO_ENCONTRADO')
      }
    } catch {
      toast.error('Erro ao processar. Tente novamente.')
    } finally {
      setForgotLoading(false)
    }
  }

  function handleUsarSenha() {
    // Preenche o campo de login com a senha temporária e volta pro login
    setFormData(prev => ({ ...prev, identifier: forgotEmail, password: senhaTmp ?? '' }))
    setMode("login")
    setSenhaTmp(null)
    setForgotEmail('')
  }

  const toggleMode = (next: AuthMode) => {
    setMode(next)
    setFormData({ identifier: '', password: '', name: '' })
    setErrors({ identifier: false, password: false, name: false })
    setForgotEmail('')
    setSenhaTmp(null)
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">

      {/* LEFT */}
      <div className="relative hidden lg:flex flex-col overflow-hidden">
        <Image src="/bannerEntrar.png" alt="Banner" fill className="object-cover opacity-70" />
        <div className="absolute inset-0 to-purple-700" />
        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold">Haunter Store</Link>
          </div>
          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold">Melhores Produtos</h2>
            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4"><Heart /><p>Melhores preços</p></div>
              <div className="flex items-center gap-4"><MessageCircle /><p>Qualidade</p></div>
              <div className="flex items-center gap-4"><Share2 /><p>Eficiência</p></div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-500 to-purple-900 bg-clip-text text-transparent">
              Haunter Store
            </h1>
            <p className="mt-2 text-gray-500 text-sm">
              {mode === "login"    && "Entre com email ou nome de usuário"}
              {mode === "register" && "Crie sua conta"}
              {mode === "forgot"   && "Recuperar senha"}
            </p>
          </div>

          {/* ── FORGOT ── */}
          {mode === "forgot" && (
            <>
              {/* Resultado da busca */}
              {senhaTmp ? (
                <div className="flex flex-col gap-4 text-center">
                  {senhaTmp === 'EMAIL_NAO_ENCONTRADO' ? (
                    <>
                      <p className="text-gray-500 text-sm">
                        Nenhuma conta encontrada com esse email.
                      </p>
                      <button onClick={() => setSenhaTmp(null)}
                        className="text-purple-600 text-sm font-semibold">
                        Tentar outro email
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto">
                        <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-purple-600"
                          fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                            d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"/>
                        </svg>
                      </div>
                      <p className="text-gray-600 text-sm">
                        Sua senha temporária é:
                      </p>
                      <div className="bg-purple-50 border-2 border-purple-300 rounded-xl py-3 px-4">
                        <span className="text-2xl font-black text-purple-700 tracking-widest">
                          {senhaTmp}
                        </span>
                      </div>
                      <p className="text-gray-400 text-xs">
                        Anote essa senha. Após entrar, recomendamos alterá-la no seu perfil.
                      </p>
                      <Button onClick={handleUsarSenha}>
                        Entrar com essa senha →
                      </Button>
                    </>
                  )}
                  <button onClick={() => toggleMode("login")}
                    className="text-sm text-gray-400 hover:text-purple-500 transition-colors mt-1">
                    ← Voltar ao login
                  </button>
                </div>
              ) : (
                /* Formulário de email */
                <form onSubmit={handleForgot} className="flex flex-col gap-4">
                  <Input
                    type="email"
                    placeholder="Seu e-mail cadastrado"
                    value={forgotEmail}
                    onChange={e => setForgotEmail(e.target.value)}
                  />
                  <Button type="submit" disabled={forgotLoading}>
                    {forgotLoading ? 'Buscando...' : 'Gerar senha temporária'}
                  </Button>
                  <button type="button" onClick={() => toggleMode("login")}
                    className="text-sm text-gray-400 hover:text-purple-500 transition-colors">
                    ← Voltar ao login
                  </button>
                </form>
              )}
            </>
          )}

          {/* ── LOGIN / REGISTER ── */}
          {mode !== "forgot" && (
            <>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                {mode === "register" && (
                  <Input
                    placeholder="Nome completo"
                    value={formData.name}
                    error={errors.name}
                    onChange={e => {
                      setFormData({ ...formData, name: e.target.value })
                      if (errors.name) setErrors({ ...errors, name: false })
                    }}
                  />
                )}

                <Input
                  type="text"
                  placeholder="E-mail"
                  value={formData.identifier}
                  error={errors.identifier}
                  onChange={e => {
                    setFormData({ ...formData, identifier: e.target.value })
                    if (errors.identifier) setErrors({ ...errors, identifier: false })
                  }}
                />

                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="Senha"
                    value={formData.password}
                    error={errors.password}
                    onChange={e => {
                      setFormData({ ...formData, password: e.target.value })
                      if (errors.password) setErrors({ ...errors, password: false })
                    }}
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2">
                    {showPassword ? <EyeOff /> : <Eye />}
                  </button>
                </div>

                {mode === "login" && (
                  <div className="flex justify-end -mt-2">
                    <button type="button" onClick={() => toggleMode("forgot")}
                      className="text-xs text-purple-500 hover:underline">
                      Esqueci minha senha
                    </button>
                  </div>
                )}

                <Button type="submit" disabled={loading}>
                  {loading ? "Carregando..." : mode === "login" ? "Entrar" : "Cadastrar"}
                </Button>
              </form>

              <p className="mt-6 text-center text-sm text-white">
                {mode === "login" ? "Não tem conta?" : "Já tem conta?"}
                <button onClick={() => toggleMode(mode === "login" ? "register" : "login")}
                  className="ml-2 text-purple-600">
                  {mode === "login" ? "Criar" : "Entrar"}
                </button>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  )
}