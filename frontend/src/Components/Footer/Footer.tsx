import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { SiFacebook } from "react-icons/si";
import { FaInstagram } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-[#A636E9] w-full px-6 py-4">

      <div className="flex flex-col md:grid md:grid-cols-3 items-center gap-4 md:gap-0">

        {/* Logo */}
        <Link href="/" className="flex justify-center md:justify-start">
          <Image src={Logo} alt="Logo" className="p-2 w-16 md:w-20 h-auto" />
        </Link>

        {/* Links */}
        <ul className="flex flex-wrap gap-3 md:gap-6 text-white justify-center text-xs md:text-sm">
          <li><Link href="/contact" className="hover:text-[#430883]">Ajuda</Link></li>
          <li><Link href="/contact" className="hover:text-[#430883]">Fale conosco</Link></li>
          <li><Link href="/contact" className="hover:text-[#430883]">Termos de uso</Link></li>
          <li><Link href="/contact" className="hover:text-[#430883]">Política de privacidade</Link></li>
        </ul>

        {/* Redes sociais + Copyright */}
        <div className="flex items-center gap-4 justify-center md:justify-end">
          <Link href="https://www.facebook.com/?locale=pt_BR" className="text-blue-500 hover:text-[#430883]">
            <SiFacebook className="text-2xl" />
          </Link>
          <Link href="https://www.instagram.com/" className="text-pink-800 hover:text-[#430883]">
            <FaInstagram className="text-2xl" />
          </Link>
          <p className="text-white text-xs md:text-sm">© 2026 Haunter Store.</p>
        </div>

      </div>

    </footer>
  );
}