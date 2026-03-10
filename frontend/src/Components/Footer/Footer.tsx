import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { SiFacebook } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#A636E9] h-20 w-full grid grid-cols-3 items-center px-6">

  {/* Logo  */}
  <Link href="/"><Image src={Logo} alt="Logo" className="p-2" /></Link>

  {/* links rodapé  */}
  <ul className="flex gap-10 text-white justify-center">
    <li><Link href="/contact" className="text-white hover:text-[#430883]">Ajuda</Link></li>
    <li><Link href="/contact" className="text-white hover:text-[#430883]">Fale conosco</Link></li>
    <li><Link href="/contact" className="text-white hover:text-[#430883]">Termos de uso</Link></li>
    <li><Link href="/contact" className="text-white hover:text-[#430883]">Politica de privacidade</Link></li>
  </ul>

  {/* Redes sociais + Copyright */}
  <div className="flex items-center gap-4 justify-end">
    <Link href="https://www.facebook.com/?locale=pt_BR" className="text-blue-500 hover:text-[#430883]"><SiFacebook className="text-2xl" /></Link>
    <Link href="https://www.instagram.com/" className="text-pink-800 hover:text-[#430883]"><FaInstagram className="text-2xl" /></Link>
    <p className="text-white">© 2026 Haunter Store.</p>
  </div>

</footer>
  );
}