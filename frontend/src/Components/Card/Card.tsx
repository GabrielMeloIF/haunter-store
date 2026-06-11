import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useProdutos, Produto } from "@/context/ProdutosContext";
import { useAuth } from "@/context/AuthContext";
import { produtosAPI } from "@/services/api";

export default function Cards() {
  const { usuario } = useAuth();

  const { produtos, loading, carregarProdutos } = useProdutos();

  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];

    const salvo = localStorage.getItem("favoritos");
    return salvo ? JSON.parse(salvo) : [];
  });

  const [produtoExcluir, setProdutoExcluir] = useState<number | null>(null);

  const confirmarDelete = async () => {
    if (!produtoExcluir) return;

    try {
      await produtosAPI.delete(produtoExcluir);

      await carregarProdutos();

      setProdutoExcluir(null);
    } catch (error) {
      console.error(error);
      alert("Erro ao excluir produto.");
    }
  };

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const CardItem = ({ produto }: { produto: Produto }) => (
    <div className="rounded-lg shadow-md p-4 border-2 border-purple-900 w-80 h-[440px] flex flex-col transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <FaStar
          onClick={() => toggleFavorito(produto.id)}
          className={`absolute top-2 right-2 text-2xl cursor-pointer z-10 ${
            favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"
          }`}
        />

        <div className="relative w-full h-56">
          <Image
            src={
              produto.imagem_url ||
              (produto.imagens as string[])?.[0] ||
              "/mouse 1.png"
            }
            alt={produto.nome}
            fill
            className="object-contain rounded"
          />
        </div>
      </div>

      <h2 className="text-white text-xl font-bold mb-2 mt-5">{produto.nome}</h2>

      <p className="text-white flex-grow">{produto.descricao}</p>

      <div className="mt-auto flex justify-between items-center">
        <p className="text-white font-bold text-xl">
          R$ {produto.preco?.toFixed(2).replace(".", ",")}
        </p>

        {usuario?.tipo === "ADMIN" ||
        (usuario as any)?.tipo_usuario === "ADMIN" ? (
          <div className="flex gap-2">
            <Link
               href={`/admin/produtos/editar/${produto.id}`}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:opacity-90"
            >
              Editar
            </Link>

            <button
              onClick={() => setProdutoExcluir(produto.id)}
              className="bg-red-600 text-white px-4 py-2 rounded hover:opacity-90"
            >
              Excluir
            </button>
          </div>
        ) : (
          <Link
            href={`/comprar?id=${produto.id}`}
            className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]"
          >
            Comprar
          </Link>
        )}
      </div>
      {produtoExcluir && (
  <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
    <div className="bg-[#161622] border border-purple-700 rounded-xl p-6 w-[400px]">
      <h2 className="text-white text-xl font-bold mb-3">
        Excluir produto
      </h2>

      <p className="text-gray-300 mb-6">
        Tem certeza que deseja excluir este produto?
        Esta ação não poderá ser desfeita.
      </p>

      <div className="flex justify-end gap-3">
        <button
          onClick={() => setProdutoExcluir(null)}
          className="px-4 py-2 rounded bg-gray-600 text-white"
        >
          Cancelar
        </button>

        <button
          onClick={confirmarDelete}
          className="px-4 py-2 rounded bg-red-600 text-white"
        >
          Excluir
        </button>
      </div>
    </div>
  </div>
)}
    </div>
  );

  if (loading) {
    return (
      <div className="text-white text-center py-8">Carregando produtos...</div>
    );
  }

  const perifericos = produtos.filter(
    (p) => p.categoria?.nome_categoria === "Periféricos",
  );

  const jogos = produtos.filter((p) => p.categoria?.nome_categoria === "Jogos");

  const consoles = produtos.filter(
    (p) => p.categoria?.nome_categoria === "Consoles",
  );

  const pcs = produtos.filter((p) => p.categoria?.nome_categoria === "PCs");

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      {perifericos.length > 0 && (
        <>
          <div className="w-full px-6">
            <div className="relative inline-block">
              <h2 className=" bg-purple-700 text-white font-bold text-2xl px-8 py-3 pr-14 ">
                Periféricos
              </h2>

              <div className=" absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-[#0f0f1a] " />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-30 p-6">
            {perifericos.map((produto) => (
              <CardItem key={produto.id} produto={produto} />
            ))}
          </div>
        </>
      )}

      {jogos.length > 0 && (
        <>
          <div className="w-full px-6">
            <div className="relative inline-block">
              <h2 className=" bg-purple-700 text-white font-bold text-2xl px-8 py-3 pr-14 ">
                Jogos
              </h2>

              <div className=" absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-[#0f0f1a] " />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-30 p-6">
            {jogos.map((produto) => (
              <CardItem key={produto.id} produto={produto} />
            ))}
          </div>
        </>
      )}

      {consoles.length > 0 && (
        <>
          <div className="w-full px-6">
            <div className="relative inline-block">
              <h2 className=" bg-purple-700 text-white font-bold text-2xl px-8 py-3 pr-14 ">
                Consoles
              </h2>

              <div className=" absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-[#0f0f1a] " />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-30 p-6">
            {consoles.map((produto) => (
              <CardItem key={produto.id} produto={produto} />
            ))}
          </div>
        </>
      )}

      {pcs.length > 0 && (
        <>
          <div className="w-full px-6">
            <div className="relative inline-block">
              <h2 className=" bg-purple-700 text-white font-bold text-2xl px-8 py-3 pr-14 ">
                PCs
              </h2>

              <div className=" absolute top-0 right-0 w-0 h-0 border-l-[30px] border-l-transparent border-t-[30px] border-t-[#0f0f1a] " />
            </div>
          </div>
          <div className="grid grid-cols-4 gap-30 p-6">
            {pcs.map((produto) => (
              <CardItem key={produto.id} produto={produto} />
            ))}
          </div>
        </>
      )}

      {produtos.length === 0 && !loading && (
        <p className="text-white text-center py-8">Nenhum produto disponível</p>
      )}
    </div>
  );
}
