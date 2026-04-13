export const perifericos = [
  { id: 1, nome: "Mouse Gamer", descricao: "Mouse RGB 6400 DPI", imagem: require("../assets/mouse 1.png"), preco: "R$ 120" },
  { id: 2, nome: "Teclado Mecânico", descricao: "Switch Blue", imagem: require("../assets/teclado 1.png"), preco: "R$ 350" },
  { id: 3, nome: "Headset Gamer", descricao: "Som Surround 7.1", imagem: require("../assets/headset 1.png"), preco: "R$ 250" },
  { id: 4, nome: "Headset Gamer Pro", descricao: "Som Surround", imagem: require("../assets/headset 1.png"), preco: "R$ 280" },
  { id: 5, nome: "Headset Gamer Elite", descricao: "Som Surround", imagem: require("../assets/headset 1.png"), preco: "R$ 320" },
  { id: 6, nome: "Headset Gamer Ultra", descricao: "Som Surround", imagem: require("../assets/headset 1.png"), preco: "R$ 350" },
];
 
export const games = [
  { id: 7, nome: "Fortnite", descricao: "Ação e aventura", imagem: require("../assets/logo.png"), preco: "R$ 199" },
  { id: 8, nome: "God of War III Remasterizado", descricao: "Ação", imagem: require("../assets/god.webp"), preco: "R$ 249" },
  { id: 9, nome: "God of War III Remasterizado", descricao: "Ação", imagem: require("../assets/god.webp"), preco: "R$ 249" },
  { id: 10, nome: "Fortnite", descricao: "Ação e aventura", imagem: require("../assets/forza.png"), preco: "R$ 199" },
  { id: 11, nome: "God of War III Remasterizado", descricao: "Ação", imagem: require("../assets/god.webp"), preco: "R$ 249" },
  { id: 12, nome: "God of War III Remasterizado", descricao: "Ação", imagem: require("../assets/god.webp"), preco: "R$ 249" },
];
 
export const todosProdutos = [...perifericos, ...games];
 