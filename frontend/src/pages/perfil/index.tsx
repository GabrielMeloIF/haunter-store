"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

import { toast } from "react-toastify"; 

interface User {
  name: string;
  email: string;
  photoURL: string;
  password: string;
  uid: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");

  // carrega usuário
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        setName(parsedUser.name);
        setEmail(parsedUser.email);
        setPhotoURL(parsedUser.photoURL);
        setPassword(parsedUser.password);
      } else {
        router.push("/entrar"); 
      }
    }
  }, [router]);

  // Salva alterações
  const handleSave = () => {
    if (!name.trim() || !email.trim()) {
      toast.error("Nome e email são obrigatórios!", {
        position: "bottom-right",
        autoClose: 3000,
      });
      return;
    }

    const updatedUser: User = { ...user!, name, email, photoURL, password, uid: user!.uid };

    // Atualiza usuário logado
    localStorage.setItem("user", JSON.stringify(updatedUser));

    // Atualiza lista de usuários
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
    const updatedUsers = storedUsers.map((u: User) =>
      u.uid === updatedUser.uid ? updatedUser : u
    );
    localStorage.setItem("users", JSON.stringify(updatedUsers));

    setUser(updatedUser);

    // toast no lugar do alert
    toast.success("Dados atualizados com sucesso!", {
      position: "bottom-right",
      autoClose: 3000,
    });
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    router.push("/entrar");
  };

  // Upload de foto
  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setPhotoURL(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  if (!user) return null;

  return (
    <>
      <Header />
     
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-md flex flex-col gap-4">
          <h1 className="text-2xl font-bold text-center">Minha Conta</h1>

          {/* Foto do usuário */}
          <div className="flex flex-col items-center gap-2">
            {photoURL ? (
              <Image
                src={photoURL}
                alt="Foto do usuário"
                width={80}
                height={80}
                className="rounded-full object-cover min-w-20 min-h-20 max-w-20 max-h-20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center text-white text-2xl font-bold">
                {name[0]?.toUpperCase() || "U"}
              </div>
            )}
            <label className="cursor-pointer text-sm text-purple-600 hover:underline">
              Alterar foto
              <input type="file" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          {/* Nome */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Nome</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Email */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
            />
          </div>

          {/* Senha */}
          <div className="flex flex-col gap-2">
            <label className="text-sm font-semibold">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 rounded-lg px-3 py-2"
              placeholder="Digite nova senha"
            />
          </div>

          <div className="flex gap-2 mt-4">
            <button
              onClick={handleSave}
              className="flex-1 bg-purple-600 text-white py-2 rounded-lg hover:opacity-90"
            >
              Salvar
            </button>
            <button
              onClick={handleLogout}
              className="flex-1 bg-red-500 text-white py-2 rounded-lg hover:opacity-90"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}
