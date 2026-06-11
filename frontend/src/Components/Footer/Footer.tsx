import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/logo.png";
import { SiFacebook, SiInstagram } from "react-icons/si";

export default function Footer() {
  return (
    <footer className="bg-[#A636E9] text-white mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-8">

        {/* Parte superior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <Link
            href="/"
            className="transition-transform hover:scale-105"
          >
            <Image
              src={Logo}
              alt="Haunter Store"
              className="w-20 h-auto"
              priority
            />
          </Link>

          {/* Navegação */}
          <nav>
            <ul className="flex flex-wrap justify-center gap-6 text-sm font-medium">
              <li>
                <Link
                  href="/ajuda"
                  className="hover:text-[#430883] transition-colors"
                >
                  Ajuda
                </Link>
              </li>

              <li>
                <Link
                  href="/fale-conosco"
                  className="hover:text-[#430883] transition-colors"
                >
                  Fale Conosco
                </Link>
              </li>

              <li>
                <Link
                  href="/termos"
                  className="hover:text-[#430883] transition-colors"
                >
                  Termos de Uso
                </Link>
              </li>

              <li>
                <Link
                  href="/politica"
                  className="hover:text-[#430883] transition-colors"
                >
                  Privacidade
                </Link>
              </li>
            </ul>
          </nav>

          {/* Redes sociais */}
          <div className="flex items-center gap-3">
            <Link
              href="https://facebook.com"
              target="_blank"
              className="p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <SiFacebook size={20} />
            </Link>

            <Link
              href="https://instagram.com"
              target="_blank"
              className="p-2 rounded-full hover:bg-white/15 transition-colors"
            >
              <SiInstagram size={20} />
            </Link>
          </div>

        </div>

        {/* Linha */}
        <div className="h-px bg-white/20 my-6" />

        {/* Parte inferior */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-white/80">
          <p>© 2026 Haunter Store. Todos os direitos reservados.</p>

          <p>
            Marketplace para compra e venda de produtos.
          </p>
        </div>

      </div>
    </footer>
  );
}