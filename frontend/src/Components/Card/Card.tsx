import Image from "next/image";
import Mouse from "../../../public/mouse 1.png";
import Teclado from "../../../public/teclado 1.png";
import Headset from "../../../public/headset 1.png";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

export default function Cards() {
  const produtos = [
    {
      id: 1,
      nome: "Mouse Gamer",
      descricao: "Mouse RGB 6400 DPI",
      imagem: Mouse,
      preco: "R$ 120",
    },
    {
      id: 2,
      nome: "Teclado Mecânico",
      descricao: "Switch Blue",
      imagem: Teclado,
      preco: "R$ 350",
    },
    {
      id: 3,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 4,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 5,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 6,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    }, {
      id: 1,
      nome: "Mouse Gamer",
      descricao: "Mouse RGB 6400 DPI",
      imagem: Mouse,
      preco: "R$ 120",
    },
    {
      id: 2,
      nome: "Teclado Mecânico",
      descricao: "Switch Blue",
      imagem: Teclado,
      preco: "R$ 350",
    },
    {
      id: 3,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 4,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 5,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
    {
      id: 6,
      nome: "Headset Gamer",
      descricao: "Som Surround",
      imagem: Headset,
      preco: "R$ 250",
    },
  ];

  const [favoritos, setFavoritos] = useState<number[]>([]);

  return (
    <div className="flex justify-center">
      <div className="grid grid-cols-3 justify-center gap-50 p-6">
        {produtos.map((produto) => (
          <div
            key={produto.id}
            className="rounded-lg shadow-md p-4 border-2 border-white w-80 transition-transform duration-300 hover:scale-105"
          >

            {/* container da imagem */}
            <div className="relative">
              <FaStar
                onClick={() => {
                  if (favoritos.includes(produto.id)) {
                    setFavoritos(favoritos.filter((id) => id !== produto.id));
                  } else {
                    setFavoritos([...favoritos, produto.id]);
                  }
                }}
                className={`absolute top-2 right-2 text-2xl cursor-pointer ${favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"}`}
              />

              <Image
                src={produto.imagem}
                alt={produto.nome}
                width={300}
                height={200}
              />
            </div>

            <h2 className="text-white text-xl font-bold mb-2 mt-5">
              {produto.nome}
            </h2>

            <p className="text-white">{produto.descricao}</p>

            <div className="flex gap-30">
              <p className="text-white font-bold mt-2 text-xl">
                {produto.preco}
              </p>
              <button className="mt-4 bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883] ">
                Comprar
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
