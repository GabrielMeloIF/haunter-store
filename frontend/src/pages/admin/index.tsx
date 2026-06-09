"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/Components/Header/Header"
import Footer from "@/Components/Footer/Footer"
import { useAuth } from "@/context/AuthContext"
import { pedidosAPI, produtosAPI, usersAPI, cuponAPI } from "@/services/api"
import { toast } from "react-toastify"

interface DashboardData {
  totalPedidos: number
  totalProdutos: number
  totalUsuarios: number
  totalCupons: number
}

interface PedidoResumo {
  id_pedido: number
  valor_total: number
  status: string
  data_pedido: string
  usuario?: {
    id_usuario: number
    nome: string
    email: string
  }
}

const nextStatusMap: Record<string, string[]> = {
  PENDENTE: ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["ENVIADO", "CANCELADO"],
  ENVIADO: ["ENTREGUE", "CANCELADO"],
  ENTREGUE: [],
  CANCELADO: [],
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  })
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

export default function AdminPage() {
  const router = useRouter()
  const { usuario, token, loading } = useAuth()
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)
  const [pedidos, setPedidos] = useState<PedidoResumo[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!loading) {
      if (!usuario || !token) {
        router.push("/entrar")
        return
      }
      if (usuario.tipo?.toUpperCase() !== "ADMIN") {
        router.push("/")
        return
      }

      loadAdminData()
    }
  }, [loading, usuario, token, router])

  async function loadAdminData() {
    setIsLoading(true)
    try {
      const authToken: string = token ?? ""
      const [allPedidos, allProdutos, allUsuarios, allCupons] = await Promise.all([
        pedidosAPI.getAll(authToken),
        produtosAPI.getAll(authToken),
        usersAPI.getAll(authToken),
        cuponAPI.getAll(authToken),
      ])

      setDashboard({
        totalPedidos: Array.isArray(allPedidos) ? allPedidos.length : 0,
        totalProdutos: Array.isArray(allProdutos) ? allProdutos.length : 0,
        totalUsuarios: Array.isArray(allUsuarios) ? allUsuarios.length : 0,
        totalCupons: Array.isArray(allCupons) ? allCupons.length : 0,
      })

      setPedidos(
        Array.isArray(allPedidos)
          ? allPedidos
              .sort(
                (a, b) =>
                  new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime(),
              )
              .slice(0, 6)
          : [],
      )
    } catch (error: any) {
      toast.error(error?.message || "Não foi possível carregar os dados do painel")
    } finally {
      setIsLoading(false)
    }
  }

  async function handleStatusChange(pedidoId: number, status: string) {
    if (!token) return
    try {
      await pedidosAPI.updateStatus(pedidoId, status, token)
      toast.success(`Pedido ${pedidoId} atualizado para ${status}`)
      await loadAdminData()
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar status")
    }
  }

  return (
    <>
      <Header />

      <main className="min-h-screen bg-slate-50 text-slate-900">
        <section className="max-w-7xl mx-auto px-4 py-8">
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Administração</p>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Acesse os principais indicadores e controle pedidos, produtos, usuários e cupons.
              </p>
            </div>
            <div className="rounded-3xl border border-purple-200 bg-white px-5 py-4 shadow-sm">
              <p className="text-sm text-slate-500">Usuário</p>
              <p className="text-lg font-semibold">{usuario?.nome}</p>
              <p className="text-sm text-slate-500">Função: {usuario?.tipo}</p>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 uppercase">Pedidos</p>
              <p className="mt-4 text-4xl font-bold">{dashboard?.totalPedidos ?? "--"}</p>
              <p className="mt-2 text-sm text-slate-500">Total de pedidos realizados</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 uppercase">Produtos</p>
              <p className="mt-4 text-4xl font-bold">{dashboard?.totalProdutos ?? "--"}</p>
              <p className="mt-2 text-sm text-slate-500">Produtos disponíveis no catálogo</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 uppercase">Usuários</p>
              <p className="mt-4 text-4xl font-bold">{dashboard?.totalUsuarios ?? "--"}</p>
              <p className="mt-2 text-sm text-slate-500">Usuários registrados</p>
            </div>
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <p className="text-sm text-slate-500 uppercase">Cupons</p>
              <p className="mt-4 text-4xl font-bold">{dashboard?.totalCupons ?? "--"}</p>
              <p className="mt-2 text-sm text-slate-500">Cupons disponíveis</p>
            </div>
          </div>

          <section className="mt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold">Últimos pedidos</h2>
              <button
                type="button"
                onClick={loadAdminData}
                className="inline-flex items-center rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800"
              >
                {isLoading ? "Atualizando..." : "Atualizar"}
              </button>
            </div>

            <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200 bg-white shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Pedido</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Cliente</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Valor</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Status</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Data</th>
                    <th className="px-4 py-3 text-sm font-semibold text-slate-600">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {pedidos.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-4 py-5 text-center text-slate-500">
                        Nenhum pedido encontrado.
                      </td>
                    </tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id_pedido}>
                        <td className="px-4 py-4 text-sm font-semibold text-slate-900">#{pedido.id_pedido}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {pedido.usuario?.nome ?? "—"}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatCurrency(pedido.valor_total)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          <span className="inline-flex rounded-full bg-purple-100 px-3 py-1 text-xs font-semibold text-purple-700">
                            {pedido.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">
                          {formatDate(pedido.data_pedido)}
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600 space-x-2">
                          {nextStatusMap[pedido.status]?.map((statusOption) => (
                            <button
                              key={statusOption}
                              type="button"
                              onClick={() => handleStatusChange(pedido.id_pedido, statusOption)}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:bg-slate-200"
                            >
                              {statusOption}
                            </button>
                          ))}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          <section className="mt-10 grid gap-4 md:grid-cols-3">
            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold">Gerenciar Produtos</h3>
              <p className="mt-2 text-sm text-slate-500">
                Utilize as APIs de produto para criar, editar e excluir itens do catálogo.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => router.push('/anunciar')}
                  className="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
                >
                  Novo produto
                </button>
                <button
                  type="button"
                  onClick={() => router.push('/meus-anuncios')}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                >
                  Meus anúncios
                </button>
              </div>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
              <p className="mt-2 text-sm text-slate-500">
                O painel permite consultar usuários e editar seu cadastro diretamente pela API.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-6 shadow-sm border border-slate-200">
              <h3 className="text-lg font-semibold">Cupons</h3>
              <p className="mt-2 text-sm text-slate-500">
                Verifique cupons criados e valide códigos para campanhas e promoções.
              </p>
            </div>
          </section>
        </section>
      </main>

      <Footer />
    </>
  )
}
