import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function FaleConosco() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white ">
        <h1 className="text-3xl font-bold mb-5">Fale Conosco</h1>

        <p className="mb-6">
          Entre em contato conosco pelos canais abaixo:
        </p>

        <ul className="space-y-3">
          <li>Email: suporte@seudominio.com</li>
          <li>WhatsApp: (11) 99999-9999</li>
          <li>Instagram: @seudominio</li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}