import Image from "next/image";
import Logo from "../../../public/logo.png";
import { IoIosSearch } from "react-icons/io";
import { BsBell, BsBorderAll, BsCart2, BsEnvelope } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  const handleBuscar = () => {
    if (!busca.trim()) return;

    router.push(`/${busca}`);
  };
  return (
    <header className="bg-[#A636E9] flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-15 w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Image
          src={Logo}
          alt="Logo"
          className="w-15 sm:w-16 md:w-18 lg:w-15 "
        />
      </Link>

      {/* Barra de pesquisa */}
      <div className="relative flex items-center flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          placeholder="Pesquisar..."
          className="bg-white/50 w-full h-6 sm:h-7 md:h-8 rounded-xl text-white placeholder-white/80 px-3 pr-8 outline-none text-xs sm:text-sm"
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleBuscar();
            }
          }}
        />
        <IoIosSearch
          onClick={handleBuscar}
          className="absolute right-3 text-white text-base sm:text-lg cursor-pointer"
        />
      </div>

      {/* Links  */}
      <nav className="hidden lg:flex ml-auto gap-4 xl:gap-6 2xl:gap-10 items-center flex-shrink-0">
        <Link
          href="/"
          className="flex items-center gap-1 text-white hover:text-[#430883] transition duration-300 whitespace-nowrap"
        >
          <BsBorderAll className="text-sm xl:text-base" />
          <span className="text-xs xl:text-sm">Meus anúncios</span>
        </Link>
        <Link
          href="/chat"
          className="flex items-center gap-1 text-white hover:text-[#430883] transition duration-300 whitespace-nowrap"
        >
          <BsEnvelope className="text-sm xl:text-base" />
          <span className="text-xs xl:text-sm">Mensagens</span>
        </Link>
        <Link
          href="/notificacao"
          className="flex items-center gap-1 text-white hover:text-[#430883] transition duration-300 whitespace-nowrap"
        >
          <BsBell className="text-sm xl:text-base" />
          <span className="text-xs xl:text-sm">Notificações</span>
        </Link>
        <Link
          href="/"
          className="flex items-center gap-1 text-white hover:text-[#430883] transition duration-300 whitespace-nowrap"
        >
          <BsCart2 className="text-sm xl:text-base" />
          <span className="text-xs xl:text-sm">Carrinho</span>
        </Link>
      </nav>

      {/* Ícones  */}
      <nav className="flex lg:hidden items-center gap-2 sm:gap-4 ml-auto flex-shrink-0">
        <Link
          href="/"
          className="text-white hover:text-[#430883] transition duration-300"
        >
          <BsBorderAll className="text-lg sm:text-xl" />
        </Link>
        <Link
          href="/chat"
          className="text-white hover:text-[#430883] transition duration-300"
        >
          <BsEnvelope className="text-lg sm:text-xl" />
        </Link>
        <Link
          href="/notificacao"
          className="text-white hover:text-[#430883] transition duration-300"
        >
          <BsBell className="text-lg sm:text-xl" />
        </Link>
        <Link
          href="/"
          className="text-white hover:text-[#430883] transition duration-300"
        >
          <BsCart2 className="text-lg sm:text-xl" />
        </Link>
      </nav>

      {/* Entrar */}
      <div className="hidden md:flex flex-shrink-0 bg-white/50 rounded-xl px-2 lg:px-4 xl:px-6 py-1 border border-transparent hover:border-[#2A0042] transition duration-300">
        <Link
          href="/entrar"
          className="text-white text-xs lg:text-sm hover:text-[#430883] transition duration-300 whitespace-nowrap"
        >
          Entrar
        </Link>
      </div>

      {/* Anunciar */}
      <div className="flex-shrink-0 bg-[#430883] rounded-xl flex items-center h-7 sm:h-8 md:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 hover:bg-[#7317D7] transition duration-300">
        <CgAdd className="text-white text-base sm:text-lg lg:text-xl flex-shrink-0" />
        <Link
          href="/"
          className="text-white text-xs lg:text-sm px-1 sm:px-2 lg:px-3 whitespace-nowrap hidden sm:block"
        >
          Anunciar
        </Link>
      </div>
    </header>
  );
}
