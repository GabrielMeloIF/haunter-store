import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import NavBar from "@/Components/Navbar/NavBar";
import { Icon } from "@iconify/react";

export default function Notificacao() {
  return (
    
    <div className="">
      <Header />
      <NavBar/>
      <div className="flex justify-center ">
        <h1 className="text-4xl font-bold text-white ">Notificações</h1>
      </div>

      <div className="flex justify-center mt-10">
      <div className="flex bg-white rouded rounded-2xl w-400 h-25 items-center shadow-lg shadow-gray-500 transition-transform duration-300 hover:scale-101">
      <div className="m-3 bg-gray-300 rounded-full w-12 h-12"><Icon icon="heroicons:user" className="text-xl" /></div>
      </div>
   </div>
    
    </div>
  );
}