'use client'

import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import Link from "next/link";

interface Props { onReset: () => void }

export default function StepSuccess({ onReset }: Props) {
  return (
    <div className="min-h-screen flex flex-col">

      <Header />
      <NavBar />

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md text-center
                        bg-white border-2 border-purple-500
                        rounded-2xl shadow-lg p-8 animate-fadeUp">

          {/* Ícone */}
          <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-purple-500">
            <svg xmlns="http://www.w3.org/2000/svg"
                 className="w-10 h-10 text-purple-600"
                 fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3}
                    d="M5 13l4 4L19 7"/>
            </svg>
          </div>

          {/* Texto */}
          <h2 className="text-2xl font-black text-gray-800 mb-2">
            Anúncio publicado! 🎉
          </h2>

          <p className="text-gray-500 text-sm mb-6">
            Seu anúncio já está no ar. Compradores podem entrar em contato a qualquer momento.
          </p>

          {/* Botões */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={onReset}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold px-8 py-3 rounded-full text-sm border-2 border-white transition-colors shadow-lg shadow-purple-500/30"
        >

            <Link href="/anunciar">
          Criar novo anúncio
            </Link>

        </button>

        <button className="text-purple-400 font-bold px-6 py-3 rounded-full text-sm border-2 border-purple-500/40 bg-white hover:bg-purple-500/10 transition-colors">
            <Link href="/meus-anuncios">
          Ver meus anúncios
            </Link>
        </button>
      </div>

        </div>
      </div>

      <Footer />
    </div>
  )
}