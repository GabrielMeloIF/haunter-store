import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import NavBar from "@/Components/Navbar/NavBar";
import Link from "next/link";
import { Icon } from "@iconify/react";

// ===== BANCO DE DADOS SIMULADO =====
const notificacoes = [
  {
    id: 1,
    usuario: "Kauan",
    mensagem: "Ola sou o kauan, gostaria de negociar o produto...",
    hora: "2026-03-19T14:32:00",
  },
  {
    id: 2,
    usuario: "Mariana",
    mensagem: "Ainda está disponível? Tenho interesse no item...",
    hora: "2026-03-19T09:15:00",
  },
];
// ===================================

function formatarHora(isoString: string) {
  const data = new Date(isoString);
  const agora = new Date();
  const diffMs = agora.getTime() - data.getTime();
  const diffMin = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffMin / 60);
  const diffDias = Math.floor(diffH / 24);

  if (diffMin < 1) return "agora";
  if (diffMin < 60) return `${diffMin} min atrás`;
  if (diffH < 24) return `${diffH}h atrás`;
  if (diffDias === 1) return "ontem";
  return data.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit" });
}

export default function Notificacao() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavBar />

      <main className="flex-1 px-4">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold text-white mt-10">Notificações</h1>
        </div>

        <div className="flex flex-col items-center gap-4 mt-10 w-full max-w-3xl mx-auto">
          {notificacoes.map((n) => (
            <div
              key={n.id}
              className="flex w-full items-center bg-white rounded-2xl shadow-lg shadow-gray-700 transition-transform duration-300 hover:scale-[1.01] px-4 py-3 gap-3"
            >
              {/* Ícone + Nome */}
              <div className="flex items-center gap-2   ">
                <div className="bg-gray-300 rounded-full w-11 h-11 flex items-center justify-center ">
                  <Icon icon="heroicons:user" className="text-xl text-white" />
                </div>
                <span className="text-gray-800 font-bold text-sm whitespace-nowrap">
                  {n.usuario}
                </span>
              </div>
              {/* Divisor */}
              <div className="w-px h-8 bg-gray-200 " />
              {/* Mensagem + Hora */}
              <div className="flex flex-col flex-1 min-w-0">
                <p className="text-gray-600 truncate text-sm">{n.mensagem}</p>
                <span className="text-gray-400 text-xs mt-0.5">
                  {formatarHora(n.hora)}
                </span>
              </div>
              {/* Botão */}
              <Link
                href="/chat"
                className="bg-[#A636E9] hover:bg-[#430883] transition duration-300 text-white font-bold py-2 px-4 rounded text-sm inline-block"
              >
                Responder
              </Link>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}
