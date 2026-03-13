import Link from "next/link";


export default function NavBar() {
  return (
    <nav className=" h-20 w-full flex items-center justify-center">
      <ul className="flex gap-10 text-white">
        <li className="bg-[#440A84] px-7 p-1 rounded-lg hover:bg-[#5a10a8] transition duration-200"><Link href="/">Categorias</Link></li>
        <li className="bg-[#440A84] px-7 p-1 rounded-lg hover:bg-[#5a10a8] transition duration-200"><Link href="/favoritos">Favoritos</Link></li>
        <li className="bg-[#440A84] px-7 p-1 rounded-lg hover:bg-[#5a10a8] transition duration-200"><Link href="/contact">Peças</Link></li>
        <li className="bg-[#440A84] px-7 p-1 rounded-lg hover:bg-[#5a10a8] transition duration-200"><Link href="/contact">Perifericos</Link></li>
        <li className="bg-[#440A84] px-7 p-1 rounded-lg hover:bg-[#5a10a8] transition duration-200"><Link href="/contact">Jogos</Link></li>
      </ul>
    </nav>
  );
  }