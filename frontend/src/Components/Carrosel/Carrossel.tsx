import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Link from "next/link";

const slides = [
  {
    id: 1,
    image: "/promo.png",
    titulo: "Promoção!!",
    descricao: "Venha aproveitar nossas promoções",
  },
  {
    id: 2,
    image: "/forza.png",
    titulo: "Forza Horizon 6",
    descricao:
      "Explore o Japão em um mundo aberto com paisagens incríveis, dirija mais de 550 carros reais e construa sua fama para se tornar uma lenda das corridas.",
  },
  {
    id: 3,
    image: "/fortinite.png",
    titulo: "Fortnite",
    descricao:
      "Viaje para uma nova ilha, explore novas formas de jogar e aproveite um Passe de Batalha cheio de recompensas.",
  },
  {
    id: 4,
    image: "/god-of-war.png",
    titulo: "God of War",
    descricao:
      "God of War III Remasterizado dá vida a batalhas épicas com gráficos impressionantes.",
  },
];

export default function Carrossel({
  className = "",
}: {
  className?: string;
}) {
  const [atual, setAtual] = useState(0);
  const [animando, setAnimando] = useState(false);

  const irPara = (index: number) => {
    if (animando || index === atual) return;

    setAnimando(true);

    setTimeout(() => {
      setAtual(index);
      setAnimando(false);
    }, 400);
  };

  const proximo = () => {
    irPara((atual + 1) % slides.length);
  };

  const anterior = () => {
    irPara((atual - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      proximo();
    }, 3000);

    return () => clearInterval(interval);
  }, [atual]);

  const slide = slides[atual];

  return (
    <div
      className={`flex flex-col items-center px-4 mb-8 ${className}`}
    >
      {/* Container do carrossel */}
      <div className="relative w-full max-w-5xl border border-purple-800 rounded-2xl overflow-hidden mt-5">

        {/* Imagem */}
        <div className="relative aspect-video shadow-2xl">

          <div
            key={atual}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
              animando
                ? "opacity-0 scale-95"
                : "opacity-100 scale-100"
            }`}
            style={{
              backgroundImage: `url(${slide.image})`,
            }}
          />

          {/* Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />

          {/* Texto */}
          <div
            className={`absolute bottom-0 left-0 p-6 transition-all duration-400 ${
              animando
                ? "opacity-0 translate-y-3"
                : "opacity-100 translate-y-0"
            }`}
          >
            <h3 className="text-white text-xl md:text-2xl font-semibold">
              {slide.titulo}
            </h3>

            <p className="text-white/70 text-sm mt-1 italic max-w-3xl">
              {slide.descricao}
            </p>
          </div>

          {/* Botão anterior */}
          <button
            onClick={anterior}
            className="absolute left-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Botão próximo */}
          <button
            onClick={proximo}
            className="absolute right-3 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-black border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
          >
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => irPara(i)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === atual
                    ? "w-6 bg-white"
                    : "w-2 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Categorias */}
      <div className="flex flex-wrap justify-center gap-8 mt-6">

        {/* Consoles */}
        <Link
          href="/consolee"
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-transparent hover:border-purple-800 hover:scale-105 transition-all duration-300">

            <Icon
              icon="game-icons:game-console"
              width="48"
              height="48"
              className="text-gray-500"
            />

          </div>

          <div className="text-center mt-2">
            <span className="block text-sm font-medium text-white">
              Consoles
            </span>
          </div>
        </Link>

        {/* Jogos */}
        <Link
          href="/jogos"
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-transparent hover:border-purple-800 hover:scale-105 transition-all duration-300">

            <Icon
              icon="mdi:controller"
              width="48"
              height="48"
              className="text-gray-500"
            />

          </div>

          <div className="text-center mt-2">
            <span className="block text-sm font-medium text-white">
              Jogos
            </span>
          </div>
        </Link>

        {/* PCs */}
        <Link
          href="/pcs"
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-transparent hover:border-purple-800 hover:scale-105 transition-all duration-300">

            <Icon
              icon="mdi:monitor"
              width="48"
              height="48"
              className="text-gray-500"
            />

          </div>

          <div className="text-center mt-2">
            <span className="block text-sm font-medium text-white">
              PCs
            </span>
          </div>
        </Link>

        {/* Periféricos */}
        <Link
          href="/perifericos"
          className="flex flex-col items-center"
        >
          <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center border-2 border-transparent hover:border-purple-800 hover:scale-105 transition-all duration-300">

            <Icon
              icon="mdi:headphones"
              width="48"
              height="48"
              className="text-gray-500"
            />

          </div>

          <div className="text-center mt-2">
            <span className="block text-sm font-medium text-white">
              Periféricos
            </span>
          </div>
        </Link>

      </div>
    </div>
  );
}