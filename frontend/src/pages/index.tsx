import Header from "../Components/Header/Header";
import NavBar from "@/Components/Navbar/NavBar";
import Footer from "@/Components/Footer/Footer";

export default function Home() {
  return (
    <div className="bg-[#303030] min-h-screen">
      <Header />
      <NavBar />







      <footer className="fixed bottom-0 left-0 w-full  text-white text-center ">
      <Footer />
      </footer>
    </div>
  );
}