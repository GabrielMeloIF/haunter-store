import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import Link from "next/link";
import Image from "next/image";

const compras = [
  {
    id: 58,
    nome: "Mouse Gamer RGB",
    preco: 149.99,
    imagem:
      "https://m.media-amazon.com/images/I/61hzuoXwjqL._AC_SX679_.jpg",
    dataCompra: "2026-03-19",
  },
  {
    id: 59,
    nome: "Teclado Mecânico RGB",
    preco: 299.99,
    imagem:
      "https://m.media-amazon.com/images/I/71WHv8fMREL._AC_SL1500_.jpg",
    dataCompra: "2026-03-10",
  },
  {
    id: 60,
    nome: "Headset Gamer",
    preco: 199.99,
    imagem:
      "https://m.media-amazon.com/images/I/61M4K8A1VPL._AC_SL1500_.jpg",
    dataCompra: "2026-02-28",
  },
];

export default function Compras() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 px-4">
        <div className="flex justify-center">
          <h1 className="text-4xl font-bold text-white mt-10">
            Suas Compras
          </h1>
        </div>

        <div className="flex flex-col gap-5 mt-10 max-w-4xl mx-auto">
          {compras.map((produto) => (
            <div
              key={produto.id}
              className="bg-[#1a1a2e] rounded-2xl border-2 border-purple-900 p-4 flex flex-col md:flex-row items-center gap-5 scale-100 hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={produto.imagem}
                alt={produto.nome}
                width={120}
                height={120}
                className="rounded-xl object-cover"
              />

              <div className="flex-1">
                <h2 className="text-xl font-bold text-white">
                  {produto.nome}
                </h2>

                <p className="text-[#A636E9] font-bold text-lg mt-2">
                  R$ {produto.preco.toFixed(2)}
                </p>

                <p className="text-gray-300 text-sm mt-1">
                  Comprado em{" "}
                  {new Date(produto.dataCompra).toLocaleDateString("pt-BR")}
                </p>
              </div>

              <div className="flex flex-col gap-2 w-full md:w-auto">
                <Link
                  href={`/comprar?id=${produto.id}`}
                  className="bg-[#A636E9] hover:bg-[#591b9b] text-white font-bold px-4 py-2 rounded text-center transition"
                >
                  Avaliar Produto
                </Link>

                <Link
                  href={`/comprar?id=${produto.id}`}
                  className="bg-[#A636E9] hover:bg-[#591b9b] text-white font-bold px-4 py-2 rounded text-center transition"
                >
                  Comprar Novamente
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>

      <Footer />
    </div>
  );
}