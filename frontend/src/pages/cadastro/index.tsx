import Logo from "../../../public/logo.png";
import Link from "next/link";
import Image from "next/image";
import { Icon } from "@iconify/react";

export default function Entrar() {
  return (
    <div className="flex flex-col min-h-screen ">
      <div  className="topo bg-[#A636E9] flex items-center gap-6">
        {/* Logo  */}
    <Link href="/"><Image src={Logo} alt="Logo" className="w-13 mx-5 mb-3  mt-2"/></Link>
  
    <h1 className="text-xl text-white ">Haunter store</h1>
     </div>
      <main className="flex-1 flex items-center justify-center px-4 py-16 ">
        <div className="w-full max-w-md">

          {/* Card principal */}
          <div className="bg-white/5 rounded-2xl p-15">

            {/* Cabeçalho */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Cadastrar</h1>
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
                  <Icon icon="material-symbols:lock-outline" className="text-white" width="24" /> 
                <input
                  type="password"
                  placeholder="Senha"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#A636E9] focus:bg-white/8 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                <Icon icon="material-symbols:lock-outline" className="text-white" width="24" />
                </div>
                <input
                  type="password"
                  placeholder="Confirme a senha"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#A636E9] focus:bg-white/8 transition-all"
                />
              </div>

              <button className="mt-2 w-full bg-[#A636E9] hover:bg-[#430883] active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-wide">
               Cadastrar
              </button>
            </div>

            {/* Rodapé do card */}
            <p className="text-center text-white/30 text-sm mt-6">
              Já tem uma conta?{" "}
              <Link href="/entrar" className="text-[#A636E9] hover:text-[#430883] transition-colors font-medium">
                Entrar
              </Link>
            </p>
          </div>
        </div>
      </main>

      
    </div>
  );
}