"use client";

import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";

import "swiper/css";

import {
  perifericos,
  games,
  consoles,
  pcs,
  Produto,
} from "../../produtos/index";

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

  const CardItem = ({ produto }: { produto: Produto }) => (
    <div className="w-[270px] mt-4 mb-4 rounded-2xl shadow-md p-4 border-2 border-white bg-[#111] transition-transform duration-300 hover:scale-105">
      
      <div className="relative overflow-hidden rounded-2xl">
        
        <FaStar
          onClick={() => toggleFavorito(produto.id)}
          className={`absolute top-3 right-3 z-10 text-xl cursor-pointer ${
            favoritos.includes(produto.id)
              ? "text-yellow-400"
              : "text-white"
          }`}
        />

        <Image
          src={produto.imagem}
          alt={produto.nome}
          width={270}
          height={200}
          className="h-[200px] w-full object-cover rounded-2xl"
        />
      </div>

      <h2 className="text-white text-xl font-bold mt-4">
        {produto.nome}
      </h2>

      <p className="text-gray-300 text-sm mt-2 line-clamp-2">
        {produto.descricao}
      </p>

      <div className="flex items-center justify-between mt-5">
        
        <p className="text-white font-bold text-xl">
          {produto.preco}
        </p>

        <Link
          href="/comprar"
          className="bg-[#A636E9] text-white px-4 py-2 text-sm rounded-xl hover:bg-[#430883] transition"
        >
          Comprar
        </Link>
      </div>
    </div>
  );

  const CategoriaSwiper = ({
    titulo,
    produtos,
  }: {
    titulo: string;
    produtos: Produto[];
  }) => (
    <div>
      <h2 className="text-white font-bold text-3xl px-6 mb-8">
        {titulo}
      </h2>

      <div className="px-6">
        <Swiper
          slidesPerView={5}
          spaceBetween={20}
          loop={true}
          breakpoints={{
            1200: { slidesPerView: 5 },
            900: { slidesPerView: 3 },
            600: { slidesPerView: 2 },
            0: { slidesPerView: 1 },
          }}
        >
          {produtos.map((produto) => (
            <SwiperSlide key={produto.id}>
              <CardItem produto={produto} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-20 py-8">

      <CategoriaSwiper
        titulo="Periféricos"
        produtos={perifericos}
      />

      <CategoriaSwiper
        titulo="Jogos"
        produtos={games}
      />

      <CategoriaSwiper
        titulo="Consoles"
        produtos={consoles}
      />

      <CategoriaSwiper
        titulo="PCs"
        produtos={pcs}
      />

    </div>
  );
}