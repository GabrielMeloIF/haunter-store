import Header from "../Components/Header/Header";

import Carrossel from "./../Components/Carrosel/Carrossel";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import Cards from "@/Components/Card/Card";
import BtnTopo from "@/Components/BtnTopo/BtnTopo";





export default function Home() {
  return (
    <div className="bg-[#303030] min-h-screen">
      <Header />
        <NavBar />
      <Carrossel />
      <main className="flex-1">
        <Cards />
        <BtnTopo />
      </main>
      <Footer />
    </div>
  );
}
    