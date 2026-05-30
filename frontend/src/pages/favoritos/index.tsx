import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/Components/Header/Header";

import Footer from "@/Components/Footer/Footer";
import { todosProdutos, Produto } from "../../produtos";

export default function Favoritos() {
  const [produtosFavoritos, setProdutosFavoritos] = useState<Produto[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("favoritos");
    const ids: number[] = salvo ? JSON.parse(salvo) : [];
    setProdutosFavoritos(todosProdutos.filter((p) => ids.includes(p.id)));
  }, []);

  const removerFavorito = (id: number) => {
    const novos = produtosFavoritos.filter((p) => p.id !== id);
    setProdutosFavoritos(novos);
    localStorage.setItem("favoritos", JSON.stringify(novos.map((p) => p.id)));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
  
      <main className="flex-1">
        <h1 className="flex justify-center text-white text-3xl font-bold mt-10">
          Favoritos
        </h1>

        {produtosFavoritos.length === 0 ? (
          <p className="text-white text-center mt-10 text-lg">
            Nenhum favorito ainda.
          </p>
        ) : (
          <div className="grid grid-cols-3 gap-10 p-10">
            {produtosFavoritos.map((produto) => (
              <div
                key={produto.id}
                className="rounded-lg shadow-md p-4 border-2 border-white w-80"
              >
                <Image
                  src={produto.imagem}
                  alt={produto.nome}
                  width={300}
                  height={200}
                />
                <h2 className="text-white text-xl font-bold mt-4">
                  {produto.nome}
                </h2>
                <p className="text-white">{produto.descricao}</p>
                <p className="text-white font-bold text-xl mt-2">
                  {produto.preco}
                </p>
                <div className="flex gap-8">
                  <button
                    onClick={() => removerFavorito(produto.id)}
                    className="mt-4 bg-red-600 text-white  py-2 rounded hover:bg-red-800 w-40"
                  >
                    Remover dos favoritos
                  </button>
                  <div className="flex gap-30 items-center mt-4">
                    <button className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]">
                      Comprar
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
