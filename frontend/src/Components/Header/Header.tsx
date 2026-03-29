import Image from "next/image";
import Logo from "../../../public/logo.png";
import { IoIosSearch } from "react-icons/io";
import { BsBell, BsBorderAll, BsCart2, BsEnvelope } from "react-icons/bs";
import { CgAdd } from "react-icons/cg";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/router";

export default function Header() {
  const router = useRouter();
  const [busca, setBusca] = useState("");

  const handleBuscar = useCallback(() => {
    const query = busca.trim().toLowerCase();
    if (!query) return;
    router.push(`/busca?q=${query}`);
    setBusca("");
  }, [busca, router]);

  interface User {
    name: string;
    email: string;
    photoURL: string;
    uid: string;
  }

  const [user, setUser] = useState<User | null>(null);

  //  Carrega usuário e atualizar automaticamente
  useEffect(() => {
    const loadUser = () => {
      if (typeof window !== "undefined") {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        } else {
          setUser(null);
        }
      }
    };

    loadUser();

   
    window.addEventListener("userChange", loadUser);

    return () => {
      window.removeEventListener("userChange", loadUser);
    };
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleBuscar();
  };

  return (
    <header className="bg-[#A636E9] flex items-center gap-2 sm:gap-4 md:gap-6 lg:gap-8 xl:gap-10 2xl:gap-15 w-full px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10 2xl:px-12">
      
      {/* Logo */}
      <Link href="/" className="shrink-0">
        <Image
          src={Logo}
          alt="Logo"
          className="w-15 sm:w-16 md:w-18 lg:w-15"
        />
      </Link>

      {/* Barra de pesquisa */}
      <div className="relative flex items-center flex-1 max-w-[120px] sm:max-w-[180px] md:max-w-xs lg:max-w-sm xl:max-w-md 2xl:max-w-lg">
        <input
          type="text"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Pesquisar..."
          className="bg-white/50 w-full h-6 sm:h-7 md:h-8 rounded-xl text-white placeholder-white/80 px-3 pr-8 outline-none text-xs sm:text-sm"
        />
        <IoIosSearch
          onClick={handleBuscar}
          className="absolute right-3 text-white text-base sm:text-lg cursor-pointer"
        />
      </div>

      {/* Links */}
      <nav className="hidden lg:flex ml-auto gap-4 xl:gap-6 2xl:gap-10 items-center flex-shrink-0">
        <Link href="/" className="flex items-center gap-1 text-white hover:text-[#430883]">
          <BsBorderAll />
          <span>Meus anúncios</span>
        </Link>

        <Link href="/chat" className="flex items-center gap-1 text-white hover:text-[#430883]">
          <BsEnvelope />
          <span>Mensagens</span>
        </Link>

        <Link href="/notificacao" className="flex items-center gap-1 text-white hover:text-[#430883]">
          <BsBell />
          <span>Notificações</span>
        </Link>

        <Link href="/carrinho" className="flex items-center gap-1 text-white hover:text-[#430883]">
          <BsCart2 />
          <span>Carrinho</span>
        </Link>
      </nav>

      {/* Ícones mobile */}
      <nav className="flex lg:hidden items-center gap-2 ml-auto">
        <Link href="/" className="text-white"><BsBorderAll /></Link>
        <Link href="/chat" className="text-white"><BsEnvelope /></Link>
        <Link href="/notificacao" className="text-white"><BsBell /></Link>
        <Link href="/" className="text-white"><BsCart2 /></Link>
      </nav>

      {/* Usuário */}
      <div className="hidden md:flex flex-shrink-0 bg-white/50 rounded-xl px-2 lg:px-4 xl:px-6 py-1 border border-transparent hover:border-[#430883] transition duration-300">
        {user ? (
          <Link href="/perfil">
            {user.photoURL ? (
              <Image
                src={user.photoURL}
                alt="Foto do usuário"
                width={32}
                height={32}
                className="rounded-full object-cover cursor-pointer max-w-8 max-h-8 min-w-8 min-h-8"
                title="Minha conta"
              />
            ) : (
              <div
                className="w-8 h-8 rounded-full bg-purple-700 flex items-center justify-center text-white font-bold cursor-pointer"
                title="Minha conta"
              >
                {user.name?.[0]?.toUpperCase() || "U"}
              </div>
            )}
          </Link>
        ) : (
          <Link href="/entrar" className="text-white hover:text-[#430883] transition duration-300">
            Entrar
          </Link>
        )}
      </div>

      {/* Anunciar */}
      <div className="flex-shrink-0 bg-[#430883] rounded-xl flex items-center h-7 sm:h-8 md:h-9 lg:h-10 px-2 sm:px-3 lg:px-4 hover:bg-[#7317D7]">
        <CgAdd className="text-white" />
        <Link href="/" className="text-white hidden sm:block px-2">
          Anunciar
        </Link>
      </div>
    </header>
  );
}