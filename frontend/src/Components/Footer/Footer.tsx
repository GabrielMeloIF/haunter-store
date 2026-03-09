import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";



export default function Footer() {
  return (
    <footer className="bg-[#A636E9] h-20 w-full flex items-center justify-center">
       {/* Logo  */}
      <Image src={Logo} alt="Logo" className="relative p-2" />

      {/* links rodapé */}
      <ul className="flex gap-10 text-white">
        <li className=""><Link href="/contact">Ajuda</Link></li>
        <li className=""><Link href="/contact">Favoritos</Link></li>
        <li className=""><Link href="/contact">Pecas</Link></li>
        <li className=""><Link href="/contact">Perifíricos</Link></li>
        <li className=""><Link href="/contact">Jogos</Link></li>
      </ul>

      <p className="text-white">© 2024 Haunter Store. Todos os direitos reservados.</p>
    </footer>
  );
}