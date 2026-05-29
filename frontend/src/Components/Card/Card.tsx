import Image from "next/image";
import Link from "next/link";
import { FaStar, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useState, useRef, useEffect } from "react";
import { Produto } from "../../produtos/index";

// ─── Hook de fetch por categoria ────────────────────────────────────────────

function useProdutos(categoria: string) {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    let cancelado = false;

    async function buscar() {
      setIsLoading(true);
      setErro(null);

      try {
        const res = await fetch(`/http://192.168.56.1:4000/produtos`);
        if (!res.ok) throw new Error("Erro ao buscar produtos");
        const data = await res.json();
        if (!cancelado) setProdutos(data);
      } catch (e) {
        if (!cancelado)
          setErro((e as Error).message ?? "Algo deu errado");
      } finally {
        if (!cancelado) setIsLoading(false);
      }
    }

    buscar();
    return () => {
      cancelado = true;
    };
  }, [categoria]);

  return { produtos, isLoading, erro };
}



const SkeletonCard = () => (
  <div className="rounded-lg border-2 border-white w-64 flex-shrink-0 p-4 animate-pulse">
    <div className="bg-white/20 rounded h-40 w-full mb-4" />
    <div className="bg-white/20 rounded h-4 w-3/4 mb-2" />
    <div className="bg-white/20 rounded h-3 w-full mb-4" />
    <div className="bg-white/20 rounded h-8 w-1/2" />
  </div>
);



const ErroCard = ({
  mensagem,
}: {
  mensagem: string;
}) => (
  <div className="flex flex-col items-center gap-3 py-8 text-white/80 w-full">
    <p>{mensagem}</p>
  </div>
);



const CardItem = ({
  produto,
  favoritos,
  toggleFavorito,
}: {
  produto: Produto;
  favoritos: number[];
  toggleFavorito: (id: number) => void;
}) => (
  <div className="rounded-lg shadow-md p-4 border-2 border-white w-64 flex-shrink-0 transition-transform duration-300 hover:scale-105">
    <div className="relative">
      <FaStar
        onClick={() => toggleFavorito(produto.id)}
        className={`absolute top-2 right-2 text-2xl cursor-pointer z-10 ${
          favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"
        }`}
      />
      <Image src={produto.imagem} alt={produto.nome} width={256} height={180} />
    </div>
    <h2 className="text-white text-xl font-bold mb-2 mt-5">{produto.nome}</h2>
    <p className="text-white text-sm">{produto.descricao}</p>
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


const ITEMS_VISIBLE = 3;

const CarrosselCategoria = ({
  categoria,
  titulo,
  favoritos,
  toggleFavorito,
}: {
  categoria: string;
  titulo: string;
  favoritos: number[];
  toggleFavorito: (id: number) => void;
}) => {
  const [chave, setChave] = useState(0); // incrementar força novo fetch (retry)
  const { produtos, isLoading, erro } = useProdutos(`${categoria}-${chave}`);
  const ref = useRef<HTMLDivElement>(null);

  const scroll = (direcao: "esquerda" | "direita") => {
    if (!ref.current) return;
    const cardW = ref.current.scrollWidth / (produtos.length || 1);
    ref.current.scrollBy({
      left: direcao === "direita" ? cardW * ITEMS_VISIBLE : -(cardW * ITEMS_VISIBLE),
      behavior: "smooth",
    });
  };

  return (
    <section className="w-full">
      <h2 className="text-white font-bold text-3xl self-start px-6 mb-4">
        {titulo}
      </h2>

      {isLoading ? (
        <div className="flex gap-6 px-10">
          {Array.from({ length: ITEMS_VISIBLE }).map((_, i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : erro ? (
        <ErroCard mensagem={erro}/>
      ) : (
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
      )}
    </section>
  );
};


const CATEGORIAS = [
  { slug: "perifericos", titulo: "Periféricos" },
  { slug: "games",       titulo: "Jogos" },
  { slug: "hardware",    titulo: "Hardware" },
  { slug: "acessorios",  titulo: "Acessórios" },
];



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
      {CATEGORIAS.map((c) => (
        <CarrosselCategoria
          key={c.slug}
          categoria={c.slug}
          titulo={c.titulo}
          favoritos={favoritos}
          toggleFavorito={toggleFavorito}
        />
      ))}
    </div>
  );
}