import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  FaLock,
  FaCreditCard,
  FaMapMarkerAlt,
  FaChevronDown,
  FaQrcode,
  FaTag,
  FaCheckCircle,
  FaTimesCircle,
} from "react-icons/fa";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import { pedidosAPI, produtosAPI, cuponAPI } from "@/services/api";
import { toast } from "react-toastify";

const PARCELAS_MAX = 12;
const JUROS_POR_PARCELA = 0.0199;
const PIX_KEY = "pix@haunterstore.com.br";

// ─── helpers de cálculo ───────────────────────────────────────────────────────

function calcularParcela(preco: number, parcelas: number): string {
  if (parcelas === 1) return `R$ ${preco.toFixed(2).replace(".", ",")}`;
  const valorComJuros = preco * Math.pow(1 + JUROS_POR_PARCELA, parcelas);
  return `R$ ${(valorComJuros / parcelas).toFixed(2).replace(".", ",")}`;
}

function calcularTotal(preco: number, parcelas: number): string {
  if (parcelas === 1) return `R$ ${preco.toFixed(2).replace(".", ",")}`;
  const total = preco * Math.pow(1 + JUROS_POR_PARCELA, parcelas);
  return `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function calcularJuros(preco: number, parcelas: number): string {
  if (parcelas === 1) return "R$ 0,00";
  const total = preco * Math.pow(1 + JUROS_POR_PARCELA, parcelas);
  const juros = total - preco;
  return `R$ ${juros.toFixed(2).replace(".", ",")}`;
}

// ─── tipos ────────────────────────────────────────────────────────────────────

interface CupomAplicado {
  codigo: string;
  desconto: number; // percentual, ex: 10 = 10%
  descricao: string;
}

// ─── componente de cupom (sidebar) ───────────────────────────────────────────

interface CupomBoxProps {
  idUsuario: number;
  totalCarrinho: number;
  cupomAplicado: CupomAplicado | null;
  onAplicar: (cupom: CupomAplicado) => void;
  onRemover: () => void;
}

function CupomBox({
  idUsuario,
  totalCarrinho,
  cupomAplicado,
  onAplicar,
  onRemover,
}: CupomBoxProps) {
  const [codigo, setCodigo] = useState("");
  const [loadingCupom, setLoadingCupom] = useState(false);

  const handleAplicar = async () => {
    const codigoLimpo = codigo.trim().toUpperCase();
    if (!codigoLimpo) return;

    try {
      setLoadingCupom(true);

      const data = await cuponAPI.validar(codigoLimpo, idUsuario);

      onAplicar({
        codigo: codigoLimpo,
        desconto: data.desconto,
        descricao: data.cupom?.descricao ?? `${data.desconto}% de desconto`,
      });

      setCodigo("");
      toast.success(`Cupom aplicado: ${data.desconto}% de desconto`);
    } catch (err: any) {
      toast.error(err.message ?? "Cupom inválido ou expirado");
    } finally {
      setLoadingCupom(false);
    }
  };

  if (cupomAplicado) {
    const valorDesconto = (totalCarrinho * cupomAplicado.desconto) / 100;

    return (
      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-3 flex items-start gap-3">
        <FaCheckCircle className="text-purple-400 mt-0.5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-semibold truncate">
            {cupomAplicado.codigo}
          </p>
          <p className="text-gray-400 text-xs leading-snug">
            {cupomAplicado.descricao}
          </p>
          <p className="text-purple-300 text-xs font-medium mt-0.5">
            −R$ {valorDesconto.toFixed(2).replace(".", ",")}
          </p>
        </div>
        <button
          onClick={onRemover}
          title="Remover cupom"
          className="text-gray-500 hover:text-red-400 transition shrink-0 mt-0.5"
        >
          <FaTimesCircle />
        </button>
      </div>
    );
  }

  return (
    <div className="flex gap-2">
      <div className="relative flex-1">
        <FaTag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-xs" />
        <input
          type="text"
          placeholder="Código do cupom"
          value={codigo}
          onChange={(e) => setCodigo(e.target.value.toUpperCase())}
          onKeyDown={(e) => e.key === "Enter" && handleAplicar()}
          className="w-full bg-white/10 border border-white/20 text-white text-sm rounded-lg pl-8 pr-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
        />
      </div>
      <button
        onClick={handleAplicar}
        disabled={loadingCupom || !codigo.trim()}
        className="px-4 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-semibold rounded-lg transition whitespace-nowrap"
      >
        {loadingCupom ? "..." : "Aplicar"}
      </button>
    </div>
  );
}

// ─── página principal ─────────────────────────────────────────────────────────

export default function Finalizar() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const { itens, limparCarrinho } = useCarrinho();

  const [pagamento, setPagamento] = useState<"credito" | "debito" | "pix">("credito");
  const [parcelas, setParcelas] = useState(1);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);
  const [loading, setLoading] = useState(false);
  const [produtoCheckout, setProdutoCheckout] = useState<any>(null);
  const [produtoCheckoutLoading, setProdutoCheckoutLoading] = useState(false);

  // ── estado do cupom ──────────────────────────────────────────────────────
  const [cupomAplicado, setCupomAplicado] = useState<CupomAplicado | null>(null);

  const [endereco, setEndereco] = useState({
    cep: "",
    rua: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
  });

  const [cartao, setCartao] = useState({
    numero: "",
    nome: "",
    validade: "",
    cvv: "",
  });

  const produtoIdFromQuery = Array.isArray(router.query.produtoId)
    ? router.query.produtoId[0]
    : router.query.produtoId;
  const produtoId = produtoIdFromQuery ? Number(produtoIdFromQuery) : null;

  useEffect(() => {
    if (!router.isReady || !produtoId) return;

    const carregarProdutoCheckout = async () => {
      try {
        setProdutoCheckoutLoading(true);
        const produto = await produtosAPI.getById(produtoId);
        setProdutoCheckout(produto);
      } catch (error) {
        console.error("Erro ao carregar produto para checkout direto:", error);
        setProdutoCheckout(null);
      } finally {
        setProdutoCheckoutLoading(false);
      }
    };

    carregarProdutoCheckout();
  }, [router.isReady, produtoId]);

  const buscarCep = async (cep: string) => {
    const limpo = cep.replace(/\D/g, "");
    if (limpo.length !== 8) return;
    try {
      const res = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const data = await res.json();
      if (!data.erro) {
        setEndereco((prev) => ({
          ...prev,
          rua: data.logradouro,
          bairro: data.bairro,
          cidade: data.localidade,
          estado: data.uf,
        }));
      }
    } catch {}
  };

  const formatarCartao = (v: string) =>
    v.replace(/\D/g, "").slice(0, 16).replace(/(.{4})/g, "$1 ").trim();

  const formatarValidade = (v: string) =>
    v.replace(/\D/g, "").slice(0, 4).replace(/(\d{2})(\d)/, "$1/$2");

  const handleCopiarPix = async () => {
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("Navegador não suporta copiar para a área de transferência");
      }
      await navigator.clipboard.writeText(PIX_KEY);
      toast.success("Chave Pix copiada para a área de transferência");
    } catch (error: any) {
      console.error("Erro ao copiar chave Pix:", error);
      toast.error("Não foi possível copiar a chave Pix. Tente novamente.");
    }
  };

  // ── confirmar pedido (marca cupom como utilizado se houver) ───────────────
  const handleConfirmarPedido = async () => {
    if (!usuario) {
      toast.error("Usuário não autenticado");
      return;
    }

    if (produtoId && !produtoCheckout) {
      toast.error("Produto para checkout não encontrado");
      return;
    }

    try {
      setLoading(true);

      const pedidoPromise = produtoCheckout
        ? pedidosAPI.buyProduct(usuario.id, produtoCheckout.id, 1, token ?? undefined)
        : pedidosAPI.finalize(usuario.id, token ?? undefined);

      await toast.promise(pedidoPromise, {
        pending: "Confirmando pedido...",
        success: "Pedido realizado com sucesso!",
        error: {
          render({ data }: any) {
            return data?.message || "Erro ao finalizar pedido";
          },
        },
      });

      // Marca cupom como utilizado após pedido confirmado
      if (cupomAplicado) {
        try {
          await cuponAPI.utilizar(cupomAplicado.codigo, usuario.id);
        } catch {
          // erro silencioso: não bloqueia o fluxo, pedido já foi criado
          console.warn("Não foi possível marcar cupom como utilizado");
        }
      }

      if (!produtoCheckout) {
        await limparCarrinho();
      }

      setPedidoConcluido(true);
    } catch (error: any) {
      toast.error(error.message || "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  // ── telas de estado ───────────────────────────────────────────────────────

  if (pedidoConcluido) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center px-6 py-20">
          <div className="max-w-xl w-full bg-white/5 border border-white/10 rounded-3xl p-10 text-center shadow-lg shadow-black/20">
            <h1 className="text-4xl font-bold text-white mb-4">Pedido confirmado!</h1>
            <p className="text-gray-300 mb-6">
              O pagamento foi registrado e seu pedido foi criado com sucesso. Você pode acompanhar tudo em "Minhas Compras".
            </p>
            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Link
                href="/minhas-compras"
                className="inline-flex items-center justify-center rounded-full bg-purple-600 px-6 py-3 text-white font-semibold hover:bg-purple-700 transition"
              >
                Ver meus pedidos
              </Link>
              <Link
                href="/"
                className="inline-flex items-center justify-center rounded-full border border-white/20 px-6 py-3 text-white hover:bg-white/5 transition"
              >
                Continuar comprando
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!usuario) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-white text-lg">Faça login para finalizar sua compra</p>
          <Link href="/entrar" className="text-purple-400 hover:text-purple-300">
            Ir para login
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (produtoId && produtoCheckoutLoading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-white text-lg">Carregando checkout do produto...</p>
        </div>
        <Footer />
      </>
    );
  }

  if (!produtoCheckout && itens.length === 0 && !pedidoConcluido) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex flex-col items-center justify-center gap-6">
          <p className="text-white text-lg">Seu carrinho está vazio</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Voltar para loja
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  // ── dados do checkout ─────────────────────────────────────────────────────

  const checkoutItems = produtoCheckout
    ? [
        {
          id_carrinho: 0,
          id_usuario: usuario?.id ?? 0,
          id_produto: produtoCheckout.id,
          quantidade: 1,
          produto: produtoCheckout,
        },
      ]
    : itens;

  const totalCarrinho = checkoutItems.reduce(
    (acc, item) => acc + (item.produto?.preco || 0) * item.quantidade,
    0
  );

  // Valor do desconto do cupom em reais
  const valorDesconto = cupomAplicado
    ? (totalCarrinho * cupomAplicado.desconto) / 100
    : 0;

  // Base para calcular juros/parcelas já com desconto aplicado
  const totalComDesconto = totalCarrinho - valorDesconto;

  // Total final (com desconto e eventual juros de parcelamento)
  const totalFinal =
    pagamento === "credito" && parcelas > 1
      ? totalComDesconto * Math.pow(1 + JUROS_POR_PARCELA, parcelas)
      : totalComDesconto;

  // ── render principal ──────────────────────────────────────────────────────

  return (
    <>
      <Header />

      <div className="max-w-6xl mx-auto px-6 py-10 min-h-screen">
        <h1 className="text-3xl font-bold text-white mb-8">Finalizar Compra</h1>

        {/* Indicador de etapas */}
        <div className="flex items-center gap-0 mb-10">
          {[
            { n: 1, label: "Endereço" },
            { n: 2, label: "Pagamento" },
            { n: 3, label: "Revisão" },
          ].map((e, i) => (
            <div key={e.n} className="flex items-center">
              <div className="flex flex-col items-center">
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                    etapa >= e.n
                      ? "bg-[#5a10a8] text-white"
                      : "bg-white/10 text-gray-400"
                  }`}
                >
                  {etapa > e.n ? "✓" : e.n}
                </div>
                <span
                  className={`text-xs mt-1 ${
                    etapa >= e.n ? "text-purple-400" : "text-gray-500"
                  }`}
                >
                  {e.label}
                </span>
              </div>
              {i < 2 && (
                <div
                  className={`w-24 h-0.5 mb-4 mx-1 transition-all ${
                    etapa > e.n ? "bg-[#5a10a8]" : "bg-white/10"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-8 items-start">
          {/* ── Coluna principal ────────────────────────────────────────── */}
          <div className="flex-1">

            {/* ETAPA 1 — ENDEREÇO */}
            {etapa === 1 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaMapMarkerAlt className="text-purple-400 text-xl" />
                  <h2 className="text-white text-xl font-semibold">Endereço de entrega</h2>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="col-span-1">
                    <label className="text-gray-400 text-sm mb-1 block">CEP</label>
                    <input
                      type="text"
                      placeholder="00000-000"
                      value={endereco.cep}
                      onChange={(e) => {
                        const v = e.target.value
                          .replace(/\D/g, "")
                          .slice(0, 8)
                          .replace(/(\d{5})(\d)/, "$1-$2");
                        setEndereco((prev) => ({ ...prev, cep: v }));
                        buscarCep(v);
                      }}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="col-span-1">
                    <label className="text-gray-400 text-sm mb-1 block">Estado</label>
                    <input
                      type="text"
                      placeholder="SP"
                      value={endereco.estado}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, estado: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Rua</label>
                    <input
                      type="text"
                      placeholder="Nome da rua"
                      value={endereco.rua}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, rua: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Número</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={endereco.numero}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, numero: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto, bloco..."
                      value={endereco.complemento}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, complemento: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Bairro</label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, bairro: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Cidade</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={endereco.cidade}
                      onChange={(e) =>
                        setEndereco((prev) => ({ ...prev, cidade: e.target.value }))
                      }
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                </div>

                <button
                  onClick={() => setEtapa(2)}
                  disabled={!endereco.rua || !endereco.numero || !endereco.cidade}
                  className="mt-6 w-full bg-[#5a10a8] text-white py-3 rounded-lg font-semibold hover:bg-[#3a0a6a] transition disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Continuar para pagamento →
                </button>
              </div>
            )}

            {/* ETAPA 2 — PAGAMENTO */}
            {etapa === 2 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8">
                <div className="flex items-center gap-3 mb-6">
                  <FaCreditCard className="text-purple-400 text-xl" />
                  <h2 className="text-white text-xl font-semibold">Forma de pagamento</h2>
                </div>

                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { key: "credito", label: "Crédito", icon: <FaCreditCard /> },
                    { key: "debito", label: "Débito", icon: <FaCreditCard /> },
                    { key: "pix", label: "Pix", icon: <FaQrcode /> },
                  ].map((op) => (
                    <button
                      key={op.key}
                      onClick={() => {
                        setPagamento(op.key as any);
                        setParcelas(1);
                      }}
                      className={`flex flex-col items-center gap-2 py-4 rounded-xl border transition font-medium text-sm ${
                        pagamento === op.key
                          ? "border-purple-500 bg-purple-500/20 text-purple-300"
                          : "border-white/15 bg-white/5 text-gray-400 hover:border-white/30"
                      }`}
                    >
                      <span className="text-xl">{op.icon}</span>
                      {op.label}
                    </button>
                  ))}
                </div>

                {(pagamento === "credito" || pagamento === "debito") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm mb-1 block">Número do cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cartao.numero}
                        onChange={(e) =>
                          setCartao((p) => ({ ...p, numero: formatarCartao(e.target.value) }))
                        }
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm mb-1 block">Nome no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME SOBRENOME"
                        value={cartao.nome}
                        onChange={(e) =>
                          setCartao((p) => ({ ...p, nome: e.target.value.toUpperCase() }))
                        }
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cartao.validade}
                        onChange={(e) =>
                          setCartao((p) => ({ ...p, validade: formatarValidade(e.target.value) }))
                        }
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        value={cartao.cvv}
                        onChange={(e) =>
                          setCartao((p) => ({
                            ...p,
                            cvv: e.target.value.replace(/\D/g, "").slice(0, 3),
                          }))
                        }
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>

                    {pagamento === "credito" && (
                      <div className="col-span-2">
                        <label className="text-gray-400 text-sm mb-1 block">Parcelas</label>
                        <div className="relative">
                          <select
                            value={parcelas}
                            onChange={(e) => setParcelas(Number(e.target.value))}
                            className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 appearance-none focus:outline-none focus:ring-2 focus:ring-purple-500"
                          >
                            {Array.from({ length: PARCELAS_MAX }, (_, i) => i + 1).map((n) => (
                              <option key={n} value={n} className="bg-[#1a0a2e] text-white">
                                {n}x de {calcularParcela(totalComDesconto, n)}
                                {n === 1 ? " (sem juros)" : " (1,99% a.m.)"}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                        </div>
                        {parcelas > 1 && (
                          <p className="text-xs text-gray-400 mt-2">
                            Total:{" "}
                            <span className="text-white font-semibold">
                              {calcularTotal(totalComDesconto, parcelas)}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {pagamento === "pix" && (
                  <div className="bg-green-500/10 border border-green-500/30 rounded-xl p-5 text-center">
                    <FaQrcode className="text-green-400 text-4xl mx-auto mb-3" />
                    <p className="text-green-300 font-semibold">Pagamento via Pix</p>
                    <p className="text-gray-400 text-sm mt-2">
                      Escaneie o QR code ou copie a chave Pix abaixo no seu banco de preferência.
                    </p>
                    <div className="mt-4 inline-block bg-[#0f172a] p-4 rounded-2xl text-left text-sm text-white w-full">
                      <p className="font-semibold">Chave Pix</p>
                      <p className="break-all">{PIX_KEY}</p>
                      <p className="mt-3 text-gray-300">
                        Valor: R$ {totalComDesconto.toFixed(2).replace(".", ",")}
                      </p>
                    </div>
                    <div className="mt-4">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
                          `pix://${PIX_KEY}?amount=${totalComDesconto.toFixed(2)}&msg=Haunter%20Store`
                        )}`}
                        alt="QR Code Pix"
                        className="mx-auto rounded-2xl border border-white/10"
                      />
                    </div>
                    <button
                      onClick={handleCopiarPix}
                      className="mt-4 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-full font-semibold transition"
                    >
                      Copiar chave Pix
                    </button>
                  </div>
                )}

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEtapa(1)}
                    className="px-6 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={() => setEtapa(3)}
                    className="flex-1 bg-[#5a10a8] text-white py-3 rounded-lg font-semibold hover:bg-[#3a0a6a] transition"
                  >
                    Revisar pedido →
                  </button>
                </div>
              </div>
            )}

            {/* ETAPA 3 — REVISÃO */}
            {etapa === 3 && (
              <div className="bg-white/5 border border-white/10 rounded-2xl p-8 flex flex-col justify-between">
                <div>
                  <h2 className="text-white text-xl font-semibold mb-6">Revisão do pedido</h2>

                  <div className="space-y-5">
                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Entrega</p>
                      <p className="text-white">
                        {endereco.rua}, {endereco.numero}{" "}
                        {endereco.complemento && `- ${endereco.complemento}`}
                      </p>
                      <p className="text-gray-300">
                        {endereco.bairro} — {endereco.cidade}/{endereco.estado} · {endereco.cep}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Pagamento</p>
                      {pagamento === "pix" ? (
                        <p className="text-white">
                          Pix — Chave: {PIX_KEY} · Valor: R${" "}
                          {totalComDesconto.toFixed(2).replace(".", ",")}
                        </p>
                      ) : (
                        <p className="text-white">
                          {pagamento === "credito" ? "Cartão de Crédito" : "Cartão de Débito"} ····{" "}
                          {cartao.numero.slice(-4)} — {parcelas}x de{" "}
                          {calcularParcela(totalComDesconto, parcelas)}
                          {parcelas > 1 && (
                            <span className="text-gray-400 text-sm">
                              {" "}(total: {calcularTotal(totalComDesconto, parcelas)})
                            </span>
                          )}
                        </p>
                      )}
                    </div>

                    {/* Cupom aplicado na revisão */}
                    {cupomAplicado && (
                      <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4 flex items-center gap-3">
                        <FaTag className="text-purple-400 shrink-0" />
                        <div>
                          <p className="text-gray-400 text-xs uppercase tracking-widest mb-0.5">
                            Cupom aplicado
                          </p>
                          <p className="text-white font-semibold">
                            {cupomAplicado.codigo}{" "}
                            <span className="text-purple-300 font-normal text-sm">
                              ({cupomAplicado.desconto}% de desconto)
                            </span>
                          </p>
                          <p className="text-purple-300 text-sm">
                            −R$ {valorDesconto.toFixed(2).replace(".", ",")}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <button
                    onClick={() => setEtapa(2)}
                    className="px-6 py-3 rounded-lg border border-white/20 text-gray-300 hover:bg-white/5 transition"
                  >
                    ← Voltar
                  </button>
                  <button
                    onClick={handleConfirmarPedido}
                    disabled={loading}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <FaLock className="text-sm" />{" "}
                    {loading ? "Processando..." : "Confirmar pedido"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* ── Sidebar — resumo do pedido ──────────────────────────────── */}
          <div className="w-80 bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
            <h3 className="text-white font-semibold mb-4">Resumo do pedido</h3>

            {/* Lista de itens */}
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {checkoutItems.map((item) => (
                <div key={item.id_carrinho} className="flex gap-3 items-center">
                  <Image
                    src={item.produto?.imagem_url || "/mouse 1.png"}
                    alt={item.produto?.nome}
                    width={48}
                    height={48}
                    className="rounded-lg object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "/mouse 1.png";
                    }}
                  />
                  <div className="flex-1 text-sm">
                    <p className="text-white font-medium">{item.produto?.nome}</p>
                    <p className="text-gray-400 text-xs">x{item.quantidade}</p>
                  </div>
                  <p className="text-white text-sm">
                    R$ {(item.produto?.preco * item.quantidade).toFixed(2).replace(".", ",")}
                  </p>
                </div>
              ))}
            </div>

            {/* Campo de cupom */}
            <div className="border-t border-white/10 pt-4 mb-4">
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Cupom de desconto</p>
              <CupomBox
                idUsuario={usuario.id}
                totalCarrinho={totalCarrinho}
                cupomAplicado={cupomAplicado}
                onAplicar={setCupomAplicado}
                onRemover={() => setCupomAplicado(null)}
              />
            </div>

            {/* Totais */}
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">
                  R$ {totalCarrinho.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {/* Linha de desconto — só aparece quando cupom está aplicado */}
              {cupomAplicado && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">
                    Desconto ({cupomAplicado.desconto}%)
                  </span>
                  <span className="text-purple-400">
                    −R$ {valorDesconto.toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>

              {pagamento === "credito" && parcelas > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Juros ({parcelas}x)</span>
                  <span className="text-yellow-400">
                    {calcularJuros(totalComDesconto, parcelas)}
                  </span>
                </div>
              )}

              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-purple-400">
                  R$ {totalFinal.toFixed(2).replace(".", ",")}
                </span>
              </div>

              {pagamento === "credito" && (
                <p className="text-gray-400 text-xs text-right">
                  {parcelas}x de {calcularParcela(totalComDesconto, parcelas)}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
}