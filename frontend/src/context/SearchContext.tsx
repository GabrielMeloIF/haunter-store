import React, { createContext, useContext, useState, useCallback } from "react";

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  imagem_url: string;
  estoque: number;
  categoria?: {
    id: number;
    nome: string;
  };
}

interface SearchContextType {
  resultados: Produto[];
  loading: boolean;
  erro: string | null;
  buscarProdutos: (termo: string) => Promise<void>;
  limparResultados: () => void;
}

const SearchContext = createContext<SearchContextType | undefined>(undefined);

export const SearchProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [resultados, setResultados] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(false);
  const [erro, setErro] = useState<string | null>(null);

  const buscarProdutos = useCallback(async (termo: string) => {
    if (!termo.trim()) {
      setResultados([]);
      setErro(null);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
      const response = await fetch(`${API_URL}/produtos?busca=${encodeURIComponent(termo)}`);
      
      if (!response.ok) {
        throw new Error("Erro ao buscar produtos");
      }
      
      const data = await response.json();
      setResultados(data);
    } catch (err) {
      console.error("Erro ao buscar produtos:", err);
      setErro("Erro ao buscar produtos. Tente novamente.");
      setResultados([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const limparResultados = useCallback(() => {
    setResultados([]);
    setErro(null);
  }, []);

  return (
    <SearchContext.Provider
      value={{ resultados, loading, erro, buscarProdutos, limparResultados }}
    >
      {children}
    </SearchContext.Provider>
  );
};

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error("useSearch deve ser usado dentro de um SearchProvider");
  }
  return context;
};
