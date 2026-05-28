import Image from "next/image";
import Link from "next/link";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useRef } from "react";
import { perifericos, games, Produto } from "../../produtos/index";

const CardItem = ({
  produto,
  favoritos,
  toggleFavorito,
}: {
  produto: Produto;
  favoritos: number[];
  toggleFavorito: (id: number) => void;
}) => (
  <div className="rounded-lg shadow-md p-4 border-2 border-white w-80 flex-shrink-0 transition-transform duration-300 hover:scale-105">
    <div className="relative">
      <FaStar
        onClick={() => toggleFavorito(produto.id)}
        className={`absolute top-2 right-2 text-2xl cursor-pointer z-10 ${
          favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"
        }`}
      />
      <Image src={produto.imagem} alt={produto.nome} width={300} height={200} />
    </div>
    <h2 className="text-white text-xl font-bold mb-2 mt-5">{produto.nome}</h2>
    <p className="text-white">{produto.descricao}</p>
    <div className="flex gap-8 items-center mt-2">
      <p className="text-white font-bold text-xl">{produto.preco}</p>
      <Link
        href="/comprar"
        className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]"
      >
        Comprar
      </Link>
    </div>
  </div>
);

const Carrossel = ({
  produtos,
  favoritos,
  toggleFavorito,
}: {
  produtos: Produto[];
  favoritos: number[];
  toggleFavorito: (id: number) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (direcao: "esquerda" | "direita") => {
    if (!ref.current) return;
    const largura = ref.current.offsetWidth;
    ref.current.scrollBy({
      left: direcao === "direita" ? largura : -largura,
      behavior: "smooth",
    });
  };

  return (
    <div className="relative w-full px-6">
      {/* Botão esquerda */}
      <button
        onClick={() => scroll("esquerda")}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#A636E9] hover:bg-[#430883] text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Anterior"
      >
        <FaChevronLeft />
      </button>

      {/* Faixa rolável */}
      <div
        ref={ref}
        className="flex gap-6 overflow-x-auto scroll-smooth px-10 pb-4
                   [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {produtos.map((produto) => (
          <CardItem
            key={produto.id}
            produto={produto}
            favoritos={favoritos}
            toggleFavorito={toggleFavorito}
          />
        ))}
      </div>

      {/* Botão direita */}
      <button
        onClick={() => scroll("direita")}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#A636E9] hover:bg-[#430883] text-white p-3 rounded-full shadow-lg transition-colors duration-200"
        aria-label="Próximo"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default function Cards() {
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const salvo = localStorage.getItem("favoritos");
    return salvo ? JSON.parse(salvo) : [];
  });

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  return (
    <div className="flex flex-col items-center gap-10 py-8">
      <h2 className="text-white font-bold text-3xl self-start px-6">Periféricos</h2>
      <Carrossel
        produtos={perifericos}
        favoritos={favoritos}
        toggleFavorito={toggleFavorito}
      />

      <h2 className="text-white font-bold text-3xl self-start px-6">Jogos</h2>
      <Carrossel
        produtos={games}
        favoritos={favoritos}
        toggleFavorito={toggleFavorito}
      />
    </div>
  );
}