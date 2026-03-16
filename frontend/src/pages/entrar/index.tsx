import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import { MdOutlineMail } from "react-icons/md";

export default function Entrar() {
  return (
    <div className="flex flex-col min-h-screen ">
      <Header />
      <NavBar />

      <main className="flex-1 flex items-center justify-center px-4 py-16 ">
        <div className="w-full max-w-md">

          {/* Card principal */}
          <div className="bg-white/5 rounded-2xl p-15">

            {/* Cabeçalho */}
            <div className="mb-8 text-center">
              <h1 className="text-2xl font-bold text-white tracking-tight">Preencha os campos</h1>
            </div>

            {/* Formulário */}
            <div className="flex flex-col gap-5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-medium text-white/50 uppercase tracking-widest"><MdOutlineMail /></span>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-[#A636E9] focus:bg-white/8 transition-all"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-medium text-white/50 uppercase tracking-widest">Senha</label> 
                  <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Esqueceu a senha?</a>
                </div>
                <input
                  type="password"
                  placeholder="••••••••"
                  className="bg-white/5 border border-white/10 text-white placeholder:text-white/20 rounded-xl px-4 py-3 text-sm outline-none focus:border-indigo-500/60 transition-all"
                />
              </div>

              <button className="mt-2 w-full bg-indigo-600 hover:bg-indigo-500 active:scale-[0.98] text-white font-semibold py-3 rounded-xl transition-all text-sm tracking-wide">
                Entrar
              </button>
            </div>

            {/* Rodapé do card */}
            <p className="text-center text-white/30 text-sm mt-6">
              Não tem uma conta?{" "}
              <a href="#" className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium">
                Cadastre-se
              </a>
            </p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}