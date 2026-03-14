"use client"

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/Components/ui/carrosel"
import { Button } from "@/components/ui/button"

import {
  Headphones,
  CheckCircle,
  Gamepad2,
  ShieldCheck,
} from "lucide-react"

const games = [
    {
  
    image: 
      "Banner.png",
  },
  {
    id: 2,
    title: "",
    logo: "Forza Horizon 6",
    releaseDate: "Disponível em 19 de maio de 2026",
    description:
      "Descubra as paisagens deslumbrantes do Japão com mais de 550 carros do mundo real e torne-se uma lenda das corridas na maior aventura de direção em mundo aberto de Forza Horizon de todos os tempos.",
    price: "R$ 349,99",
    image: 
      "Forza.Horizon6.webp",
  },
  {
    id: 3,
    title: "Fortnite",
    logo: "Fortnite",
    releaseDate: "Já disponível",
    description:
      "Embarque em uma nova ilha ensolarada, descubra maneiras inéditas de jogar e um Passe de Batalha repleto de estrelas. Essa temporada dá início a uma nova era para a história do Battle Royale do Fortnite, onde as maiores histórias são contadas e as câmeras estão sempre gravando.",
    price: "R$ 199,99",
    image:
      "Fortnite.jpg",
  },
  {
    id: 4,
    title: "god of war 3",
    logo: "god of war 3",
    releaseDate: "Disponível agora",
    description:
      "Uma história épica do Velho Oeste americano, Red Dead Redemption 2 oferece uma experiência imersiva em um mundo aberto vasto e detalhado.",
    price: "R$ 249,99",
    image:
      "god-of-war-3.jpg",
  },

]

const categories = [
  { icon: Headphones, label: "Periféricos" },
  { icon: CheckCircle, label: "Loja", sublabel: "100% Oficial" },
  { icon: Gamepad2, label: "Games" },
  { icon: ShieldCheck, label: "Experiência", sublabel: "Segura e simples" },
]

const navCategories = ["Categorias", "Favoritos", "Peças", "Periféricos", "Jogos"]

export default function HomePage() {
  return (
    <main className="min-h-screen bg-zinc-900">
      
      {/* Game Carousel */}
      <section className="py-8 px-6">
        <div className="max-w-4xl mx-auto">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="w-full"
          >
            <CarouselContent className="ml-0">
              {games.map((game) => (
                <CarouselItem key={game.id} className="pl-0">
                  <div className="relative rounded-xl overflow-hidden border-2 border-violet-500/50 shadow-lg shadow-violet-500/20">
                    {/* Game Image */}
                    <div className="relative aspect-video">
                      <img
                        src={game.image}
                        alt={game.title}
                        className="w-full h-full object-cover"
                      />
                      {/* Overlay with content */}
                      <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent">
                        <div className="absolute top-6 left-6">
                          <div className="text-white font-bold text-2xl tracking-wider">
                            {game.logo}
                          </div>
                        </div>
                        <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                          <div className="max-w-md">
                            <p className="text-violet-400 font-semibold text-sm mb-2">
                              {game.releaseDate}
                            </p>
                            <p className="text-white/80 text-sm leading-relaxed line-clamp-4">
                              {game.description}
                            </p>
                          </div>
                          <div className="text-right flex flex-col items-end gap-2">
                            <Button className="bg-zinc-700/80 hover:bg-zinc-600 text-white px-6">
                              Comprar
                            </Button>
                            <span className="text-violet-400 font-bold text-lg">
                              {game.price}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 bg-white/90 hover:bg-white text-zinc-900 border-0 h-12 w-12" />
            <CarouselNext className="right-4 bg-white/90 hover:bg-white text-zinc-900 border-0 h-12 w-12" />
          </Carousel>
        </div>
      </section>

      {/* Categories Section */}
      <section className="">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {categories.map((category, index) => (
              <div key={index} className="flex flex-col items-center text-center">
                <div className="w-24 h-24 md:w-28 md:h-28 rounded-full bg-zinc-200 border-4 border-zinc-300 flex items-center justify-center mb-4 hover:border-violet-400 transition-colors cursor-pointer">
                  <category.icon className="h-10 w-10 md:h-12 md:w-12 text-zinc-400" />
                </div>
                <h3 className="text-zinc-800 font-bold text-lg">{category.label}</h3>
                {category.sublabel && (
                  <p className="text-zinc-600 font-medium">{category.sublabel}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
