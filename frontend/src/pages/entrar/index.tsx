"use client"

import Image from "next/image"
import { useState } from "react"
import { Camera, Heart, MessageCircle, Share2, Eye, EyeOff } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation" 
import { Icon } from "@iconify/react";

function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      {...props}
      className="w-full h-12 px-4 rounded-lg border border-gray-300 bg-white/50 focus:outline-none "
    />
  )
}

function Button(props: React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...props}
      className="w-full h-12 rounded-lg bg-purple-600 text-white font-semibold hover:opacity-90"
    />
  )
}

type AuthMode = "login" | "register"

export default function AuthPage() {
  const [mode, setMode] = useState<AuthMode>("login")
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter() 

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    username: "",
  })

  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const user = {
      name: formData.name || "Usuário",
      email: formData.email,
      uid: "123",
    }

    localStorage.setItem("user", JSON.stringify(user))

    router.push("/") 
  }

  const toggleMode = () => {
    setMode(mode === "login" ? "register" : "login")
    setFormData({ email: "", password: "", name: "", username: "" })
  }

  return (
    <div className="grid lg:grid-cols-2 min-h-screen">

      {/* LEFT */}
      <div className="relative hidden lg:flex flex-col overflow-hidden">
        <Image
          src="/bannerEntrar.png"
          alt="Banner"
          fill
          className="object-cover opacity-70 "
        />

        <div className="absolute inset-0 to-purple-700" />

        <div className="relative z-10 flex flex-col justify-between h-full p-10 text-white">
          
          <div className="flex items-center gap-3">
            <Link href="/" className="text-lg font-bold">Haunter Store</Link>
          </div>

          <div className="flex flex-col gap-6">
            <h2 className="text-4xl font-bold">
              Melhores Produtos
            </h2>

            <div className="flex flex-col gap-4 mt-4">
              <div className="flex items-center gap-4">
                <Heart />
                <p>Melhores preços</p>
              </div>

              <div className="flex items-center gap-4">
                <MessageCircle />
                <p>Qualidade</p>
              </div>

              <div className="flex items-center gap-4">
                <Share2 />
                <p>Eficiência</p>
              </div>
            </div>
          </div>

          <div className="text-sm opacity-70"></div>
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
              {mode === "login" ? "Entre na sua conta" : "Crie sua conta"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            {mode === "register" && (
              <>
                <Input
                  placeholder="Nome completo"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
                <Input
                  placeholder="Usuário"
                  value={formData.username}
                  onChange={(e) =>
                    setFormData({ ...formData, username: e.target.value })
                  }
                />
              </>
            )}

            <Input
              type="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
            />

            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Senha"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2"
              >
                {showPassword ? <EyeOff /> : <Eye />}
              </button>
            </div>

            <Button type="submit">
              {mode === "login" ? "Entrar" : "Cadastrar"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm">
            {mode === "login" ? "Não tem conta?" : "Já tem conta?"}
            <button onClick={toggleMode} className="ml-2 text-purple-600">
              {mode === "login" ? "Criar" : "Entrar"}
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}