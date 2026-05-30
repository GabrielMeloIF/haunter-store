import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
export default function Termos() {
  return (
    <>
    <Header />
    <div className="min-h-screen p-10 text-white bg-[#303030]">
      <h1 className="text-3xl font-bold mb-5">Termos de Uso</h1>

      <p className="mb-4">
        Ao utilizar este site, você concorda com os termos e condições descritos abaixo.
      </p>

      <ul className="list-disc ml-6 space-y-2">
        <li>O uso da plataforma deve ser responsável.</li>
        <li>Não é permitido uso indevido dos dados.</li>
        <li>Podemos atualizar os termos a qualquer momento.</li>
      </ul>
    </div>
    <Footer />
    </>
  );
}