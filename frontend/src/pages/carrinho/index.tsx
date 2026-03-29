import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import { todosProdutos, Produto } from "../../produtos";

type ItemCarrinho = Produto & { quantidade: number };

export default function Carrinho() {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("carrinho");
    const ids: number[] = salvo ? JSON.parse(salvo) : [];
    const produtos = todosProdutos
      .filter((p) => ids.includes(p.id))
      .map((p) => ({ ...p, quantidade: ids.filter((id) => id === p.id).length }));
    // remove duplicatas mantendo a quantidade
    const unicos = produtos.filter(
      (p, i, arr) => arr.findIndex((x) => x.id === p.id) === i
    );
    setItens(unicos);
  }, []);

  const removerItem = (id: number) => {
    const novos = itens.filter((p) => p.id !== id);
    setItens(novos);
    const idsParaSalvar = novos.flatMap((p) => Array(p.quantidade).fill(p.id));
    localStorage.setItem("carrinho", JSON.stringify(idsParaSalvar));
  };

  const alterarQuantidade = (id: number, delta: number) => {
    const novos = itens
      .map((p) => p.id === id ? { ...p, quantidade: p.quantidade + delta } : p)
      .filter((p) => p.quantidade > 0);
    setItens(novos);
    const idsParaSalvar = novos.flatMap((p) => Array(p.quantidade).fill(p.id));
    localStorage.setItem("carrinho", JSON.stringify(idsParaSalvar));
  };

  const calcularTotal = () => {
    return itens.reduce((acc, p) => {
      const valor = Number(p.preco.replace("R$", "").replace(".", "").replace(",", ".").trim());
      return acc + valor * p.quantidade;
    }, 0);
  };

  const total = calcularTotal();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavBar />
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
              {itens.map((produto) => (
                <div
                  key={produto.id}
                  className="flex items-center gap-6 rounded-xl border border-white/20 bg-white/5 p-4"
                >
                  <Image
                    src={produto.imagens?.[0] ?? produto.imagem}
                    alt={produto.nome}
                    width={90}
                    height={90}
                    className="rounded-lg object-cover"
                  />
                  <div className="flex-1">
                    <h2 className="text-white text-lg font-bold">{produto.nome}</h2>
                    <p className="text-gray-400 text-sm">{produto.descricao}</p>
                    <p className="text-purple-400 font-bold mt-1">{produto.preco}</p>
                  </div>

                  {/* Quantidade */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => alterarQuantidade(produto.id, -1)}
                      className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                    >
                      −
                    </button>
                    <span className="text-white w-4 text-center">{produto.quantidade}</span>
                    <button
                      onClick={() => alterarQuantidade(produto.id, +1)}
                      className="w-8 h-8 rounded-full border border-white/20 text-white hover:bg-white/10 transition"
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removerItem(produto.id)}
                    className="text-red-400 hover:text-red-600 text-sm transition"
                  >
                    Remover
                  </button>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="w-72 bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
              <h3 className="text-white font-semibold text-lg mb-4">Resumo</h3>
              <div className="space-y-2 mb-4">
                {itens.map((p) => (
                  <div key={p.id} className="flex justify-between text-sm">
                    <span className="text-gray-400">{p.nome} x{p.quantidade}</span>
                    <span className="text-white">
                      R$ {(Number(p.preco.replace("R$", "").replace(".", "").replace(",", ".").trim()) * p.quantidade).toFixed(2).replace(".", ",")}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-white/10 pt-4 flex justify-between font-bold text-lg">
                <span className="text-white">Total</span>
                <span className="text-purple-400">R$ {total.toFixed(2).replace(".", ",")}</span>
              </div>
              <Link
                href={`/finalizar-compra?id=${itens[0]?.id}`}
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