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

export const pcs: Produto[] = [
  {
    id: 13,
    nome: "PC Gamer RTX 4060",
    descricao: "Intel i5 + RTX 4060",
    imagem: "/pc1.webp",
    preco: "R$ 5.999",
  },
  {
    id: 14,
    nome: "PC Gamer Ryzen 7",
    descricao: "Ryzen 7 + RTX 4070",
    imagem: "/pc2.webp",
    preco: "R$ 8.499",
  },
  {
    id: 15,
    nome: "PC Setup White",
    descricao: "Setup completo gamer",
    imagem: "/pc3.webp",
    preco: "R$ 7.299",
  },
  {
    id: 16,
    nome: "PC Gamer Entrada",
    descricao: "Ryzen 5 + GTX 1660",
    imagem: "/pc4.webp",
    preco: "R$ 3.999",
  },
  {
    id: 17,
    nome: "PC Streamer Pro",
    descricao: "Ideal para lives",
    imagem: "/pc5.webp",
    preco: "R$ 9.199",
  },
  {
    id: 18,
    nome: "PC Ultra Performance",
    descricao: "RTX 4090 + i9",
    imagem: "/pc6.webp",
    preco: "R$ 18.999",
  },
];

export const consoles: Produto[] = [
  {
    id: 19,
    nome: "PlayStation 5",
    descricao: "Console Sony 825GB",
    imagem: "/ps5.webp",
    preco: "R$ 4.499",
  },
  {
    id: 20,
    nome: "Xbox Series X",
    descricao: "Console Microsoft 1TB",
    imagem: "/xboxx.webp",
    preco: "R$ 4.299",
  },
  {
    id: 21,
    nome: "Nintendo Switch OLED",
    descricao: "Tela OLED 64GB",
    imagem: "/switch.webp",
    preco: "R$ 2.399",
  },
  {
    id: 22,
    nome: "PlayStation 4 Slim",
    descricao: "Console 1TB",
    imagem: "/ps4.webp",
    preco: "R$ 2.199",
  },
  {
    id: 23,
    nome: "Xbox Series S",
    descricao: "Console compacto 512GB",
    imagem: "/seriess.webp",
    preco: "R$ 2.799",
  },
  {
    id: 24,
    nome: "Nintendo Switch Lite",
    descricao: "Portátil e compacto",
    imagem: "/switchlite.webp",
    preco: "R$ 1.499",
  },
];
export const todosProdutos = [...perifericos, ...games, ...pcs, ...consoles];