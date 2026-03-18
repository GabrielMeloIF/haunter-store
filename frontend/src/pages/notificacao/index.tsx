import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";
import NavBar from "@/Components/Navbar/NavBar";

export default function Notificacao() {
  return (
    
    <div className="bg-[#303030] min-h-screen">
      <Header />
      <NavBar/>
      <div className="flex justify-center ">
        <h1 className="text-4xl font-bold text-white mt-10 ">Notificações</h1>
      </div>

      <div className="flex justify-center ">
      <div className="flex bg-gray-600 rouded rounded-2xl w-400 h-20 items-center border-2 border-white ">
      <div className="m-3 bg-white rounded-full w-6">a</div>
      </div>
   </div>
    
    </div>
  );
}