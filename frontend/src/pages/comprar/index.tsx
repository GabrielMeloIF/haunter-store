import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { produtosAPI } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";

export default function Comprar() {
  const router = useRouter();
  const { adicionarItem } = useCarrinho();
  const { usuario } = useAuth();
  const { id } = router.query;

  const [produto, setProduto] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [rating, setRating] = useState(0);
  const [novoComentario, setNovoComentario] = useState("");
  const [comentarios, setComentarios] = useState<any[]>([]);
  const [favoritos, setFavoritos] = useState<number[]>([]);

  useEffect(() => {
    const salvo = localStorage.getItem("favoritos");
    if (salvo) setFavoritos(JSON.parse(salvo));
  }, []);

  useEffect(() => {
    async function carregarProduto() {
      if (!id) return;
      try {
        const data = await produtosAPI.getById(Number(id));
        setProduto(data);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarProduto();
  }, [id]);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id)
        ? prev.filter((f) => f !== id)
        : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const adicionarAoCarrinho = async () => {
    if (!produto) return;

    if (!usuario) {
      toast.error("Faça login para adicionar ao carrinho!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    try {
      await adicionarItem(produto.id, 1);
      toast.success("Produto adicionado ao carrinho!", {
        position: "bottom-right",
        autoClose: 3000,
      });
    } catch (error: any) {
      toast.error(error.message, {
        position: "bottom-right",
        autoClose: 3000,
      });
    }
  };

  const adicionarComentario = () => {
    if (!novoComentario.trim()) return;
    const novo = { comentario: novoComentario, estrelas: rating };
    setComentarios([...comentarios, novo]);
    setNovoComentario("");
    setRating(0);
  };

  const calculoRating = () => {
    if (comentarios.length === 0) return 0;
    const total = comentarios.reduce((acc, c) => acc + c.estrelas, 0);
    return Math.round(total / comentarios.length);
  };

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-white text-2xl">Carregando produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!produto) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center">
          <p className="text-white text-2xl">Produto não encontrado.</p>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="flex flex-wrap justify-center gap-10 p-10">
        <div className="flex flex-col items-center">
          <Image
            src={produto.imagem_url || "/mouse 1.png"}
            alt={produto.nome}
            width={450}
            height={450}
            className="rounded-lg"
          />
        </div>

        <div className="flex flex-col p-10 rounded-lg w-[700px] bg-[#d9d9d9]/20">
          <div className="flex justify-between items-center mb-5">
            <h1 className="text-3xl font-bold text-white">{produto.nome}</h1>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <FaStar
                  key={star}
                  className={`cursor-pointer text-2xl ${
                    star <= rating ? "text-yellow-400" : "text-gray-500"
                  }`}
                  onClick={() => setRating(star)}
                />
              ))}
            </div>
          </div>

          <p className="text-white text-lg">{produto.descricao}</p>

          <p className="text-4xl font-bold text-white mt-6">
            R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
          </p>

          <div className="flex gap-4 mt-8">
            <button
              onClick={adicionarAoCarrinho}
              className="bg-[#5a10a8] text-white py-3 px-6 rounded-lg hover:bg-[#3a0a6a]"
            >
              Adicionar ao Carrinho
            </button>
            <Link
              href="/finalizar-compra"
              className="bg-[#5a10a8] text-white py-3 px-6 rounded-lg hover:bg-[#3a0a6a]"
            >
              Comprar Agora
            </Link>
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-40 mb-10">
        <div className="flex flex-col items-center cursor-pointer">
          <FaStar
            onClick={() => toggleFavorito(produto.id)}
            className={`text-4xl ${
              favoritos.includes(produto.id) ? "text-yellow-400" : "text-gray-500"
            }`}
          />
          <span className="text-white mt-2">Favoritar</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard.writeText(window.location.href);
            toast.info("Link copiado!", { position: "bottom-right", autoClose: 2000 });
          }}
          className="flex flex-col items-center"
        >
          <Icon icon="mdi:share-variant" width={40} className="text-purple-500" />
          <span className="text-white">Compartilhar</span>
        </button>
      </div>

      <div className="bg-white rounded-lg p-8 mx-10 mb-10">
        <h2 className="text-2xl font-bold mb-6">Comentários do Produto</h2>

        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Escreva seu comentário..."
            value={novoComentario}
            onChange={(e) => setNovoComentario(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg p-2"
          />
          <button
            onClick={adicionarComentario}
            className="bg-[#5a10a8] text-white px-4 rounded-lg"
          >
            Enviar
          </button>
        </div>

        <div className="mt-6 space-y-3">
          {comentarios.map((comentario, index) => (
            <div key={index} className="bg-gray-200 rounded-lg p-4 flex justify-between">
              <p>{comentario.comentario}</p>
              <div className="flex items-center gap-1">
                <span>{comentario.estrelas}</span>
                <FaStar className="text-yellow-400" />
              </div>
            </div>
          ))}
        </div>

        <div className="mt-10">
          <h3 className="text-xl font-bold">Média das Avaliações</h3>
          <div className="flex items-center gap-2 mt-3">
            <FaStar className="text-yellow-400 text-4xl" />
            <span className="text-2xl">{calculoRating()} estrelas</span>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}