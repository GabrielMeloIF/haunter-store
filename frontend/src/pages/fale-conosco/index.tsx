import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import AIChat from "@/Components/AIChat/AIChat";

export default function FaleConosco() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white ">
        <h1 className="text-3xl font-bold mb-5">Fale Conosco</h1>

        <p className="mb-6">
          Converse com nossa assistente virtual para tirar dúvidas sobre o
          site, compras e produtos. Se preferir, use nossos canais tradicionais
          abaixo.
        </p>

        <div className="mb-6">
          <AIChat />
        </div>

        <div className="mt-6">
          <h2 className="font-bold text-lg mb-2">Outros canais</h2>
          <ul className="space-y-3">
            <li>Email: suporte@haunter.store</li>
            <li>WhatsApp: (11) 99999-9999</li>
            <li>Instagram: @haunter_store</li>
          </ul>
        </div>
      </main>

      <Footer />
    </div>
  );
}