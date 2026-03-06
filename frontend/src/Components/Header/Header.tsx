import Image from "next/image";
import Logo from "../../../public/logo.png";
import styles from "./Hearder.module.css";
import { IoIosSearch } from "react-icons/io";
import Link from "next/link";

export default function Header() {
  return (
    <header className="topo bg-[#A636E9] flex gap-20">
         {/* Logo do site */}
      <Image src={Logo} alt="Logo" className="relative p-2" />
      
        {/* Barra de pesquisa */}
      <div className="flex flex-col justify-center w-full">
        <input type="text" placeholder="  Pesquisar..." className="bg-white/50 w-130 h-7 rounded-xl text-white " />
          <IoIosSearch className="absolute text-white left-160 " />
      </div>

       {/* Links */}
    <div>
        <Link href="/" className="text-white">Meus anuncios</Link>
        <Link href="/" className="text-white">mensagens</Link>
        <Link href="/" className="text-white">Notificações</Link>
        <Link href="/" className="text-white">Carrinho</Link>
    </div>
    </header>
  );
}