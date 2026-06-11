import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { produtosAPI } from "@/services/api";
import { toast } from "react-toastify";
import { useProdutos } from "@/context/ProdutosContext";

export default function EditarProduto() {
  const router = useRouter();
  const { id } = router.query;

  const [loading, setLoading] = useState(true);

  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [preco, setPreco] = useState("");
  const { carregarProdutos } = useProdutos();

  useEffect(() => {
    if (!id) return;

    async function carregarProduto() {
      try {
        const produto = await produtosAPI.getById(Number(id));

        setNome(produto.nome || "");
        setDescricao(produto.descricao || "");
        setPreco(String(produto.preco || ""));
      } catch (error) {
        console.error(error);
        alert("Erro ao carregar produto");
      } finally {
        setLoading(false);
      }
    }

    carregarProduto();
  }, [id]);

  const salvar = async () => {
    try {
      await produtosAPI.update(Number(id), {
        nome,
        descricao,
        preco: Number(preco),
      });

      await carregarProdutos();

      toast.success("Produto atualizado com sucesso!");

      router.push("/");

      setTimeout(() => {
        router.push("/");
      }, 1200);
    } catch (error) {
      console.error(error);

      toast.error("Erro ao atualizar produto");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center text-white">
        Carregando produto...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0f0f1a] flex justify-center items-center p-6">
      <div className="w-full max-w-2xl bg-[#181825] border border-purple-700 rounded-xl p-8">
        <h1 className="text-3xl font-bold text-white mb-8">Editar Produto</h1>

        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-white mb-2">Nome</label>

            <input
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="w-full bg-[#232336] text-white rounded-lg p-3 border border-purple-900"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Descrição</label>

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows={5}
              className="w-full bg-[#232336] text-white rounded-lg p-3 border border-purple-900"
            />
          </div>

          <div>
            <label className="block text-white mb-2">Preço</label>

            <input
              type="number"
              value={preco}
              onChange={(e) => setPreco(e.target.value)}
              className="w-full bg-[#232336] text-white rounded-lg p-3 border border-purple-900"
            />
          </div>

          <div className="flex gap-3 mt-4">
            <button
              onClick={() => router.back()}
              className="flex-1 bg-gray-600 text-white py-3 rounded-lg"
            >
              Cancelar
            </button>

            <button
              onClick={salvar}
              className="flex-1 bg-purple-700 hover:bg-purple-800 text-white py-3 rounded-lg"
            >
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
