import Header from "../Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import Cards from "@/Components/Card/Card";
import BtnTopo from "@/Components/BtnTopo/BtnTopo";
import Carrossel from "./../Components/Carrosel/Carrossel";



export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
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
    