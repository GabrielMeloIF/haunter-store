import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function Ajuda() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white">
        <h1 className="text-3xl font-bold mb-5">Central de Ajuda</h1>

        <div className="space-y-6">
          <div>
            <h2 className="font-bold text-lg">Como comprar?</h2>
            <p>Escolha um produto e clique em comprar.</p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Como acompanhar pedidos?</h2>
            <p>Você pode ver seus pedidos na área do usuário.</p>
          </div>

          <div>
            <h2 className="font-bold text-lg">Problemas no site?</h2>
            <p>Entre em contato com o suporte.</p>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}