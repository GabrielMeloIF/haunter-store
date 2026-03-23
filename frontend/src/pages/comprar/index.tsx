import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";

const produtos = [
  {
    id: 1,
    nome: "Mouse Fortrek Spider",
    descricao: "Eleve sua experiência nos jogos e no dia a dia com o Mouse Fortrek Spider. Com um design moderno e agressivo, iluminação em LED vermelho e acabamento ergonômico, ele foi desenvolvido para oferecer conforto e alta performance durante longas horas de uso.",
    preco: "R$ 79,00",
    imagem: "/mouse 1.png",
    comentario: "Ótimo mouse para jogos, confortável e com boa precisão. A iluminação em LED é um bônus visual que eu adoro!"
  },
];
export default function Comprar() {
  const [rating, setRating] = useState(0);

  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvo = localStorage.getItem("favoritos");
      if (salvo) setFavoritos(JSON.parse(salvo));
    }
  }, []);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const produto = produtos[0];
  return (
    <>
      <Header />
      <NavBar />
      <div className="flex">
        <div className="flex flex-col p-20">
          <Image src="/mouse 1.png" alt="Mouse Gamer" width={400} height={300} />
          <div className="mt-5 flex gap-8">
            <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50} />
            <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50} />
            <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50} />
          </div>
        </div>

        {/* Detalhes do produto */}
        <div className="flex flex-col p-20 rounded-lg h-100 w-200 mt-20 bg-[#d9d9d9]/20">
          <div className="flex items-center gap-63 mb-5">
            <h1 className="text-2xl font-bold text-white -mt-8 mb-3">
              {produtos[0].nome}
            </h1>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl -mt-8 ${star <= rating ? "text-yellow-400" : "text-black"
                    }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <p className="text-lg mt-2 text-white">{produtos[0].descricao}</p>
          <p className="text-3xl font-bold mt-4 text-white">{produtos[0].preco}</p>
          <div className="flex gap-4 mt-6">
            <Link href="/carrinho" className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4">
              Adicionar ao Carrinho
            </Link>
            <Link href="/comprar" className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4">
              Comprar Agora
            </Link>
          </div>
        </div>
      </div>
      <div className="flex justify-center gap-60 -mt-40 mb-39">
        <div className="flex flex-col items-center cursor-pointer">
          <FaStar
            onClick={() => toggleFavorito(produto.id)}
            className={`text-3xl ${favoritos.includes(produto.id) ? "text-black" : "text-yellow-400"}`}
          />
          <span className="text-white mt-1 text-sm">Favoritar</span>
        </div>
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            alert("Link copiado!");
          }}
          className="flex flex-col items-center text-purple-600 px-4 py-2 rounded hover:text-purple-700"
        >
          <Icon icon="typcn:arrow-back" width={40} className="-mt-4" />
          <span className="text-white">Compartilhar</span>
        </button>
      </div>
      <Footer />
    </>
  );
}