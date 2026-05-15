import Mouse from "../../public/mouse 1.png";
import Teclado from "../../public/teclado 1.png";
import Headset from "../../public/headset 1.png";
import { StaticImageData } from "next/image";

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  imagem: StaticImageData | string;
  preco: string;
  imagens?: string[];
};

export const perifericos: Produto[] = [
  { id: 1, nome: "Mouse Gamer", descricao: "Mouse RGB 6400 DPI", imagem: Mouse, preco: "R$ 120" },
  { id: 2, nome: "Teclado Mecânico", descricao: "Switch Blue", imagem: Teclado, preco: "R$ 350" },
  { id: 3, nome: "Headset Gamer", descricao: "Som Surround 7.1", imagem: Headset, preco: "R$ 250" },
  { id: 4, nome: "Headset Gamer Pro", descricao: "Som Surround", imagem: Headset, preco: "R$ 280" },
  { id: 5, nome: "Headset Gamer Elite", descricao: "Som Surround", imagem: Headset, preco: "R$ 320" },
  { id: 6, nome: "Headset Gamer Ultra", descricao: "Som Surround", imagem: Headset, preco: "R$ 350" },
];

export const games: Produto[] = [
  { id: 7, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 8, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 9, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
   { id: 10, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 11, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 12, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
];

export const consoles: Produto[] = [
  { id: 7, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 8, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 9, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
   { id: 10, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 11, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 12, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
];


export const pcs: Produto[] = [
  { id: 7, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 8, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 9, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
   { id: 10, nome: "Fortnite", descricao: "Ação e aventura", imagem: "/forza.png", preco: "R$ 199" },
  { id: 11, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
  { id: 12, nome: "God of War III Remasterizado", descricao: "Ação", imagem: "/god.webp", preco: "R$ 249" },
];


export const todosProdutos = [...perifericos, ...games];