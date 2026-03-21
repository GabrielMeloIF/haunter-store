import Link from "next/link";

export default function NavBar() {
  return (
    <nav className="w-full flex items-center justify-center p-4">
      <ul className="
        flex flex-col items-center gap-4 text-white
        md:flex-row md:gap-10
      ">
        <li className="px-5 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200">
          <Link href="/">Categorias</Link>
        </li>
        <li className="px-5 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200">
          <Link href="/favoritos">Favoritos</Link>
        </li>
        <li className="px-5 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200">
          <Link href="/contact">Peças</Link>
        </li>
        <li className="px-5 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200">
          <Link href="/contact">Periféricos</Link>
        </li>
        <li className="px-5 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200">
          <Link href="/contact">Jogos</Link>
        </li>
      </ul>
    </nav>
  );
}