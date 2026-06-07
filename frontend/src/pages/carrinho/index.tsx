import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";

export default function Carrinho() {
  const { usuario } = useAuth();
  const { itens, loading, atualizarQuantidade, removerItem } = useCarrinho();
  const [totalizando, setTotalizando] = useState(false);

  if (!usuario) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
     
        <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
          <p className="text-white text-lg">Faça login para ver seu carrinho</p>
          <Link href="/entrar" className="text-purple-400 hover:text-purple-300">
            Ir para login
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAlterarQuantidade = async (id_carrinho: number, delta: number) => {
    const item = itens.find((i) => i.id_carrinho === id_carrinho);
    if (!item) return;
    const novaQtd = item.quantidade + delta;
    if (novaQtd <= 0) {
      await handleRemover(id_carrinho);
      return;
    }
    try {
      await atualizarQuantidade(id_carrinho, novaQtd);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleRemover = async (id_carrinho: number) => {
    try {
      await removerItem(id_carrinho);
      toast.success("Item removido");
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const calcularTotal = () => {
    return itens.reduce((acc, item) => {
      const preco = item.produto?.preco || 0;
      return acc + preco * item.quantidade;
    }, 0);
  };

  const total = calcularTotal();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10">
        <h1 className="text-white text-3xl font-bold mb-8">Meu Carrinho</h1>

        {itens.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 gap-4">
            <p className="text-white text-lg">Seu carrinho está vazio.</p>
            <Link href="/" className="bg-[#A636E9] text-white px-6 py-2 rounded hover:bg-[#430883] transition">
              Continuar comprando
            </Link>
          </div>
        ) : (
          <div className="flex gap-8 items-start">
            {/* Lista de itens */}
            <div className="flex-1 flex flex-col gap-4">
              {itens.map((item) => (
                <div
                  key={item.id_carrinho}
                  className="flex items-center gap-6 rounded-xl border border-purple-900 bg-white/5 p-4"
                >
                  <Image
                    src={item.produto?.imagem_url || "/mouse 1.png"}
                    alt={item.produto?.nome || "Produto"}
                    width={90}
                    height={90}
                    className="rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/mouse 1.png";
                    }}
                  />
                  <div className="flex-1">
                    <h2 className="text-white text-lg font-bold">{item.produto?.nome}</h2>
                    <p className="text-gray-400 text-sm">{item.produto?.descricao}</p>
                    <p className="text-purple-400 font-bold mt-1">R$ {item.produto?.preco?.toFixed(2).replace(".", ",")}</p>
                  </div>

                  {/* Quantidade */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => handleAlterarQuantidade(item.id_carrinho, -1)}
                      className="w-8 h-8 rounded-full border border-purple-900 text-white hover:bg-purple-900 transition"
                      disabled={loading}
                    >
                      −
                    </button>
                    <span className="text-white w-4 text-center">{item.quantidade}</span>
                    <button
                      onClick={() => handleAlterarQuantidade(item.id_carrinho, +1)}
                      className="w-8 h-8 rounded-full border border-purple-900 text-white hover:bg-purple-900 transition"
                      disabled={loading}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => handleRemover(item.id_carrinho)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                    disabled={loading}
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="w-72 bg-white/5 border border-purple-900 rounded-2xl p-6 sticky top-6">
              <h3 className="text-white font-semibold text-lg mb-4">Resumo</h3>
              <div className="space-y-2 mb-4">
                {itens.map((item) => (
                  <div key={item.id_carrinho} className="flex justify-between text-sm">
                    <span className="text-gray-400">
                      {item.produto?.nome} x{item.quantidade}
                    </span>
                    <span className="text-white">
                      R$ {(item.produto?.preco * item.quantidade).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-purple-900 pt-4 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-purple-400">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <Link
                href={`/finalizar-compra`}
                className="mt-5 block text-center bg-[#5a10a8] text-white py-3 rounded-lg hover:bg-[#3a0a6a] transition font-semibold"
              >
                Finalizar compra
              </Link>
              <Link href="/" className="mt-3 block text-center text-gray-400 text-sm hover:text-white transition">
                Continuar comprando
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}