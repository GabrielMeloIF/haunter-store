import Header from "@/Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";
import Cards from "@/Components/Card/Card";

export default function Favoritos() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <NavBar />
      <main className="flex-1">
        <h1 className="flex justify-center text-white text-3xl font-bold mt-10">Favoritos</h1>
        <Cards />
      </main>
      <Footer />
    </div>
  );
}