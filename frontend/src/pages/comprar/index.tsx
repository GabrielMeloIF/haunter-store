import Footer from "@/Components/Footer/Footer";
import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Image from "next/image";
import Link from "next/link";

const produtos = [
    {
        id: 1,
        nome: "Mouse Gamer",
        descricao: "Mouse gamer com alta precisão e iluminação RGB personalizável.",
        preco: "R$ 199,99",
        imagem: "/mouse 1.png"
    },
];
export default function Comprar() {
  return (
  <>
      <Header />
      <NavBar />
      <div className="flex">
      <div className="flex flex-col p-20">
        <Image src="/mouse 1.png" alt="Mouse Gamer" width={400} height={300}/>
        <div className="mt-5 flex gap-8">
          <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50}/>
          <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50}/>
          <Image src="/mouse 1.png" alt="Mouse Gamer" width={110} height={50}/>
        </div>
      </div>

      {/* Detalhes do produto */}
      <div className="flex flex-col p-20">
        <h1 className="text-2xl font-bold text-white">{produtos[0].nome}</h1>
        <p className="text-lg mt-2 text-white">{produtos[0].descricao}</p>
        <p className="text-3xl font-bold mt-4 text-white">{produtos[0].preco}</p>
        <div className="flex gap-4 mt-6">
        <Link href="/carrinho" className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4">
          Adicionar ao Carrinho
        </Link>
        <Link href="/comprar" className="bg-[#5a10a8] text-white py-2 px-4 rounded-lg hover:bg-[#3a0a6a] transition duration-200 mt-4">
          Comprar Agora
        </Link>
        </div>
      </div>
      </div>
      <Footer />
 </>
  );
}