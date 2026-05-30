import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { useProdutos } from "@/context/ProdutosContext";
import { Produto } from "@/context/ProdutosContext";

export default function Cards() {
  const { produtos, loading } = useProdutos();
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const salvo = localStorage.getItem("favoritos");
    return salvo ? JSON.parse(salvo) : [];
  });

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const CardItem = ({ produto }: { produto: Produto }) => (
    <div className="rounded-lg shadow-md p-4 border-2 border-white w-80 transition-transform duration-300 hover:scale-105">
      <div className="relative">
        <FaStar
          onClick={() => toggleFavorito(produto.id)}
          className={`absolute top-2 right-2 text-2xl cursor-pointer ${
            favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"
          }`}
        />
        <Image
          src={produto.imagem_url || "/mouse 1.png"}
          alt={produto.nome}
          width={300}
          height={200}
          onError={(e) => {
            (e.target as HTMLImageElement).src = "/mouse 1.png";
          }}
        />
      </div>
      <h2 className="text-white text-xl font-bold mb-2 mt-5">{produto.nome}</h2>
      <p className="text-white">{produto.descricao}</p>
      <div className="flex gap-30 items-center mt-2">
        <p className="text-white font-bold text-xl">R$ {produto.preco?.toFixed(2).replace(".", ",")}</p>
        <Link href={`/comprar?id=${produto.id}`} className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]">
          Comprar
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return <div className="text-white text-center py-8">Carregando produtos...</div>;
  }

  const perifericos = produtos.filter((p) => p.categoria?.nome_categoria === "Periféricos");
  const jogos = produtos.filter((p) => p.categoria?.nome_categoria === "Jogos");

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      {perifericos.length > 0 && (
        <>
          <h2 className="text-white font-bold text-3xl self-start px-6">Periféricos</h2>
          <div className="grid grid-cols-3 gap-30 p-6">
            {perifericos.map((produto) => <CardItem key={produto.id} produto={produto} />)}
          </div>
        </>
      )}

      {jogos.length > 0 && (
        <>
          <h2 className="text-white font-bold text-3xl self-start px-6">Jogos</h2>
          <div className="grid grid-cols-3 gap-30 p-6">
            {jogos.map((produto) => <CardItem key={produto.id} produto={produto} />)}
          </div>
        </>
      )}

      {produtos.length === 0 && !loading && (
        <p className="text-white text-center py-8">Nenhum produto disponível</p>
      )}
    </div>
  );
}