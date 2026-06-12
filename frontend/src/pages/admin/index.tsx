"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Header from "@/Components/Header/Header"
import Footer from "@/Components/Footer/Footer"
import { useAuth } from "@/context/AuthContext"
import { pedidosAPI, produtosAPI, usersAPI, cuponAPI } from "@/services/api"
import { toast } from "react-toastify"

// ─── Types ───────────────────────────────────────────────────────────────────

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
  usuario?: { id_usuario: number; nome: string; email: string }
}

interface Usuario {
  id_usuario: number
  nome: string
  email: string
  tipo: string
}

interface Cupon {
  id_cupom: number
  codigo: string
  descricao: string
  desconto: number
  validade: string
}

// ─── Constants ────────────────────────────────────────────────────────────────

const nextStatusMap: Record<string, string[]> = {
  PENDENTE:  ["CONFIRMADO", "CANCELADO"],
  CONFIRMADO: ["ENVIADO", "CANCELADO"],
  ENVIADO:   ["ENTREGUE", "CANCELADO"],
  ENTREGUE:  [],
  CANCELADO: [],
}

const statusColors: Record<string, string> = {
  PENDENTE:   "bg-yellow-100 text-yellow-700",
  CONFIRMADO: "bg-blue-100 text-blue-700",
  ENVIADO:    "bg-indigo-100 text-indigo-700",
  ENTREGUE:   "bg-green-100 text-green-700",
  CANCELADO:  "bg-red-100 text-red-700",
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" })
}

function formatDate(value: string) {
  return new Date(value).toLocaleString("pt-BR", {
    day: "2-digit", month: "2-digit", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  })
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function AdminPage() {
  const router = useRouter()
  const { usuario, token, loading } = useAuth()

  const [dashboard, setDashboard] = useState<DashboardData>({
    totalPedidos: 0, totalProdutos: 0, totalUsuarios: 0, totalCupons: 0,
  })
  const [pedidos,   setPedidos]   = useState<PedidoResumo[]>([])
  const [usuarios,  setUsuarios]  = useState<Usuario[]>([])
  const [cupons,    setCupons]    = useState<Cupon[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  // Seções expansíveis
  const [openSection, setOpenSection] = useState<"usuarios" | "cupons" | null>(null)

  // Formulário novo cupom
  const [cupomForm, setCupomForm] = useState({
    codigo: "", descricao: "", desconto: "", validade: "",
  })
  const [savingCupom, setSavingCupom] = useState(false)

  // Busca usuários
  const [userSearch, setUserSearch] = useState("")

  useEffect(() => {
    if (!loading) {
      if (!usuario || !token) { router.push("/entrar"); return }
      if (usuario.tipo?.toUpperCase() !== "ADMIN") { router.push("/"); return }
      loadAdminData()
    }
  }, [loading, usuario, token, router])

  // ── Load all data ────────────────────────────────────────────────────────

  async function loadAdminData() {
    if (!token) return
    setErrorMessage(null)
    setIsLoading(true)
    try {
      const authToken = token
      const [resPedidos, resProdutos, resUsuarios, resCupons] = await Promise.allSettled([
        pedidosAPI.getAll(authToken),
        produtosAPI.getAll(authToken),
        usersAPI.getAll(authToken),
        cuponAPI.getAll(authToken),
      ])

      const allPedidos  = resPedidos.status  === "fulfilled" ? resPedidos.value  : []
      const allProdutos = resProdutos.status === "fulfilled" ? resProdutos.value : []
      const allUsuarios = resUsuarios.status === "fulfilled" ? resUsuarios.value : []
      const allCupons   = resCupons.status   === "fulfilled" ? resCupons.value   : []

      const failures = [
        resPedidos.status  === "rejected" && `pedidos: ${(resPedidos  as PromiseRejectedResult).reason?.message}`,
        resProdutos.status === "rejected" && `produtos: ${(resProdutos as PromiseRejectedResult).reason?.message}`,
        resUsuarios.status === "rejected" && `usuários: ${(resUsuarios as PromiseRejectedResult).reason?.message}`,
        resCupons.status   === "rejected" && `cupons: ${(resCupons   as PromiseRejectedResult).reason?.message}`,
      ].filter(Boolean)

      if (failures.length > 0) {
        console.warn("Rotas indisponíveis:", failures)
        toast.warn(`Dados parciais — indisponível: ${failures.join(", ")}`)
      }

      setDashboard({
        totalPedidos:  Array.isArray(allPedidos)  ? allPedidos.length  : 0,
        totalProdutos: Array.isArray(allProdutos) ? allProdutos.length : 0,
        totalUsuarios: Array.isArray(allUsuarios) ? allUsuarios.length : 0,
        totalCupons:   Array.isArray(allCupons)   ? allCupons.length   : 0,
      })

      setPedidos(
        Array.isArray(allPedidos)
          ? [...allPedidos]
              .sort((a: PedidoResumo, b: PedidoResumo) =>
                new Date(b.data_pedido).getTime() - new Date(a.data_pedido).getTime())
              .slice(0, 6)
          : []
      )
      setUsuarios(Array.isArray(allUsuarios) ? allUsuarios : [])
      setCupons(Array.isArray(allCupons) ? allCupons : [])

    } catch (error: any) {
      const message = error?.message || "Não foi possível carregar os dados do painel"
      setErrorMessage(message)
      toast.error(message)
    } finally {
      setIsLoading(false)
    }
  }

  // ── Pedidos ──────────────────────────────────────────────────────────────

  async function handleStatusChange(pedidoId: number, status: string) {
    if (!token) return
    setIsLoading(true)
    try {
      await pedidosAPI.updateStatus(pedidoId, status, token)
      toast.success(`Pedido #${pedidoId} → ${status}`)
      await loadAdminData()
    } catch (error: any) {
      toast.error(error?.message || "Erro ao atualizar status")
    } finally {
      setIsLoading(false)
    }
  }

  // ── Usuários ─────────────────────────────────────────────────────────────

  async function handleDeleteUser(id: number, nome: string) {
    if (!token) return
    if (!confirm(`Excluir o usuário "${nome}"? Esta ação não pode ser desfeita.`)) return
    try {
      await usersAPI.delete(id, token)
      toast.success(`Usuário "${nome}" removido`)
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== id))
      setDashboard((prev) => ({ ...prev, totalUsuarios: prev.totalUsuarios - 1 }))
    } catch (error: any) {
      toast.error(error?.message || "Erro ao excluir usuário")
    }
  }

  const filteredUsuarios = usuarios.filter(
    (u) =>
      u.nome?.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.email?.toLowerCase().includes(userSearch.toLowerCase())
  )

  // ── Cupons ───────────────────────────────────────────────────────────────

  async function handleDeleteCupom(id: number, codigo: string) {
    if (!token) return
    if (!confirm(`Excluir o cupom "${codigo}"?`)) return
    try {
      await cuponAPI.delete(id, token)
      toast.success(`Cupom "${codigo}" removido`)
      setCupons((prev) => prev.filter((c) => c.id_cupom !== id))
      setDashboard((prev) => ({ ...prev, totalCupons: prev.totalCupons - 1 }))
    } catch (error: any) {
      toast.error(error?.message || "Erro ao excluir cupom")
    }
  }

  async function handleCreateCupom() {
    if (!token) return
    const { codigo, descricao, desconto, validade } = cupomForm
    if (!codigo || !desconto || !validade) {
      toast.warn("Preencha código, desconto e validade")
      return
    }
    setSavingCupom(true)
    try {
      const novo = await cuponAPI.create(codigo, descricao, Number(desconto), validade, token)
      toast.success(`Cupom "${codigo}" criado!`)
      setCupons((prev) => [...prev, novo])
      setDashboard((prev) => ({ ...prev, totalCupons: prev.totalCupons + 1 }))
      setCupomForm({ codigo: "", descricao: "", desconto: "", validade: "" })
    } catch (error: any) {
      toast.error(error?.message || "Erro ao criar cupom")
    } finally {
      setSavingCupom(false)
    }
  }

  // ─── Render ──────────────────────────────────────────────────────────────

  return (
    <>
      <Header />

      <main className="min-h-screen text-white">
        <section className="max-w-7xl mx-auto px-4 py-8">

          {/* Header */}
          <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-purple-700">Administração</p>
              <h1 className="text-3xl font-bold">Painel Administrativo</h1>
              <p className="mt-2 text-slate-600 max-w-2xl">
                Indicadores, pedidos, usuários e cupons em um só lugar.
              </p>
            </div>
            <div className="rounded-3xl border border-purple-200  px-5 py-4 shadow-sm">
              <p className="text-sm text-slate-500">Usuário</p>
              <p className="text-lg font-semibold">{usuario?.nome}</p>
              <p className="text-sm text-slate-500">Função: {usuario?.tipo}</p>
            </div>
          </div>

          {/* Cards resumo */}
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: "Pedidos",  value: dashboard.totalPedidos,  sub: "Total realizados" },
              { label: "Produtos", value: dashboard.totalProdutos, sub: "No catálogo" },
              { label: "Usuários", value: dashboard.totalUsuarios, sub: "Registrados" },
              { label: "Cupons",   value: dashboard.totalCupons,   sub: "Disponíveis" },
            ].map(({ label, value, sub }) => (
              <div key={label} className="rounded-3xl p-6 shadow-sm border border-slate-200">
                <p className="text-sm text-slate-500 uppercase">{label}</p>
                <p className="mt-4 text-4xl font-bold">
                  {isLoading ? <span className="text-slate-300">...</span> : value}
                </p>
                <p className="mt-2 text-sm text-slate-500">{sub}</p>
              </div>
            ))}
          </div>

          {/* Tabela pedidos */}
          <section className="mt-10">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
              <h2 className="text-2xl font-semibold">Últimos pedidos</h2>
              <button
                type="button"
                onClick={loadAdminData}
                disabled={isLoading}
                className="inline-flex items-center rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-purple-800 disabled:bg-slate-400 disabled:cursor-not-allowed"
              >
                {isLoading ? "Atualizando..." : "↻ Atualizar"}
              </button>
            </div>

            {errorMessage && (
              <div className="mt-4 rounded-3xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {errorMessage}
              </div>
            )}

            <div className="mt-4 overflow-x-auto rounded-3xl border border-slate-200  shadow-sm">
              <table className="min-w-full divide-y divide-slate-200 text-left">
                <thead className="bg-slate-50">
                  <tr>
                    {["Pedido", "Cliente", "Valor", "Status", "Data", "Ações"].map((h) => (
                      <th key={h} className="px-4 py-3 text-sm font-semibold text-slate-600">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {isLoading && pedidos.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-5 text-center text-slate-400">Carregando...</td></tr>
                  ) : pedidos.length === 0 ? (
                    <tr><td colSpan={6} className="px-4 py-5 text-center text-slate-500">Nenhum pedido encontrado.</td></tr>
                  ) : (
                    pedidos.map((pedido) => (
                      <tr key={pedido.id_pedido} className={isLoading ? "opacity-50" : ""}>
                        <td className="px-4 py-4 text-sm font-semibold">#{pedido.id_pedido}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{pedido.usuario?.nome ?? "—"}</td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatCurrency(pedido.valor_total)}</td>
                        <td className="px-4 py-4 text-sm">
                          <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${statusColors[pedido.status] ?? "bg-slate-100 text-slate-600"}`}>
                            {pedido.status}
                          </span>
                        </td>
                        <td className="px-4 py-4 text-sm text-slate-600">{formatDate(pedido.data_pedido)}</td>
                        <td className="px-4 py-4 text-sm space-x-2">
                          {nextStatusMap[pedido.status]?.map((s) => (
                            <button
                              key={s}
                              type="button"
                              onClick={() => handleStatusChange(pedido.id_pedido, s)}
                              disabled={isLoading}
                              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {s}
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

          {/* Produtos */}
          <section className="mt-10">
            <div className="rounded-3xl p-6 shadow-sm border border-slate-200">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Produtos</h3>
                  <p className="mt-1 text-sm text-slate-500">Crie, edite e gerencie itens do catálogo.</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => router.push("/anunciar")}
                    className="rounded-full bg-purple-700 px-4 py-2 text-sm font-semibold text-white hover:bg-purple-800"
                  >
                    + Novo produto
                  </button>
                  <button
                    type="button"
                    onClick={() => router.push("/meus-anuncios")}
                    className="rounded-full bg-purple-700  px-4 py-2 text-sm font-semibold text-white hover:hover:bg-purple-900"
                  >
                    Ver anúncios
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Usuários */}
          <section className="mt-4">
            <div className="rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              {/* Cabeçalho clicável */}
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "usuarios" ? null : "usuarios")}
                className="w-full flex items-center justify-between px-6 py-5 text-left "
              >
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Usuários</h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {dashboard.totalUsuarios} usuário{dashboard.totalUsuarios !== 1 ? "s" : ""} registrado{dashboard.totalUsuarios !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-slate-400 text-xl">{openSection === "usuarios" ? "▲" : "▼"}</span>
              </button>

              {openSection === "usuarios" && (
                <div className="border-t border-slate-200 px-6 py-5">
                  {/* Busca */}
                  <input
                    type="text"
                    placeholder="Buscar por nome ou e-mail..."
                    value={userSearch}
                    onChange={(e) => setUserSearch(e.target.value)}
                    className="mb-4 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-300"
                  />

                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                      <thead className="bg-slate-50">
                        <tr>
                          {["ID", "Nome", "E-mail", "Tipo", "Ações"].map((h) => (
                            <th key={h} className="px-4 py-3 font-semibold text-slate-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        {filteredUsuarios.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-slate-400">
                              Nenhum usuário encontrado.
                            </td>
                          </tr>
                        ) : (
                          filteredUsuarios.map((u) => (
                            <tr key={u.id_usuario}>
                              <td className="px-4 py-3 text-slate-400">#{u.id_usuario}</td>
                              <td className="px-4 py-3 font-medium">{u.nome}</td>
                              <td className="px-4 py-3 text-slate-600">{u.email}</td>
                              <td className="px-4 py-3">
                                <span className={`inline-flex rounded-full px-2 py-0.5 text-xs font-semibold ${
                                  u.tipo?.toUpperCase() === "ADMIN"
                                    ? "bg-purple-100 text-purple-700"
                                    : "bg-slate-100 text-slate-600"
                                }`}>
                                  {u.tipo}
                                </span>
                              </td>
                              <td className="px-4 py-3 space-x-2">
                                <button
                                  type="button"
                                  onClick={() => router.push(`/perfil/${u.id_usuario}`)}
                                  className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-200"
                                >
                                  Ver
                                </button>
                                {u.id_usuario !== usuario?.id && (
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteUser(u.id_usuario, u.nome)}
                                    className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                                  >
                                    Excluir
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* Cupons */}
          <section className="mt-4">
            <div className="rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(openSection === "cupons" ? null : "cupons")}
                className="w-full flex items-center justify-between px-6 py-5 text-left "
              >
                <div>
                  <h3 className="text-lg font-semibold">Gerenciar Cupons</h3>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {dashboard.totalCupons} cupom{dashboard.totalCupons !== 1 ? "s" : ""} ativo{dashboard.totalCupons !== 1 ? "s" : ""}
                  </p>
                </div>
                <span className="text-slate-400 text-xl">{openSection === "cupons" ? "▲" : "▼"}</span>
              </button>

              {openSection === "cupons" && (
                <div className="border-t border-slate-200 px-6 py-5 space-y-6">

                  {/* Formulário novo cupom */}
                  <div>
                    <h4 className="text-sm font-semibold text-slate-700 mb-3">Novo cupom</h4>
                    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                      <input
                        type="text"
                        placeholder="Código (ex: PROMO10)"
                        value={cupomForm.codigo}
                        onChange={(e) => setCupomForm((f) => ({ ...f, codigo: e.target.value.toUpperCase() }))}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none "
                      />
                      <input
                        type="text"
                        placeholder="Descrição (opcional)"
                        value={cupomForm.descricao}
                        onChange={(e) => setCupomForm((f) => ({ ...f, descricao: e.target.value }))}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none "
                      />
                      <input
                        type="number"
                        placeholder="Desconto (%)"
                        min={1}
                        max={100}
                        value={cupomForm.desconto}
                        onChange={(e) => setCupomForm((f) => ({ ...f, desconto: e.target.value }))}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none "
                      />
                      <input
                        type="date"
                        value={cupomForm.validade}
                        onChange={(e) => setCupomForm((f) => ({ ...f, validade: e.target.value }))}
                        className="rounded-2xl border border-slate-200 px-4 py-2 text-sm focus:outline-none "
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleCreateCupom}
                      disabled={savingCupom}
                      className="mt-3 rounded-full bg-purple-700 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-800 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingCupom ? "Salvando..." : "+ Criar cupom"}
                    </button>
                  </div>

                  {/* Lista de cupons */}
                  <div className="overflow-x-auto rounded-2xl overflow-hidden border border-slate-200">
                    <table className="min-w-full divide-y divide-slate-200 text-left text-sm rounded-2xl">
                      <thead className="bg-slate-50">
                        <tr>
                          {["Código", "Descrição", "Desconto", "Validade", "Ações"].map((h) => (
                            <th key={h} className="px-4 py-3 font-semibold text-slate-600">{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200   ">
                        {cupons.length === 0 ? (
                          <tr>
                            <td colSpan={5} className="px-4 py-4 text-center text-slate-400">
                              Nenhum cupom cadastrado.
                            </td>
                          </tr>
                        ) : (
                          cupons.map((c) => (
                            <tr key={c.id_cupom}>
                              <td className="px-4 py-3 font-mono font-semibold text-purple-700">{c.codigo}</td>
                              <td className="px-4 py-3 text-slate-600">{c.descricao || "—"}</td>
                              <td className="px-4 py-3">
                                <span className="inline-flex rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                                  {c.desconto}% OFF
                                </span>
                              </td>
                              <td className="px-4 py-3 text-slate-600">
                                {c.validade ? new Date(c.validade).toLocaleDateString("pt-BR") : "—"}
                              </td>
                              <td className="px-4 py-3">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteCupom(c.id_cupom, c.codigo)}
                                  className="rounded-full bg-red-50 px-3 py-1 text-xs font-semibold text-red-600 hover:bg-red-100"
                                >
                                  Excluir
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </section>

        </section>
      </main>

      <Footer />
    </>
  )
}