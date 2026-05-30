import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import { useRouter } from "next/router";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { FaLock, FaCreditCard, FaBarcode, FaMapMarkerAlt, FaChevronDown } from "react-icons/fa";
import { useCarrinho } from "@/context/CarrinhoContext";
import { useAuth } from "@/context/AuthContext";
import { pedidosAPI } from "@/services/api";
import { toast } from "react-toastify";

const PARCELAS_MAX = 12;
const JUROS_POR_PARCELA = 0.0199;

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

export default function Finalizar() {
  const router = useRouter();
  const { usuario, token } = useAuth();
  const { itens, limparCarrinho } = useCarrinho();

  const [pagamento, setPagamento] = useState<"credito" | "debito" | "boleto">("credito");
  const [parcelas, setParcelas] = useState(1);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);
  const [loading, setLoading] = useState(false);

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

  const handleConfirmarPedido = async () => {
    if (!usuario) {
      toast.error("Usuário não autenticado");
      return;
    }

    try {
      setLoading(true);
      await pedidosAPI.finalize(usuario.id);
      await limparCarrinho();
      setPedidoConcluido(true);
      toast.success("Pedido realizado com sucesso!");
    } catch (error: any) {
      toast.error(error.message || "Erro ao finalizar pedido");
    } finally {
      setLoading(false);
    }
  };

  if (!usuario) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
          <p className="text-white text-lg">Faça login para finalizar sua compra</p>
          <Link href="/entrar" className="text-purple-400 hover:text-purple-300">
            Ir para login
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (itens.length === 0 && !pedidoConcluido) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
          <p className="text-white text-lg">Seu carrinho está vazio</p>
          <Link href="/" className="text-purple-400 hover:text-purple-300">
            Voltar para loja
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  if (pedidoConcluido) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-white">Pedido confirmado!</h1>
          <p className="text-gray-300 text-center max-w-md">
            Seu pedido foi realizado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>
          <Link
            href="/"
            className="mt-4 bg-[#5a10a8] text-white px-8 py-3 rounded-lg hover:bg-[#3a0a6a] transition"
          >
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  const totalCarrinho = itens.reduce((acc, item) => acc + (item.produto?.preco || 0) * item.quantidade, 0);

  return (
    <>
      <Header />
      <NavBar />

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
                <span className={`text-xs mt-1 ${etapa >= e.n ? "text-purple-400" : "text-gray-500"}`}>
                  {e.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-24 h-0.5 mb-4 mx-1 transition-all ${etapa > e.n ? "bg-[#5a10a8]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-8 items-start">
          {/* Coluna principal */}
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
                        const v = e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
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
                      onChange={(e) => setEndereco((prev) => ({ ...prev, estado: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Rua</label>
                    <input
                      type="text"
                      placeholder="Nome da rua"
                      value={endereco.rua}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, rua: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Número</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={endereco.numero}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, numero: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto, bloco..."
                      value={endereco.complemento}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, complemento: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Bairro</label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, bairro: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Cidade</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, cidade: e.target.value }))}
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
                    { key: "boleto", label: "Boleto", icon: <FaBarcode /> },
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
                        onChange={(e) => setCartao((p) => ({ ...p, numero: formatarCartao(e.target.value) }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm mb-1 block">Nome no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME SOBRENOME"
                        value={cartao.nome}
                        onChange={(e) => setCartao((p) => ({ ...p, nome: e.target.value.toUpperCase() }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cartao.validade}
                        onChange={(e) => setCartao((p) => ({ ...p, validade: formatarValidade(e.target.value) }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        value={cartao.cvv}
                        onChange={(e) => setCartao((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
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
                                {n}x de {calcularParcela(totalCarrinho, n)}
                                {n === 1 ? " (sem juros)" : " (1,99% a.m.)"}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                        </div>
                        {parcelas > 1 && (
                          <p className="text-xs text-gray-400 mt-2">
                            Total: <span className="text-white font-semibold">{calcularTotal(totalCarrinho, parcelas)}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {pagamento === "boleto" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 text-center">
                    <FaBarcode className="text-yellow-400 text-4xl mx-auto mb-3" />
                    <p className="text-yellow-300 font-semibold">Pagamento via Boleto Bancário</p>
                    <p className="text-gray-400 text-sm mt-2">
                      O boleto será gerado após confirmar o pedido. Vencimento em 3 dias úteis.
                    </p>
                    <p className="text-white font-bold text-lg mt-3">R$ {totalCarrinho.toFixed(2).replace(".", ",")} à vista</p>
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
                        {endereco.rua}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}
                      </p>
                      <p className="text-gray-300">
                        {endereco.bairro} — {endereco.cidade}/{endereco.estado} · {endereco.cep}
                      </p>
                    </div>

                    <div className="bg-white/5 rounded-xl p-4">
                      <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Pagamento</p>
                      {pagamento === "boleto" ? (
                        <p className="text-white">Boleto Bancário — R$ {totalCarrinho.toFixed(2).replace(".", ",")} à vista</p>
                      ) : (
                        <p className="text-white">
                          {pagamento === "credito" ? "Cartão de Crédito" : "Cartão de Débito"} ···· {cartao.numero.slice(-4)} —{" "}
                          {parcelas}x de {calcularParcela(totalCarrinho, parcelas)}
                          {parcelas > 1 && (
                            <span className="text-gray-400 text-sm"> (total: {calcularTotal(totalCarrinho, parcelas)})</span>
                          )}
                        </p>
                      )}
                    </div>
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
                    <FaLock className="text-sm" /> {loading ? "Processando..." : "Confirmar pedido"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar — resumo do pedido */}
          <div className="w-80 bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
            <h3 className="text-white font-semibold mb-4">Resumo do pedido</h3>
            <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
              {itens.map((item) => (
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
                  <p className="text-white text-sm">R$ {(item.produto?.preco * item.quantidade).toFixed(2).replace(".", ",")}</p>
                </div>
              ))}
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">R$ {totalCarrinho.toFixed(2).replace(".", ",")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>
              {pagamento === "credito" && parcelas > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Juros ({parcelas}x)</span>
                  <span className="text-yellow-400">
                    {(parseFloat(calcularTotal(totalCarrinho, parcelas)) - totalCarrinho).toFixed(2).replace(".", ",")}
                  </span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-purple-400">
                  {pagamento === "credito" && parcelas > 1
                    ? calcularTotal(totalCarrinho, parcelas)
                    : `R$ ${totalCarrinho.toFixed(2).replace(".", ",")}`}
                </span>
              </div>
              {pagamento === "credito" && (
                <p className="text-gray-400 text-xs text-right">
                  {parcelas}x de {calcularParcela(totalCarrinho, parcelas)}
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

export default function Finalizar() {
  const router = useRouter();
  const { id } = router.query;

 const [produto, setProduto] = useState<Produto>(todosProdutos[0]);
  const [pagamento, setPagamento] = useState<"credito" | "debito" | "boleto">("credito");
  const [parcelas, setParcelas] = useState(1);
  const [etapa, setEtapa] = useState<1 | 2 | 3>(1);
  const [pedidoConcluido, setPedidoConcluido] = useState(false);

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

useEffect(() => {
  if (!router.isReady) return; 
  const encontrado = todosProdutos.find((p) => p.id === Number(id));
  if (encontrado) {
    setProduto(encontrado);
  } else {

    setProduto(todosProdutos[0]);
  }
}, [router.isReady, id]);

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

 
  if (pedidoConcluido) {
    return (
      <>
        <Header />
        <NavBar />
        <div className="min-h-[70vh] flex flex-col items-center justify-center gap-6 min-h-screen">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center text-white text-4xl">
            ✓
          </div>
          <h1 className="text-3xl font-bold text-white">Pedido confirmado!</h1>
          <p className="text-gray-300 text-center max-w-md">
            Seu pedido de <span className="text-purple-400 font-semibold">{produto.nome}</span> foi
            realizado com sucesso. Você receberá um e-mail de confirmação em breve.
          </p>
          <Link
            href="/"
            className="mt-4 bg-[#5a10a8] text-white px-8 py-3 rounded-lg hover:bg-[#3a0a6a] transition"
          >
            Voltar para a loja
          </Link>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <NavBar />

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
                <span className={`text-xs mt-1 ${etapa >= e.n ? "text-purple-400" : "text-gray-500"}`}>
                  {e.label}
                </span>
              </div>
              {i < 2 && (
                <div className={`w-24 h-0.5 mb-4 mx-1 transition-all ${etapa > e.n ? "bg-[#5a10a8]" : "bg-white/10"}`} />
              )}
            </div>
          ))}
        </div>

        <div className="flex gap-8 items-start">
          {/* Coluna principal */}
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
                        const v = e.target.value.replace(/\D/g, "").slice(0, 8).replace(/(\d{5})(\d)/, "$1-$2");
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
                      onChange={(e) => setEndereco((prev) => ({ ...prev, estado: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="text-gray-400 text-sm mb-1 block">Rua</label>
                    <input
                      type="text"
                      placeholder="Nome da rua"
                      value={endereco.rua}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, rua: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Número</label>
                    <input
                      type="text"
                      placeholder="123"
                      value={endereco.numero}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, numero: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Complemento</label>
                    <input
                      type="text"
                      placeholder="Apto, bloco..."
                      value={endereco.complemento}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, complemento: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Bairro</label>
                    <input
                      type="text"
                      placeholder="Bairro"
                      value={endereco.bairro}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, bairro: e.target.value }))}
                      className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                    />
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm mb-1 block">Cidade</label>
                    <input
                      type="text"
                      placeholder="Cidade"
                      value={endereco.cidade}
                      onChange={(e) => setEndereco((prev) => ({ ...prev, cidade: e.target.value }))}
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

                {/* Seletor de tipo */}
                <div className="grid grid-cols-3 gap-3 mb-6">
                  {[
                    { key: "credito", label: "Crédito", icon: <FaCreditCard /> },
                    { key: "debito", label: "Débito", icon: <FaCreditCard /> },
                    { key: "boleto", label: "Boleto", icon: <FaBarcode /> },
                  ].map((op) => (
                    <button
                      key={op.key}
                      onClick={() => { setPagamento(op.key as any); setParcelas(1); }}
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

                {/* Campos cartão */}
                {(pagamento === "credito" || pagamento === "debito") && (
                  <div className="grid grid-cols-2 gap-4">
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm mb-1 block">Número do cartão</label>
                      <input
                        type="text"
                        placeholder="0000 0000 0000 0000"
                        value={cartao.numero}
                        onChange={(e) => setCartao((p) => ({ ...p, numero: formatarCartao(e.target.value) }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="text-gray-400 text-sm mb-1 block">Nome no cartão</label>
                      <input
                        type="text"
                        placeholder="NOME SOBRENOME"
                        value={cartao.nome}
                        onChange={(e) => setCartao((p) => ({ ...p, nome: e.target.value.toUpperCase() }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">Validade</label>
                      <input
                        type="text"
                        placeholder="MM/AA"
                        value={cartao.validade}
                        onChange={(e) => setCartao((p) => ({ ...p, validade: formatarValidade(e.target.value) }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>
                    <div>
                      <label className="text-gray-400 text-sm mb-1 block">CVV</label>
                      <input
                        type="text"
                        placeholder="000"
                        value={cartao.cvv}
                        onChange={(e) => setCartao((p) => ({ ...p, cvv: e.target.value.replace(/\D/g, "").slice(0, 3) }))}
                        className="w-full bg-white/10 border border-white/20 text-white rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-500 placeholder:text-gray-500"
                      />
                    </div>

                    {/* Parcelas — só no crédito */}
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
                                {n}x de {calcularParcela(produto.preco, n)}
                                {n === 1 ? " (sem juros)" : " (1,99% a.m.)"}
                              </option>
                            ))}
                          </select>
                          <FaChevronDown className="absolute right-4 top-4 text-gray-400 pointer-events-none" />
                        </div>
                        {parcelas > 1 && (
                          <p className="text-xs text-gray-400 mt-2">
                            Total: <span className="text-white font-semibold">{calcularTotal(produto.preco, parcelas)}</span>
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                )}

                {/* Boleto */}
                {pagamento === "boleto" && (
                  <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-xl p-5 text-center">
                    <FaBarcode className="text-yellow-400 text-4xl mx-auto mb-3" />
                    <p className="text-yellow-300 font-semibold">Pagamento via Boleto Bancário</p>
                    <p className="text-gray-400 text-sm mt-2">
                      O boleto será gerado após confirmar o pedido. Vencimento em 3 dias úteis.
                    </p>
                    <p className="text-white font-bold text-lg mt-3">{produto.preco} à vista</p>
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
  <div className="bg-white/5 border border-white/10 rounded-2xl p-8  flex flex-col justify-between">
    <div>
      <h2 className="text-white text-xl font-semibold mb-6">Revisão do pedido</h2>

      <div className="space-y-5">
        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Entrega</p>
          <p className="text-white">{endereco.rua}, {endereco.numero} {endereco.complemento && `- ${endereco.complemento}`}</p>
          <p className="text-gray-300">{endereco.bairro} — {endereco.cidade}/{endereco.estado} · {endereco.cep}</p>
        </div>

        <div className="bg-white/5 rounded-xl p-4">
          <p className="text-gray-400 text-xs uppercase tracking-widest mb-2">Pagamento</p>
          {pagamento === "boleto" ? (
            <p className="text-white">Boleto Bancário — {produto.preco} à vista</p>
          ) : (
            <p className="text-white">
              {pagamento === "credito" ? "Cartão de Crédito" : "Cartão de Débito"} ···· {cartao.numero.slice(-4)} —{" "}
              {parcelas}x de {calcularParcela(produto.preco, parcelas)}
              {parcelas > 1 && <span className="text-gray-400 text-sm"> (total: {calcularTotal(produto.preco, parcelas)})</span>}
            </p>
          )}
        </div>
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
        onClick={() => setPedidoConcluido(true)}
        className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
      >
        <FaLock className="text-sm" /> Confirmar pedido
      </button>
    </div>
  </div>
)}
          </div>

          {/* Sidebar — resumo do produto */}
          <div className="w-80 bg-white/5 border border-white/10 rounded-2xl p-6 sticky top-6">
            <h3 className="text-white font-semibold mb-4">Resumo do pedido</h3>
            <div className="flex gap-3 items-center mb-4">
              <Image
                src={produto.imagem}
                alt={produto.nome}
                width={64}
                height={64}
                className="rounded-lg object-cover"
              />
              <div>
                <p className="text-white text-sm font-medium">{produto.nome}</p>
                <p className="text-gray-400 text-xs">{produto.descricao}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Subtotal</span>
                <span className="text-white">{produto.preco}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Frete</span>
                <span className="text-green-400">Grátis</span>
              </div>
              {pagamento === "credito" && parcelas > 1 && (
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Juros ({parcelas}x)</span>
                  <span className="text-yellow-400">{calcularTotal(produto.preco, parcelas)}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-base pt-2 border-t border-white/10">
                <span className="text-white">Total</span>
                <span className="text-purple-400">
                  {pagamento === "credito" && parcelas > 1
                    ? calcularTotal(produto.preco, parcelas)
                    : produto.preco}
                </span>
              </div>
              {pagamento === "credito" && (
                <p className="text-gray-400 text-xs text-right">
                  {parcelas}x de {calcularParcela(produto.preco, parcelas)}
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