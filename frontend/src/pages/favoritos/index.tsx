import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import Cards from "@/Components/Card/Card";


export default function Favoritos() {
  return (
    <>
      <Header />
      <NavBar />
      <h1 className="flex justify-center text-white text-3xl font-bold mt-10">Favoritos</h1>
      <Cards />
      <Footer />
    </>
  );
}