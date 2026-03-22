import Logo from "../../../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function Entrar() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">

      {/* LADO ESQUERDO (BANNER) */}
      <div className="flex items-center justify-center bg-[#303030]">
        <Image
          src={Logo}
          alt="Banner"
          className="w-30 h-auto object-contain"
        />
      </div>

      {/* LADO DIREITO (FORMULÁRIO) */}
      <div className="flex flex-col min-h-screen">

        {/* FORM */}
        <main className="flex-1 flex items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">

            <div className="bg-white/5 rounded-2xl p-10">

              {/* Cabeçalho */}
              <div className="mb-8 text-center">
                <h1 className="text-2xl font-bold text-white tracking-tight">
                  Entrar
                </h1>
              </div>

              {/* Formulário */}
              <div className="flex flex-col gap-5">

                <div className="flex flex-col gap-1.5">
                  <Icon icon="material-symbols:mail-outline-rounded" className="text-white" width="24" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#A636E9] focus:bg-white/8 transition-all"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <div className="flex justify-between items-center">
                    <Icon icon="material-symbols:lock-outline" className="text-white" width="24" />
                    <a href="#" className="text-xs text-[#A636E9] hover:text-[#430883] transition-colors">
                      Esqueceu a senha?
                    </a>
                  </div>
                  <input
                    type="password"
                    placeholder="••••••••"
                    className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#A636E9] focus:bg-white/8 transition-all"
                  />
                </div>

                <button className="mt-2 w-full bg-[#A636E9] hover:bg-[#430883] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-wide">
                  Entrar
                </button>
              </div>

              {/* Rodapé */}
              <p className="text-center text-white/30 text-sm mt-6">
                Não tem uma conta?{" "}
                <Link href="/cadastro" className="text-[#A636E9] hover:text-[#430883] transition-colors font-medium">
                  Cadastre-se
                </Link>
              </p>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}