import Link from "next/link";

export default function NavBar() {
  return (
<<<<<<< HEAD
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
=======
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
>>>>>>> dfd7426f5231f93eddfb77d58623a4e0cf2bc868
          <Link href="/contact">Jogos</Link>
        </li>
      </ul>
    </nav>
  );
}