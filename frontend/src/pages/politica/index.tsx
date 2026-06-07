import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

export default function Privacidade() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />

      <main className="flex-1 p-10 text-white ">
        <h1 className="text-3xl font-bold mb-5">Política de Privacidade</h1>

        <p className="mb-4">
          Nós respeitamos sua privacidade e protegemos seus dados pessoais.
        </p>

        <ul className="list-disc ml-6 space-y-2">
          <li>Não compartilhamos seus dados com terceiros.</li>
          <li>Usamos informações apenas para melhorar a experiência.</li>
          <li>Seus dados são armazenados com segurança.</li>
        </ul>
      </main>

      <Footer />
    </div>
  );
}