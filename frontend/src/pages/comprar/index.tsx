import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import { FaStar, FaShoppingCart, FaHeart, FaShare, FaCopy, FaCheckCircle, FaTruck, FaBolt } from "react-icons/fa";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { produtosAPI } from "@/services/api";
import { toast, ToastContainer } from "react-toastify";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import { avaliacoesAPI } from "@/services/api";

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
  const [imagemSelecionada, setImagemSelecionada] = useState<string>("");
  const [idxSelecionado, setIdxSelecionado] = useState(0);
  const [mostrarTodos, setMostrarTodos] = useState(false);

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
        setImagemSelecionada(data.imagem_url);
      } catch (error) {
        console.error("Erro ao carregar produto:", error);
      } finally {
        setLoading(false);
      }
    }
    carregarProduto();
  }, [id]);

  useEffect(() => {
    async function carregarComentarios() {
      if (!id) return;
      try {
        const data = await avaliacoesAPI.getByProduct(Number(id));
        setComentarios(data);
      } catch (error) {
        console.error("Erro ao carregar comentários:", error);
      }
    }
    carregarComentarios();
  }, [id]);

  const toggleFavorito = (id: number) => {
    setFavoritos((prev) => {
      const novos = prev.includes(id) ? prev.filter((f) => f !== id) : [...prev, id];
      localStorage.setItem("favoritos", JSON.stringify(novos));
      return novos;
    });
  };

  const adicionarAoCarrinho = async () => {
    if (!produto) return;
    if (!usuario) {
      toast.error("Faça login para adicionar ao carrinho!", { position: "bottom-right", autoClose: 3000 });
      return;
    }
    try {
      await adicionarItem(produto.id, 1);
      toast.success("Produto adicionado ao carrinho!", { position: "bottom-right", autoClose: 3000 });
    } catch (error: any) {
      toast.error(error.message, { position: "bottom-right", autoClose: 3000 });
    }
  };

  const adicionarComentario = async () => {
    if (!novoComentario.trim()) return;
    if (!usuario) { toast.error("Faça login para avaliar o produto!"); return; }
    if (rating === 0) { toast.warning("Selecione uma nota antes de enviar!"); return; }
    try {
      await avaliacoesAPI.create(usuario.id, produto.id, rating, novoComentario);
      toast.success("Avaliação enviada com sucesso!");
      setNovoComentario("");
      setRating(0);
      const atualizados = await avaliacoesAPI.getByProduct(Number(id));
      setComentarios(atualizados);
    } catch (error: any) {
      toast.error("Erro ao enviar avaliação.");
    }
  };

  const calculoRating = () => {
    if (comentarios.length === 0) return 0;
    const total = comentarios.reduce((acc, c) => acc + c.nota, 0);
    return parseFloat((total / comentarios.length).toFixed(1));
  };

  const renderStars = (nota: number, size = "text-sm") => {
    return [1, 2, 3, 4, 5].map((star) => (
      <FaStar key={star} className={`${size} ${star <= Math.round(nota) ? "text-yellow-400" : "text-gray-600"}`} />
    ));
  };

  const mediaRating = calculoRating();

  const distribuicaoEstrelas = [5, 4, 3, 2, 1].map((estrela) => {
    const count = comentarios.filter((c) => Math.round(c.nota) === estrela).length;
    const pct = comentarios.length > 0 ? Math.round((count / comentarios.length) * 100) : 0;
    return { estrela, count, pct };
  });

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex justify-center items-center bg-[#0f0f1a]">
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
        <div className="min-h-screen flex justify-center items-center bg-[#0f0f1a]">
          <p className="text-white text-2xl">Produto não encontrado.</p>
        </div>
        <Footer />
      </>
    );
  }

  const imagens = [produto.imagem_url, produto.imagem_url, produto.imagem_url, produto.imagem_url];

  const irParaAnterior = () => {
    const novoIdx = idxSelecionado > 0 ? idxSelecionado - 1 : imagens.length - 1;
    setIdxSelecionado(novoIdx);
    setImagemSelecionada(imagens[novoIdx]);
  };

  const irParaProximo = () => {
    const novoIdx = idxSelecionado < imagens.length - 1 ? idxSelecionado + 1 : 0;
    setIdxSelecionado(novoIdx);
    setImagemSelecionada(imagens[novoIdx]);
  };

  const comentariosVisiveis = mostrarTodos ? comentarios : comentarios.slice(0, 3);

  return (
    <>
      <Header />
      <ToastContainer />

      <div className="min-h-screen bg-[#0f0f1a] text-white">

        {/* Breadcrumb */}
        <div className="max-w-7xl mx-auto px-6 pt-6">
          <p className="text-sm text-gray-400">
            <span className="hover:text-purple-400 cursor-pointer">Início</span>
            {" > "}
            <span className="hover:text-purple-400 cursor-pointer">Periféricos</span>
            {" > "}
            <span className="text-white font-medium">{produto.nome}</span>
          </p>
        </div>

        {/* Seção principal */}
        <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-2 gap-8">

          {/* Coluna esquerda: galeria */}
          <div className="flex gap-3">

            {/* Miniaturas verticais */}
            <div className="flex flex-col gap-2">
              {imagens.map((img, i) => (
                <div
                  key={i}
                  onClick={() => { setIdxSelecionado(i); setImagemSelecionada(img); }}
                  className={`w-16 h-16 rounded-lg overflow-hidden cursor-pointer border-2 transition bg-[#1a1a2e] ${
                    idxSelecionado === i ? "border-purple-500" : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <Image src={img} alt={`Miniatura ${i + 1}`} width={64} height={64} className="object-contain w-full h-full p-1" />
                </div>
              ))}
            </div>

            {/* Imagem principal */}
            <div className="flex-1 bg-[#1a1a2e] rounded-2xl relative flex items-center justify-center overflow-hidden border border-white/5" style={{ minHeight: 380 }}>
              <button onClick={irParaAnterior} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-2xl transition">‹</button>

              <Image
                src={imagemSelecionada || produto.imagem_url}
                alt={produto.nome}
                width={400}
                height={400}
                className="object-contain transition duration-300 hover:scale-105 p-4"
              />

              <button onClick={irParaProximo} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 bg-black/50 hover:bg-purple-600 text-white rounded-full w-9 h-9 flex items-center justify-center text-2xl transition">›</button>

              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                {imagens.map((_, i) => (
                  <div key={i} onClick={() => { setIdxSelecionado(i); setImagemSelecionada(imagens[i]); }}
                    className={`w-1.5 h-1.5 rounded-full cursor-pointer transition ${idxSelecionado === i ? "bg-purple-500" : "bg-white/20"}`} />
                ))}
              </div>
            </div>
          </div>

          {/* Coluna direita: informações */}
          <div className="flex flex-col gap-4">
            <div>
              <span className="text-purple-400 text-xs font-bold uppercase tracking-widest">
                {produto.categoria?.nome_categoria || "PRODUTO GAMER"}
              </span>
              <h1 className="text-4xl font-bold text-white mt-1">{produto.nome}</h1>
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex gap-0.5">{renderStars(mediaRating, "text-base")}</div>
              <span className="text-yellow-400 font-bold">{mediaRating > 0 ? mediaRating : "—"}</span>
              <span className="text-gray-400 text-sm">({comentarios.length} avaliações)</span>
            </div>

            <div className="flex items-center gap-3 text-sm text-gray-400">
              <span>Vendido por <span className="text-purple-400 font-semibold">Haunter Store</span></span>
              <span className="text-white/20">|</span>
              <span className="text-green-400">+120 vendidos</span>
            </div>

            {/* Preço */}
            <div className="border-t border-white/10 pt-4">
              <p className="text-5xl font-bold text-white">
                R$ {Number(produto.preco).toFixed(2).replace(".", ",")}
              </p>
              <p className="text-gray-400 text-sm mt-1">
                ou 12x de R$ {(produto.preco / 12).toFixed(2).replace(".", ",")} sem juros
              </p>
              <button className="text-purple-400 text-sm mt-1 hover:text-purple-300 flex items-center gap-1">
                Ver formas de pagamento <span>▾</span>
              </button>
            </div>

            {/* Badges */}
            <div className="flex gap-3">
              <span className="flex items-center gap-1.5 text-green-400 text-sm bg-green-400/10 px-3 py-1.5 rounded-lg">
                <FaCheckCircle className="text-xs" /> Em estoque
              </span>
              <span className="flex items-center gap-1.5 text-blue-400 text-sm bg-blue-400/10 px-3 py-1.5 rounded-lg">
                <FaTruck className="text-xs" /> Frete grátis
              </span>
              <span className="flex items-center gap-1.5 text-yellow-400 text-sm bg-yellow-400/10 px-3 py-1.5 rounded-lg">
                <FaBolt className="text-xs" /> Entrega rápida
              </span>
            </div>

            {/* Botões */}
            <div className="flex flex-col gap-3 mt-2">
              <Link
                href={{ pathname: "/finalizar-compra", query: { produtoId: produto.id } }}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white text-center py-4 rounded-xl font-bold transition flex items-center justify-center gap-2 text-lg"
              >
                <FaBolt /> Comprar Agora
              </Link>
              <button
                onClick={adicionarAoCarrinho}
                className="w-full border border-purple-500/50 text-purple-400 py-4 rounded-xl font-bold hover:bg-purple-500/10 transition flex items-center justify-center gap-2 text-lg"
              >
                <FaShoppingCart /> Adicionar ao Carrinho
              </button>
            </div>

            {/* Ações secundárias */}
            <div className="flex gap-4 border-t border-white/10 pt-4">
              <button
                onClick={() => toggleFavorito(produto.id)}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-pink-400 transition"
              >
                <FaHeart className={favoritos.includes(produto.id) ? "text-pink-500" : ""} />
                Favoritar
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.info("Link copiado!", { position: "bottom-right", autoClose: 2000 }); }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition"
              >
                <FaShare /> Compartilhar
              </button>
              <button
                onClick={() => { navigator.clipboard.writeText(window.location.href); toast.info("Link copiado!", { position: "bottom-right", autoClose: 2000 }); }}
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-purple-400 transition"
              >
                <FaCopy /> Copiar Link
              </button>
            </div>
          </div>
        </div>

        {/* Descrição + Avaliações */}
        <div className="max-w-7xl mx-auto px-6 pb-8 grid grid-cols-2 gap-6">

          {/* Descrição */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <span className="w-3 h-3 bg-purple-500 rounded-sm inline-block"></span>
              <h2 className="text-lg font-bold">Descrição do Produto</h2>
            </div>
            <p className="text-gray-300 text-sm leading-relaxed mb-4">{produto.descricao}</p>
          </div>

          {/* Avaliações resumo */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-bold mb-4">Avaliações do Produto</h2>
            <div className="flex gap-6 items-center">
              <div className="text-center">
                <p className="text-6xl font-bold text-white">{mediaRating > 0 ? mediaRating : "—"}</p>
                <div className="flex gap-0.5 justify-center mt-2">{renderStars(mediaRating, "text-lg")}</div>
                <p className="text-gray-400 text-xs mt-1">Baseado em {comentarios.length} avaliações</p>
              </div>
              <div className="flex-1 space-y-2">
                {distribuicaoEstrelas.map(({ estrela, pct }) => (
                  <div key={estrela} className="flex items-center gap-2 text-xs">
                    <span className="text-gray-400 w-14">{estrela} estrelas</span>
                    <div className="flex-1 bg-white/10 rounded-full h-2 overflow-hidden">
                      <div className="h-2 bg-purple-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Comentários */}
        <div className="max-w-7xl mx-auto px-6 pb-8 grid grid-cols-3 gap-6">

          {/* Lista de comentários */}
          <div className="col-span-2 bg-[#1a1a2e] rounded-2xl p-6 border border-white/5">
            <h2 className="text-lg font-bold mb-4">Comentários ({comentarios.length})</h2>

            {/* Input novo comentário */}
            <div className="flex gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 shrink-0">
                <span className="text-sm font-bold">{usuario?.nome?.[0]?.toUpperCase() || "?"}</span>
              </div>
              <div className="flex-1 flex gap-2">
                <input
                  type="text"
                  placeholder="Escreva seu comentário..."
                  value={novoComentario}
                  onChange={(e) => setNovoComentario(e.target.value)}
                  className="flex-1 bg-[#0f0f1a] border border-white/10 text-white rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 placeholder:text-gray-500"
                />
                <div className="flex gap-1">
                  {[1,2,3,4,5].map((star) => (
                    <FaStar key={star} onClick={() => setRating(star)} className={`cursor-pointer text-lg ${star <= rating ? "text-yellow-400" : "text-gray-600"}`} />
                  ))}
                </div>
                <button onClick={adicionarComentario} className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition">
                  Enviar
                </button>
              </div>
            </div>

            {/* Lista */}
            <div className="space-y-4">
              {comentariosVisiveis.length === 0 && (
                <p className="text-gray-500 text-sm text-center py-6">Nenhum comentário ainda. Seja o primeiro!</p>
              )}
              {comentariosVisiveis.map((comentario, index) => (
                <div key={index} className="flex gap-3 pb-4 border-b border-white/5 last:border-0">
                  <div className="w-9 h-9 rounded-full bg-purple-600/30 flex items-center justify-center text-purple-300 shrink-0 text-sm font-bold">
                    {comentario.usuario?.nome?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-sm">{comentario.usuario?.nome || "Usuário"}</span>
                      <span className="text-green-400 text-xs">Compra verificada</span>
                    </div>
                    <div className="flex gap-0.5 mb-1">{renderStars(comentario.nota, "text-xs")}</div>
                    <p className="text-gray-300 text-sm">{comentario.comentario}</p>
                  </div>
                </div>
              ))}
            </div>

            {comentarios.length > 3 && (
              <button
                onClick={() => setMostrarTodos(!mostrarTodos)}
                className="mt-4 w-full text-purple-400 text-sm hover:text-purple-300 flex items-center justify-center gap-1"
              >
                {mostrarTodos ? "Ver menos comentários ▲" : `Ver mais comentários (${comentarios.length - 3}) ▾`}
              </button>
            )}
          </div>

          {/* Especificações técnicas */}
          <div className="bg-[#1a1a2e] rounded-2xl p-6 border border-white/5 h-fit">
            <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-4">Especificações</h3>
            <div className="space-y-4">
              {[
                { icon: "🏷️", label: "Marca", valor: "Haunter" },
                { icon: "📦", label: "Modelo", valor: produto.nome },
                { icon: "🔌", label: "Conexão", valor: "USB" },
                { icon: "🎯", label: "DPI", valor: "Até 7200 DPI" },
                { icon: "⚖️", label: "Peso", valor: "98g" },
                { icon: "🛡️", label: "Garantia", valor: "12 meses" },
              ].map(({ icon, label, valor }) => (
                <div key={label} className="flex items-start gap-3 pb-3 border-b border-white/5 last:border-0">
                  <span className="text-lg">{icon}</span>
                  <div>
                    <p className="text-gray-500 text-xs">{label}</p>
                    <p className="text-white text-sm font-medium">{valor}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        

      </div>

      <Footer />
    </>
  );
}