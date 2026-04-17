import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Comprar() {
  const [produtos, setProdutos] = useState([
    {
      id: 1,
      nome: "Mouse Fortrek Spider",
      descricao:
        "Eleve sua experiência nos jogos e no dia a dia com o Mouse Fortrek Spider. Com um design moderno e agressivo, iluminação em LED vermelho e acabamento ergonômico, ele foi desenvolvido para oferecer conforto e alta performance durante longas horas de uso.",
      preco: "R$ 79,00",
      imagens: ["/mouse 1.png", "/headset 1.png", "/teclado 1.png"],
      comentario:
        "Ótimo mouse para jogos, confortável e com boa precisão. A iluminação em LED é um bônus visual que eu adoro!",
      estrelas: 4,
    },
  ]);

  const [rating, setRating] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [favoritos, setFavoritos] = useState<number[]>(() => {
    if (typeof window === "undefined") return [];
    const salvo = localStorage.getItem("favoritos");
    return salvo ? JSON.parse(salvo) : [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      const salvo = localStorage.getItem("favoritos");
      if (salvo) setFavoritos(JSON.parse(salvo));
    }
  }, []);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const produto = produtos[0];
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % produto.imagens.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) =>
      prev === 0 ? produto.imagens.length - 1 : prev - 1
    );
  };

  const adicionarAoCarrinho = () => {
    const salvo = localStorage.getItem("carrinho");
    const ids: number[] = salvo ? JSON.parse(salvo) : [];
    ids.push(produto.id);
    localStorage.setItem("carrinho", JSON.stringify(ids));
    toast.success("Produto adicionado ao carrinho!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  const adicionarComentario = () => {
    if (!novoComentario.trim()) return;
    const novo = {
      id: Date.now(),
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco,
      imagens: [produto.imagens[0]],
      comentario: novoComentario,
      estrelas: rating,
    };
    setProdutos([...produtos, novo]);
    setNovoComentario("");
    setRating(0);
  };

  const calculoRating = () => {
    if (produtos.length === 0) return 0;
    const total = produtos.reduce((acc, p) => acc + p.estrelas, 0);
    return Math.round(total / produtos.length);
  };

  return (
    <>
      <Header />
      <NavBar />
      <div className="flex">
        {/* Imagem principal */}
        <div className="flex flex-col p-20">
          <Image
            src={produto.imagens[currentImage]}
            alt="Mouse Gamer"
            width={400}
            height={300}
          />
          <div className="mt-5 flex gap-8">
            <div className="mt-5 flex items-center gap-4">
              <button onClick={prevImage} className="text-white text-2xl">
                ‹
              </button>
              <div className="flex gap-4">
                {produto.imagens.map((img, index) => (
                  <Image
                    key={index}
                    src={img}
                    alt={produto.nome}
                    width={110}
                    height={50}
                    className={`cursor-pointer border-2 ${
                      index === currentImage
                        ? "border-purple-500 rounded-2xl"
                        : "border-transparent"
                    }`}
                    onClick={() => setCurrentImage(index)}
                  />
                ))}
              </div>
              <button onClick={nextImage} className="text-white text-2xl">
                ›
              </button>
            </div>
          </div>
        </div>

        {/* Detalhes do produto */}
        <div className="flex flex-col p-20 rounded-lg h-100 w-200 mt-20 bg-[#d9d9d9]/20">
          <div className="flex items-center gap-63 mb-5">
            <h1 className="text-2xl font-bold text-white -mt-8 mb-3">
              {produto.nome}
            </h1>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl -mt-8 ${
                    star <= rating ? "text-yellow-400" : "text-black"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>
          <p className="text-lg mt-2 text-white">{produto.descricao}</p>
          <p className="text-3xl font-bold mt-4 text-white">{produto.preco}</p>
          <div className="flex gap-4 mt-6">
            <button
              onClick={adicionarAoCarrinho}
              className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4"
            >
              Adicionar ao Carrinho
            </button>
            <Link
              href="/finalizar-compra"
              className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4"
            >
              Comprar Agora
            </Link>
          </div>
        </div>
      </div>

      {/* Favoritar e compartilhar */}
      <div className="flex justify-center gap-60 -mt-40 mb-39">
        <div className="flex flex-col items-center cursor-pointer">
          <FaStar
            onClick={() => toggleFavorito(produto.id)}
            className={`text-3xl ${
              favoritos.includes(produto.id) ? "text-yellow-400" : "text-black"
            }`}
          />
          <span className="text-white mt-1 text-sm">Favoritar</span>
        </div>
        <button
          onClick={() => {
            const url = window.location.href;
            navigator.clipboard.writeText(url);
            toast.info("Link copiado!", {
              position: "bottom-right",
              autoClose: 2000,
            });
          }}
          className="flex flex-col items-center text-purple-600 px-4 py-2 rounded hover:text-purple-700"
        >
          <Icon icon="typcn:arrow-back" width={40} className="-mt-4" />
          <span className="text-white">Compartilhar</span>
        </button>
      </div>

      {/* Seção de comentários */}
      <div className="bg-white rounded-lg p-4 mt-4 flex flex-col">
        <p className="text-black ml-70 text-2xl mt-10">Comentários do produto</p>
        <div className="flex gap-2 ml-30 mt-17">
          <input
            type="text"
            placeholder="Escreva seu comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="w-150 bg-gray-200 placeholder:text-gray-500 border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                adicionarComentario();
              }
            }}
          />
          <button
            onClick={adicionarComentario}
            className="bg-[#5a10a8] text-white px-4 py-2 rounded-lg hover:bg-[#3a0a6a] transition duration-200"
          >
            Enviar
          </button>
        </div>

        <div className="flex">
          <div className="flex items-start">
            <div>
              {produtos.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center bg-gray-400 rounded w-230 h-16 ml-20 mt-5 gap-10"
                >
                  <Icon
                    icon="heroicons:user"
                    className="ml-7 text-2xl text-white"
                  />
                  <p>
                    {p.comentario.slice(0, 80)}
                    {p.comentario.length > 80 ? "..." : ""}
                  </p>
                  <p className="flex items-center gap-2">
                    {p.estrelas}
                    <FaStar className="text-yellow-400" />
                  </p>
                </div>
              ))}
            </div>

            <div className="ml-100 mt-5 flex flex-col">
              <h2 className="text-xl">Avaliações</h2>
              <FaStar className="text-yellow-400 text-6xl ml-4 mt-10" />
              <p className="ml-4">{calculoRating()} estrelas</p>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}