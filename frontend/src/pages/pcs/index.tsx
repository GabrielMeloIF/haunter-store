import Image from "next/image";
import Link from "next/link";
import { FaStar } from "react-icons/fa";
import { useState, useEffect } from "react";

import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

import { produtosAPI, categoriasAPI } from "@/services/api";

export default function Cards() {
  const [favoritos, setFavoritos] = useState<number[]>([]);
  const [produtos, setProdutos] = useState<any[]>([]);
  const [categorias, setCategorias] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const salvo = localStorage.getItem("favoritos");

    if (salvo) {
      setFavoritos(JSON.parse(salvo));
    }
  }, []);

  useEffect(() => {
    async function carregarDados() {
      try {
        const [produtosData, categoriasData] = await Promise.all([
          produtosAPI.getAll(),
          categoriasAPI.getAll(),
        ]);

        setProdutos(produtosData);
        setCategorias(categoriasData);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoading(false);
      }
    }

    carregarDados();
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

  const categoriaPCs = categorias.find(
    (categoria) => categoria.nome_categoria === "PCs"
  );

  const produtosPCs = produtos.filter(
    (produto) =>
      produto.categoriaId === categoriaPCs?.id_categoria
  );

  const CardItem = ({ produto }: { produto: any }) => (
    <div className="rounded-lg shadow-md p-4 border-2 border-purple-900 w-80 transition-transform duration-300 hover:scale-105 mb-30">
      <div className="relative">
        <FaStar
          onClick={() => toggleFavorito(produto.id)}
          className={`absolute top-2 right-2 text-2xl cursor-pointer ${
            favoritos.includes(produto.id)
              ? "text-yellow-400"
              : "text-black"
          }`}
        />

        <Image
          src={produto.imagem_url || "/mouse 1.png"}
          alt={produto.nome}
          width={300}
          height={200}
          className="rounded"
        />
      </div>

      <h2 className="text-white text-xl font-bold mb-2 mt-5">
        {produto.nome}
      </h2>

      <p className="text-white">{produto.descricao}</p>

      <div className="flex justify-between items-center mt-4">
        <p className="text-white font-bold text-xl">
          R$ {Number(produto.preco)
            .toFixed(2)
            .replace(".", ",")}
        </p>

        <Link
          href={`/comprar?id=${produto.id}`}
          className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]"
        >
          Comprar
        </Link>
      </div>
    </div>
  );

  if (loading) {
    return (
      <>
        <Header />

        <div className="min-h-screen flex justify-center items-center">
          <p className="text-white text-xl">
            Carregando produtos...
          </p>
        </div>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />

      <div className="flex flex-col items-center gap-10 py-8">
        <h2 className="text-white font-bold text-3xl px-6 mb-6">
          PCs
        </h2>

        <div className="grid grid-cols-3 gap-8 px-6">
          {produtosPCs.map((produto) => (
            <CardItem
              key={produto.id}
              produto={produto}
            />
          ))}
        </div>

        {produtosPCs.length === 0 && (
          <p className="text-white text-xl">
            Nenhum PC encontrado.
          </p>
        )}
      </div>

      <Footer />
    </>
  );
}