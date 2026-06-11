"use client"

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Header from "@/Components/Header/Header";
import Footer from "@/Components/Footer/Footer";

import { toast } from "react-toastify"; 
import { useAuth } from '@/context/AuthContext'
import { usersAPI } from '@/services/api'

interface User {
  name: string;
  email: string;
  photoURL: string;
  password: string;
  uid: string;
  tipo?: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const { usuario, updateUsuario, logout, token } = useAuth()
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");

  // carrega usuário
  useEffect(() => {
    if (usuario) {
      setUser({
        name: usuario.nome,
        email: usuario.email,
        photoURL: usuario.foto || "",
        password: "",
        uid: String(usuario.id),
        tipo: usuario.tipo,
      });
      setName(usuario.nome || "");
      setEmail(usuario.email || "");
      setPhotoURL(usuario.foto || "");
    } else if (typeof window !== "undefined") {
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
  }, [router, usuario]);

  // Salva alterações
  const handleSave = () => {
  if (!name.trim() || !email.trim()) {
    toast.error("Nome e email são obrigatórios!", {
      position: "bottom-right",
      autoClose: 3000,
    });
    return;
  }

  const dadosAtualizacao: any = {
    nome: name,
    email,
    foto: photoURL,
  };

  if (password.trim()) {
    dadosAtualizacao.senha = password;
    dadosAtualizacao.confirmar_senha = password;
  }

  if (updateUsuario) {
    updateUsuario(dadosAtualizacao)
      .then(() => {
        setPassword("");

        toast.success("Dados atualizados com sucesso!", {
          position: "bottom-right",
          autoClose: 3000,
        });
      })
      .catch((err) => {
        toast.error("Erro ao atualizar: " + (err.message || err), {
          position: "bottom-right",
          autoClose: 3000,
        });
      });

    return;
  }

  const updatedUser: User = {
    ...user!,
    name,
    email,
    photoURL,
    password,
    uid: user!.uid,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  const storedUsers = JSON.parse(localStorage.getItem("users") || "[]");
  const updatedUsers = storedUsers.map((u: User) =>
    u.uid === updatedUser.uid ? updatedUser : u
  );

  localStorage.setItem("users", JSON.stringify(updatedUsers));

  setUser(updatedUser);

  toast.success("Dados atualizados com sucesso!", {
    position: "bottom-right",
    autoClose: 3000,
  });
};
  // Logout
  const handleLogout = () => {
    logout()
    router.push("/entrar");
  };

  // Executa o delete de fato (chamado só após confirmação)
  const confirmarDelete = async () => {
    if (!user) return

    const uid = user.uid

    if (uid && usuario) {
      try {
        console.log("🔍 Tentando deletar:", { id: usuario.id, token })
        await usersAPI.delete(usuario.id, token || undefined)
        
        // Sucesso: deletar do localStorage
        const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
        const remaining = storedUsers.filter((u: User) => u.uid !== uid)
        localStorage.setItem("users", JSON.stringify(remaining))
        localStorage.removeItem("user")
        
        logout()
        toast.success("Conta deletada com sucesso", { position: "bottom-right", autoClose: 3000 })
        router.push("/")
      } catch (error: any) {
        console.error("❌ Erro ao deletar conta:", error)
        toast.error("Erro ao deletar conta: " + (error.message || "Tente novamente"), { 
          position: "bottom-right", 
          autoClose: 3000 
        })
      }
      return
    }

    // Fallback (usuário não autenticado)
    const storedUsers = JSON.parse(localStorage.getItem("users") || "[]")
    const remaining = storedUsers.filter((u: User) => u.uid !== uid)
    localStorage.setItem("users", JSON.stringify(remaining))
    localStorage.removeItem("user")
    logout()
    toast.success("Conta deletada com sucesso", { position: "bottom-right", autoClose: 3000 })
    router.push("/")
  }

  // Abre toast de confirmação — NÃO executa nada além disso
  const handleDeleteAccount = () => {
    toast(
      ({ closeToast }) => (
        <div className="flex flex-col gap-2">
          <p className="font-semibold">Tem certeza que deseja deletar sua conta?</p>
          <p className="text-sm text-gray-500">Esta ação não pode ser desfeita.</p>
          <div className="flex gap-2 mt-1">
            <button
              onClick={() => {
                closeToast()
                confirmarDelete()
              }}
              className="flex-1 bg-red-500 text-white py-1 rounded hover:opacity-90 text-sm"
            >
              Sim, deletar
            </button>
            <button
              onClick={closeToast}
              className="flex-1 bg-gray-200 text-gray-800 py-1 rounded hover:opacity-90 text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      ),
      {
        position: "bottom-right",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    )
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
                unoptimized
                className="rounded-full object-cover min-w-20 min-h-20 max-w-20 max-h-20"
              />
            ) : (
              <div className="w-20 h-20 rounded-full bg-purple-700 flex items-center justify-center text-white text-2xl font-bold">
                {name?.[0].toUpperCase() || "U"}
              </div>
            )}
            <label className="cursor-pointer text-sm text-purple-600 hover:underline">
              Alterar foto
              <input type="file" className="hidden" onChange={handlePhotoChange} />
            </label>
          </div>

          {user?.tipo === "ADMIN" && (
            <div className="w-full text-center">
              <button
                onClick={() => router.push('/admin')}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-purple-700 px-5 py-2 text-sm font-semibold text-white hover:bg-purple-800"
              >
                Acessar painel administrativo
              </button>
            </div>
          )}

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
            <button
              onClick={handleDeleteAccount}
              className="flex-1 bg-black text-white py-2 rounded-lg hover:opacity-90"
              title="Deletar conta"
            >
              Deletar conta
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
}