"use client";
 
import { useState } from "react";
 
// Simulando banco de dados com 3 imagens
const slides = [
      {
    id: 1,
    image: "/promo.png",
    titulo: "Promoção!!",
    descricao: "venha aproveitar nossas promoções",
  },
  {
    id: 2,
    image: "/forza.png",
    titulo: "Forza Horizon 6",
    descricao: "Explore o Japão em um mundo aberto com paisagens incríveis, dirija mais de 550 carros reais e construa sua fama para se tornar uma lenda das corridas no maior Forza Horizon já feito.",
  },
  {
    id: 3,
    image: "/fortinite.png",
    titulo: "Fortinite ",
    descricao: "Viaje para uma nova ilha, explore novas formas de jogar e aproveite um Passe de Batalha cheio de recompensas. Esta temporada marca uma nova fase do Fortnite, com foco em grandes histórias e muita ação registrada o tempo todo.",
  },
  {
    id: 4,
    image: "/god-of-war.png",
    titulo: "God of War",
    descricao: "God of War III Remasterizado dá vida a batalhas épicas com gráficos impressionantes e uma trama elaborada que coloca Kratos no centro do massacre e da destruição, em sua busca pela vingança contra os Deuses que o traíram.",
  },
 
];
 
export default function Carrossel() {
  const [atual, setAtual] = useState(0);
  const [animando, setAnimando] = useState(false);
 
  const irPara = (index:number) => {
    if (animando || index === atual) return;
    setAnimando(true);
    setTimeout(() => {
      setAtual(index);
      setAnimando(false);
    }, 400);    
  };
 
  const proximo = () => irPara((atual + 1) % slides.length);
  const anterior = () => irPara((atual - 1 + slides.length) % slides.length);
 
  const slide = slides[atual];
 
  return (
    <div className="flex flex-col items-center min-h-screen px-4 mt-30">
  
 
      {/* Container do carrossel */}
      <div className="relative flex items-center gap-4 w-full max-w-3xl">
 
        {/* Botão Anterior — à esquerda da imagem */}
        <button
          onClick={anterior}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
 
        {/* Imagem */}
        <div className="relative flex-1 rounded-2xl overflow-hidden aspect-video shadow-2xl">
          <div
            key={atual}
            className={`absolute inset-0 bg-cover bg-center transition-all duration-500 ${
              animando ? "opacity-0 scale-95" : "opacity-100 scale-100"
            }`}
            style={{ backgroundImage: `url(${slide.image})` }}
          />
 
          {/* Overlay com texto */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
          <div
            className={`absolute bottom-0 left-0 p-6 transition-all duration-400 ${
              animando ? "opacity-0 translate-y-3" : "opacity-100 translate-y-0"
            }`}
          >
           
            <h3 className="text-white text-xl md:text-2xl font-semibold mt-1">{slide.titulo}</h3>
            <p className="text-white/60 text-sm mt-1 italic">{slide.descricao}</p>
          </div>
 
          {/* Dots */}
          <div className="absolute bottom-4 right-4 flex gap-1.5">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => irPara(i)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === atual ? "w-6 bg-white" : "w-1.5 bg-white/40 hover:bg-white/70"
                }`}
              />
            ))}
          </div>
        </div>
 
        {/* Botão Próximo — à direita da imagem */}
        <button
          onClick={proximo}
          className="flex-shrink-0 w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-all duration-300"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M9 18l6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
 
     
    </div>
  );
}
 