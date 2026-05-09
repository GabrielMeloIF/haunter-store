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
    nome: "Headset Gamer",
    descricao: "Som Surround 7.1",
    imagem: Headset,
    preco: "R$ 250",
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
    nome: "Mouse Gamer",
    descricao: "Mouse RGB 6400 DPI",
    imagem: Mouse,
    preco: "R$ 120",
  },
  {
    id: 4,
    nome: "Headset Gamer Pro",
    descricao: "Headset gamer com áudio imersivo",
    imagem: Headset,
    preco: "R$ 280",
  },
  {
    id: 5,
    nome: "Headset Gamer Elite",
    descricao: "Áudio premium e microfone removível",
    imagem: Headset,
    preco: "R$ 320",
  },
  {
    id: 6,
    nome: "Headset Gamer Ultra",
    descricao: "Som surround e conforto extremo",
    imagem: Headset,
    preco: "R$ 350",
  },
];

export const games: Produto[] = [
  {
    id: 7,
    nome: "God of War III",
    descricao:
      "Acompanhe Kratos em batalhas épicas contra os deuses.",
    imagem: God,
    preco: "R$ 249",
  },
  {
    id: 8,
    nome: "Forza Horizon",
    descricao:
      "Corridas em mundo aberto com gráficos realistas.",
    imagem: Forza,
    preco: "R$ 199",
  },
  {
    id: 9,
    nome: "God of War Ragnarok",
    descricao:
      "Kratos e Atreus enfrentam o Ragnarok.",
    imagem: God,
    preco: "R$ 299",
  },
  {
    id: 10,
    nome: "Forza Motorsport",
    descricao:
      "Simulação de corrida com física realista.",
    imagem: Forza,
    preco: "R$ 219",
  },
];

export const consoles: Produto[] = [
  {
    id: 15,
    nome: "PlayStation 5",
    descricao:
      "Console de nova geração da Sony com SSD ultrarrápido.",
    imagem: require("../../../assets/ps5.png"),
    preco: "R$ 3.999,00",
  },
  {
    id: 16,
    nome: "Xbox Series X",
    descricao:
      "Xbox mais poderoso já criado pela Microsoft.",
    imagem: require("../../../assets/xbox.png"),
    preco: "R$ 4.299,00",
  },
  {
    id: 17,
    nome: "Nintendo Switch",
    descricao:
      "Console híbrido para jogar em casa ou portátil.",
    imagem: require("../../../assets/switch.png"),
    preco: "R$ 2.199,00",
  },
];

export const pcs: Produto[] = [
  {
    id: 21,
    nome: "PC Gamer RTX 4060",
    descricao:
      "PC gamer equipado com RTX 4060.",
    imagem: require("../../../assets/pc1.png"),
    preco: "R$ 5.499,00",
  },
  {
    id: 22,
    nome: "PC Gamer Ryzen 7",
    descricao:
      "Processador Ryzen 7 para alto desempenho.",
    imagem: require("../../../assets/pc2.png"),
    preco: "R$ 6.299,00",
  },
];

export const todosProdutos = [
  ...perifericos,
  ...games,
  ...consoles,
  ...pcs,
];