import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { perifericos, games, Produto } from "../../produtos/index";
import NavBar from "../../Components/Navbar/NavBar";
import Carrossel from "@/Components/Carrosel/Carrossel";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function Cards() {
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
        <Image src={produto.imagem} alt={produto.nome} width={300} height={200} />
      </div>
      <h2 className="text-white text-xl font-bold mb-2 mt-5">{produto.nome}</h2>
      <p className="text-white">{produto.descricao}</p>
      <div className="flex gap-30 items-center mt-2">
        <p className="text-white font-bold text-xl">{produto.preco}</p>
        <Link href="/comprar" className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]">
          Comprar
        </Link>
      </div>
    </div>
  );

  return (
    <>
    <Header/>
    <nav>
      <NavBar />
    </nav>
    <Carrossel />
    <div className="flex flex-col items-center gap-10 py-8">
      <h2 className="text-white font-bold text-3xl self-start px-6">Periféricos</h2>
      <div className="grid grid-cols-3 gap-30 p-6">
        {perifericos.map((produto) => <CardItem key={produto.id} produto={produto} />)}
      </div>
    </div>
    </>
  );
}