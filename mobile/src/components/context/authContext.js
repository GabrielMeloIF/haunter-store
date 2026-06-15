import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const AuthContext = createContext();

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.0.8:5000";

export const AuthProvider = ({ children }) => {
  const [usuario, setUsuario] = useState(null);
  const [token, setToken] = useState(null);
  const [carregando, setCarregando] = useState(true);

  // Restaura sessão ao iniciar o app
  useEffect(() => {
    const restaurarSessao = async () => {
      try {
        const tokenSalvo = await AsyncStorage.getItem("token");
        const usuarioSalvo = await AsyncStorage.getItem("usuario");

        if (tokenSalvo && usuarioSalvo) {
          setToken(tokenSalvo);
          setUsuario(JSON.parse(usuarioSalvo));
        }
      } catch (error) {
        console.log("Erro ao restaurar sessão:", error);
      } finally {
        setCarregando(false);
      }
    };

    restaurarSessao();
  }, []);

  const atualizarFoto = async (novaFoto) => {
    const usuarioAtualizado = { ...usuario, foto: novaFoto };
    setUsuario(usuarioAtualizado);
    await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
  };

  const atualizarUsuario = async (dadosNovos) => {
  const usuarioAtualizado = { ...usuario, ...dadosNovos };
  setUsuario(usuarioAtualizado);
  await AsyncStorage.setItem("usuario", JSON.stringify(usuarioAtualizado));
};

  const login = async (email, senha) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, senha }),
    });

    if (!response.ok) {
      const erro = await response.json();
      throw new Error(erro.message || "Credenciais inválidas");
    }

    const data = await response.json();

    // Salva no AsyncStorage
    await AsyncStorage.setItem("token", data.token);
    await AsyncStorage.setItem("usuario", JSON.stringify(data.usuario));

    setToken(data.token);
    setUsuario(data.usuario);

    return data;
  };

  const logout = async () => {
    await AsyncStorage.removeItem("token");
    await AsyncStorage.removeItem("usuario");
    setToken(null);
    setUsuario(null);
  };

  const estaLogado = !!token && !!usuario;

  return (
    <AuthContext.Provider
      value={{ usuario, token, login, logout, estaLogado, carregando, atualizarUsuario }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
