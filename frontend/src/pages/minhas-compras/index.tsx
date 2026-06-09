import { useEffect, useState } from "react";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/context/AuthContext";
import { pedidosAPI } from "@/services/api";

type PedidoItem = {
  id_item: number;
  quantidade: number;
  preco_unitario: number;
  produto: {
    id: number;
    nome: string;
    imagem_url?: string | null;
    preco: number;
  };
};

type Pedido = {
  id_pedido: number;
  data_pedido: string;
  status: string;
  valor_total: number;
  itempedido: PedidoItem[];
};

export default function Compras() {
  const { usuario } = useAuth();
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!usuario) {
      setLoading(false);
      return;
    }

    const carregarPedidos = async () => {
      try {
        setLoading(true);
        const data = await pedidosAPI.getByUser(usuario.id);
        setPedidos(Array.isArray(data) ? data : []);
      } catch (err: any) {
        setError(err.message || "Erro ao buscar seus pedidos");
      } finally {
        setLoading(false);
      }
    };

    carregarPedidos();
  }, [usuario]);

  if (!usuario) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />

        <main className="flex-1 flex flex-col items-center justify-center px-6 py-10 text-center">
          <p className="text-white text-lg mb-4">Faça login para ver suas compras.</p>
          <Link href="/entrar" className="bg-[#A636E9] hover:bg-[#591b9b] text-white font-bold px-6 py-3 rounded transition">
            Entrar
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4 py-10">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold text-white mt-10">Suas Compras</h1>
        </div>

        <div className="max-w-5xl mx-auto mt-10">
          {loading ? (
            <div className="text-white text-center py-20">Carregando seus pedidos...</div>
          ) : error ? (
            <div className="text-red-400 text-center py-20">{error}</div>
          ) : pedidos.length === 0 ? (
            <div className="text-white text-center py-20">
              <p className="mb-4">Você ainda não tem pedidos.</p>
              <Link href="/" className="bg-[#A636E9] hover:bg-[#591b9b] text-white font-bold px-6 py-3 rounded transition">
                Ir para a loja
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {pedidos.map((pedido) => (
                <div key={pedido.id_pedido} className="bg-[#1a1a2e] rounded-3xl border border-purple-900 p-6">
                  <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="text-sm text-gray-400">Pedido #{pedido.id_pedido}</p>
                      <h2 className="text-xl font-bold text-white">{new Date(pedido.data_pedido).toLocaleDateString("pt-BR")}</h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="rounded-full bg-purple-900 px-3 py-1 text-sm font-semibold text-purple-100">
                        {pedido.status}
                      </span>
                      <span className="text-white font-semibold">Total: R$ {pedido.valor_total.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="mt-6 grid gap-4">
                    {pedido.itempedido.map((item) => (
                      <div key={item.id_item} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 md:flex-row md:items-center md:justify-between">
                        <div className="flex items-center gap-4">
                          <Image
                            src={item.produto.imagem_url || "/mouse 1.png"}
                            alt={item.produto.nome}
                            width={110}
                            height={110}
                            className="h-28 w-28 rounded-xl object-cover"
                          />
                          <div>
                            <p className="text-white font-bold">{item.produto.nome}</p>
                            <p className="text-gray-400 text-sm">Quantidade: {item.quantidade}</p>
                            <p className="text-purple-400 text-sm">R$ {item.preco_unitario.toFixed(2)}</p>
                          </div>
                        </div>

                        <div className="flex flex-col gap-2 md:flex-row md:items-center">
                          <Link
                            href={`/comprar?id=${item.produto.id}`}
                            className="bg-[#A636E9] hover:bg-[#591b9b] text-white px-4 py-2 rounded text-center transition"
                          >
                            Avaliar Produto
                          </Link>
                          <Link
                            href={`/comprar?id=${item.produto.id}`}
                            className="bg-[#A636E9] hover:bg-[#591b9b] text-white px-4 py-2 rounded text-center transition"
                          >
                            Comprar Novamente
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
