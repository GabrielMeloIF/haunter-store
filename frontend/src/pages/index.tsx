import Header from "../Components/Header/Header";
import Hero from "@/Components/Hero/Hero";
import NavBar from "@/Components/Navbar/NavBar";
import Carrossel from "./../Components/Carrosel/Carrossel";
import Footer from "@/Components/Footer/Footer";
import Cards from "@/Components/Card/Card";
import BtnTopo from "@/Components/BtnTopo/BtnTopo";





export default function Home() {
  return (
<>
      <Header />
        <NavBar />
        
      <Carrossel />
      <main className="flex-1">
        <Cards />
        <BtnTopo />
      </main>
      <Footer />
   </>
  );
}
    