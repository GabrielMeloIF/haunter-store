import Link from "next/link";

export default function NavBar() {
  return (

    <nav className="h-auto w-full flex items-center justify-center py-3 px-4">
      <ul className="flex flex-wrap gap-2 sm:gap-4 md:gap-6 lg:gap-10 text-white justify-center">
        <li className="px-3 sm:px-5 md:px-7 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200 text-sm sm:text-base">
          <Link href="/favoritos">Favoritos</Link>
        </li>
        <li className="px-3 sm:px-5 md:px-7 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200 text-sm sm:text-base">
          <Link href="/contact">Peças</Link>
        </li>
        <li className="px-3 sm:px-5 md:px-7 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200 text-sm sm:text-base">
          <Link href="/contact">Periféricos</Link>
        </li>
        <li className="px-3 sm:px-5 md:px-7 py-1 rounded-lg hover:bg-[#5a10a8] transition duration-200 text-sm sm:text-base">

          <Link href="/contact">Jogos</Link>
        </li>
      </ul>
    </nav>
  );
}