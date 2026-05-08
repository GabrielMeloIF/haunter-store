import { ImageSourcePropType } from "react-native";

import Mouse from "../../../assets/mouse 1.png";
import Teclado from "../../../assets/teclado 1.png";
import Headset from "../../../assets/headset 1.png";
import God from "../../../assets/god.webp";
import Forza from "../../../assets/forza.png";

export type Produto = {
  id: number;
  nome: string;
  descricao: string;
  imagem: ImageSourcePropType;
  preco: string;
};

export const perifericos: Produto[] = [
  {
    id: 1,
    nome: "Mouse Gamer",
    descricao: "Mouse RGB 6400 DPI",
    imagem: Mouse,
    preco: "R$ 120",
  },
  {
    id: 2,
    nome: "Teclado Mecânico",
    descricao: "Switch Blue",
    imagem: Teclado,
    preco: "R$ 350",
  },
  {
    id: 3,
    nome: "Headset Gamer",
    descricao: "Som Surround 7.1",
    imagem: Headset,
    preco: "R$ 250",
  },
  {
    id: 4,
    nome: "Headset Gamer Pro",
    descricao: "Som Surround",
    imagem: Headset,
    preco: "R$ 280",
  },
  {
    id: 5,
    nome: "Headset Gamer Elite",
    descricao: "Som Surround",
    imagem: Headset,
    preco: "R$ 320",
  },
  {
    id: 6,
    nome: "Headset Gamer Ultra",
    descricao: "Som Surround",
    imagem: Headset,
    preco: "R$ 350",
  },
];

export const games: Produto[] = [
  {
    id: 7,
    nome: "God of War III",
    descricao: "Ação",
    imagem: God,
    preco: "R$ 249",
  },
  {
    id: 8,
    nome: "Forza Horizon",
    descricao: "Corrida",
    imagem: Forza,
    preco: "R$ 199",
  },
  {
    id: 9,
    nome: "God of War III",
    descricao: "Ação",
    imagem: God,
    preco: "R$ 249",
  },
  {
    id: 10,
    nome: "Forza Horizon",
    descricao: "Corrida",
    imagem: Forza,
    preco: "R$ 199",
  },
  {
    id: 11,
    nome: "God of War III",
    descricao: "Ação",
    imagem: God,
    preco: "R$ 249",
  },
  {
    id: 12,
    nome: "Forza Horizon",
    descricao: "Corrida",
    imagem: Forza,
    preco: "R$ 199",
  },
];

export const todosProdutos = [
  ...perifericos,
  ...games,
];