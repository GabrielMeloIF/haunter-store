import { useEffect } from "react";
import { useRouter } from "next/router";
import Image from "next/image";
import Link from "next/link";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import { useSearch } from "@/context/SearchContext";

export default function Busca() {
  const router = useRouter();
  const { q } = router.query;
  const { resultados, loading, erro, buscarProdutos } = useSearch();

  useEffect(() => {
    if (q && typeof q === "string") {
      buscarProdutos(q);
    }
  }, [q, buscarProdutos]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />

      <main className="flex-1 px-4 md:px-10 py-10">
        <h1 className="text-white text-3xl font-bold mb-6">
          Resultados para: <span className="text-purple-500">"{q}"</span>
        </h1>

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
          </div>
        ) : erro ? (
          <div className="bg-red-500/20 border border-red-500 text-red-200 px-4 py-3 rounded-lg">
            {erro}
          </div>
        ) : resultados.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-lg">
              Nenhum produto encontrado para sua busca.
            </p>
            <Link href="/" className="text-purple-500 hover:text-purple-400 mt-4 inline-block">
              Voltar para a página inicial
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {resultados.map((produto) => (
              <Link key={produto.id} href={`/produtos/${produto.id}`}>
                <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-700 hover:border-purple-500">
                  <div className="relative w-full h-40 bg-gray-700">
                    <Image
                      src={produto.imagem_url || "/placeholder.png"}
                      alt={produto.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h2 className="text-white text-sm font-semibold line-clamp-2 mb-2">
                      {produto.nome}
                    </h2>
                    <p className="text-gray-400 text-xs line-clamp-2 mb-3">
                      {produto.descricao}
                    </p>
                    <div className="flex justify-between items-center">
                      <span className="text-purple-400 font-bold text-lg">
                        R$ {produto.preco.toFixed(2)}
                      </span>
                      <span className="text-gray-500 text-xs">
                        {produto.estoque > 0 ? "Em estoque" : "Fora de estoque"}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
