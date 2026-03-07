import Image from "next/image";
import Logo from "../../../public/logo.png";
import styles from "./Hearder.module.css";
import { IoIosSearch } from "react-icons/io";
import { BsBell, BsBorderAll,BsCart2,BsEnvelope} from "react-icons/bs";
import { CgAdd } from "react-icons/cg";


import Link from "next/link";

export default function Header() {
  return (
    <header className="topo bg-[#A636E9] flex items-center gap-20 h-19 w-full px-6">
      {/* Logo  */}
      <Image src={Logo} alt="Logo" className="relative p-2" />


      {/* Barra de pesquisa */}
      <div className="flex flex-col justify-center w-full">
        <input
          type="text"
          placeholder="  Pesquisar..."
          className="bg-white/50 w-130 h-7 rounded-xl text-white "
        />
        <IoIosSearch className="absolute text-white left-160 " />
      </div>


      {/* Links */}
      <div className="flex gap-10 items-center justify-center">

        <div className="flex items-center gap-1">
          <BsBorderAll className="text-white " /><Link href="/" className="text-white w-27 hover:text-[#430883] transition duration-300">Meus anuncios</Link>
        </div>
    
        <div className="flex items-center gap-1">
          <BsEnvelope className="text-white "  /><Link href="/" className="text-white hover:text-[#430883] transition duration-300">Mensagens</Link>
        </div>

        <div className="flex items-center gap-1">
          <BsBell className="text-white  " /><Link href="/" className="text-white hover:text-[#430883] transition duration-300">Notificações</Link>
        </div>

        <div className="flex items-center gap-1 ">
        <BsCart2 className="text-white " /><Link href="/" className="text-white hover:text-[#430883] transition duration-300">Carrinho</Link>
      </div>

      </div>


      {/* Entrar e Carrinho */}
     
      <div className="bg-white/50 rounded-xl px-7 py-1 border border-transparent hover:border-[#2A0042] transition duration-300">
        <Link href="/" className="text-white p-2 hover:text-[#430883]  transition duration-300">Entrar</Link>
      </div>

         <div className="bg-[#430883] rounded-xl flex items-center h-10 px-4 py-2 hover:bg-[#7317D7] transition duration-300">
          <CgAdd className="text-xl"/><Link href="/" className="text-white p-5">Anunciar</Link>
        </div>
      
    </header>
  );
}
