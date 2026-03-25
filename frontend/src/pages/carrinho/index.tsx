import { useEffect, useState } from "react";
import Image from "next/image";
import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import { todosProdutos, Produto } from "../../produtos";

type ItemCarrinho = {
    id: number;
    quantidade: number;
};

export default function Carrinho() {
    const [itensCarrinho, setItensCarrinho] = useState<
        (Produto & { quantidade: number })[]
    >([]);

    useEffect(() => {
        const salvo = localStorage.getItem("carrinho");
        const itens: ItemCarrinho[] = salvo ? JSON.parse(salvo) : [];

        const produtosComQuantidade = itens.map((item) => {
            const produto = todosProdutos.find((p) => p.id === item.id);
            return produto ? { ...produto, quantidade: item.quantidade } : null;
        }).filter(Boolean) as (Produto & { quantidade: number })[];

        setItensCarrinho(produtosComQuantidade);
    }, []);

    const removerDoCarrinho = (id: number) => {
        const novos = itensCarrinho.filter((p) => p.id !== id);
        setItensCarrinho(novos);

        localStorage.setItem(
            "carrinho",
            JSON.stringify(novos.map((p) => ({ id: p.id, quantidade: p.quantidade })))
        );
    };

    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <NavBar />

            <main className="flex-1">
                <h1 className="flex justify-center text-white text-3xl font-bold mt-10">
                    Carrinho
                </h1>

                {itensCarrinho.length === 0 ? (
                    <p className="text-white text-center mt-10 text-lg">
                        Seu carrinho está vazio.
                    </p>
                ) : (
                    <div className="grid grid-cols-3 gap-10 p-10">
                        {itensCarrinho.map((produto) => (
                            <div
                                key={produto.id}
                                className="rounded-lg shadow-md p-4 border-2 border-white w-80"
                            >
                                <Image
                                    src={produto.imagem}
                                    alt={produto.nome}
                                    width={300}
                                    height={200}
                                />

                                <h2 className="text-white text-xl font-bold mt-4">
                                    {produto.nome}
                                </h2>

                                <p className="text-white">{produto.descricao}</p>

                                <p className="text-white font-bold text-xl mt-2">
                                    {produto.preco}
                                </p>

                                <p className="text-white mt-2">
                                    Quantidade: {produto.quantidade}
                                </p>

                                <div className="flex gap-8">
                  <button
                    onClick={() => removerDoCarrinho(produto.id)}
                    className="mt-4 bg-red-600 text-white  py-2 rounded hover:bg-red-800 w-40"
                  >
                    Remover do carrinho
                  </button>
                  <div className="flex gap-30 items-center mt-4">
                    <button className="bg-[#A636E9] text-white px-4 py-2 rounded hover:bg-[#430883]">
                      Comprar
                    </button>
                  </div>
                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}