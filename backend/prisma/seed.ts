import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const bcrypt = await import('bcrypt');
  const adminSenha = await bcrypt.hash('admin123', 10);

  await prisma.usuario.upsert({
    where: { email: 'admin@haunter.com' },
    update: {
      nome: 'Admin Haunter',
      senha: adminSenha,
      confirmar_senha: adminSenha,
      tipo_usuario: 'ADMIN',
    },
    create: {
      nome: 'Admin Haunter',
      email: 'admin@haunter.com',
      senha: adminSenha,
      confirmar_senha: adminSenha,
      tipo_usuario: 'ADMIN',
    },
  });

  // Só popula categorias e produtos se o banco estiver vazio
  const totalProdutos = await prisma.produto.count();

  if (totalProdutos === 0) {
    await prisma.categoria.deleteMany();

    const perifericos = await prisma.categoria.create({
      data: {
        nome_categoria: "Periféricos",
        descricao: "Mouse, teclados, headsets e acessórios",
      },
    });

    const jogos = await prisma.categoria.create({
      data: {
        nome_categoria: "Jogos",
        descricao: "Jogos digitais e físicos",
      },
    });

    const consoles = await prisma.categoria.create({
      data: {
        nome_categoria: "Consoles",
        descricao: "Videogames e acessórios",
      },
    });

    const pcs = await prisma.categoria.create({
      data: {
        nome_categoria: "PCs",
        descricao: "Computadores gamers",
      },
    });

    await prisma.produto.createMany({
      data: [
        // PERIFÉRICOS
        {
          nome: "Mouse Gamer RGB",
          descricao: "Mouse gamer RGB com alta precisão, design ergonômico e ótimo desempenho.",
          preco: 149.99,
          estoque: 20,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/61hzuoXwjqL._AC_SL1500_.jpg",
        },
        {
          nome: "Teclado Mecânico RGB",
          descricao: "Teclado mecânico RGB com switches rápidos, confortável e muito responsivo.",
          preco: 299.99,
          estoque: 15,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/71kr3WAj1FL._AC_SL1500_.jpg",
        },
        {
          nome: "Headset Gamer",
          descricao: "Headset gamer com som imersivo, microfone integrado e muito conforto.",
          preco: 199.99,
          estoque: 12,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/61CGHv6kmWL._AC_SL1500_.jpg",
        },
        {
          nome: "Mousepad XXL",
          descricao: "Mousepad XXL com superfície ampla, precisa e base antiderrapante.",
          preco: 79.99,
          estoque: 30,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://http2.mlstatic.com/D_NQ_NP_2X_742948-CBT110226509559_042026-F.webp",
        },
        {
          nome: "Microfone USB",
          descricao: "Microfone USB com captação nítida para streaming e gravações profissionais.",
          preco: 349.99,
          estoque: 8,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://images.tcdn.com.br/img/img_prod/1156377/ckmova_sum3_microfone_usb_2985_1_7ba27a648c3333f656756070eb32f2ad.jpg",
        },
        {
          nome: "Webcam Full HD",
          descricao: "Webcam Full HD com imagem nítida, ideal para chamadas e transmissões ao vivo.",
          preco: 249.99,
          estoque: 10,
          categoriaId: perifericos.id_categoria,
          imagem_url: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcTxW_Z1zUXbpVhAdtZ7g5yhvCYnxRPbmav3-UzK5P2NXra-El45XOskDW35fjs2bn3HFsSRvj-Ajf6q-bhUqOsxN8H638kcDwD9GI05IReadHbEsG_hKKApMZg",
        },
        {
          nome: "Controle sem Fio USB",
          descricao: "Controle gamer sem fio com conexão USB, bateria de longa duração e vibração háptica.",
          preco: 189.99,
          estoque: 18,
          categoriaId: perifericos.id_categoria,
          imagem_url: "",
        },
        {
          nome: "Monitor Gamer 144Hz",
          descricao: "Monitor gamer 24 polegadas com 144Hz, 1ms e painel IPS para imagens nítidas.",
          preco: 1299.99,
          estoque: 7,
          categoriaId: perifericos.id_categoria,
          imagem_url: "",
        },

        // JOGOS
        {
          nome: "EA FC 25",
          descricao: "Jogo de futebol com gráficos modernos, times atualizados e jogabilidade incrível.",
          preco: 299.99,
          estoque: 20,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://store-images.s-microsoft.com/image/apps.39617.13862251612333050.ec09080a-b13c-432f-96c1-4c1d38bfef9c.b0deca43-6ba3-4ec9-9013-4b1b0763011d",
        },
        {
          nome: "GTA V",
          descricao: "Aventura em mundo aberto com missões, exploração e total liberdade de ação.",
          preco: 149.99,
          estoque: 15,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://upload.wikimedia.org/wikipedia/en/a/a5/Grand_Theft_Auto_V.png",
        },
        {
          nome: "Minecraft",
          descricao: "Jogo de construção e sobrevivência com infinitas possibilidades de criação.",
          preco: 99.99,
          estoque: 30,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://store-images.s-microsoft.com/image/apps.17382.13510798885735219.9735d495-578c-4a4c-b892-3eb3a780b3a0.d3792486-cf98-40c0-a2c1-d6443f0e2b70",
        },
        {
          nome: "Red Dead Redemption 2",
          descricao: "Aventura no Velho Oeste com história envolvente e gráficos impressionantes.",
          preco: 179.99,
          estoque: 12,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://upload.wikimedia.org/wikipedia/en/4/44/Red_Dead_Redemption_II.jpg",
        },
        {
          nome: "God of War Ragnarok",
          descricao: "Kratos e Atreus enfrentam criaturas mitológicas em uma jornada épica nórdica.",
          preco: 249.99,
          estoque: 10,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://upload.wikimedia.org/wikipedia/en/e/ee/God_of_War_Ragnar%C3%B6k_cover.jpg",
        },
        {
          nome: "Call of Duty Black Ops 6",
          descricao: "Combates intensos com campanha adrenalínica e multiplayer altamente competitivo.",
          preco: 349.99,
          estoque: 8,
          categoriaId: jogos.id_categoria,
          imagem_url: "https://store-images.s-microsoft.com/image/apps.10491.14346543607136639.d932bf87-6edc-4da6-bbd5-c944ad33bc0d.f78757c0-6542-410f-a0cc-52fc592d79f1",
        },
        {
          nome: "Cyberpunk 2077",
          descricao: "RPG de ação no futuro distópico de Night City com história profunda e mundo aberto.",
          preco: 149.99,
          estoque: 14,
          categoriaId: jogos.id_categoria,
          imagem_url: "",
        },
        {
          nome: "Elden Ring",
          descricao: "Action RPG desafiador em um vasto mundo aberto criado por FromSoftware e George R.R. Martin.",
          preco: 219.99,
          estoque: 11,
          categoriaId: jogos.id_categoria,
          imagem_url: "",
        },

        // CONSOLES
        {
          nome: "PlayStation 5",
          descricao: "Console next-gen com SSD ultrarrápido, gráficos impressionantes e exclusivos top.",
          preco: 3999.99,
          estoque: 5,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/51ljnEaW0pL._AC_SL1500_.jpg",
        },
        {
          nome: "Xbox Series X",
          descricao: "O console mais poderoso da Microsoft com gráficos e carregamentos ultrarrápidos.",
          preco: 4299.99,
          estoque: 5,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/61-jjE67uqL._AC_SL1500_.jpg",
        },
        {
          nome: "Nintendo Switch OLED",
          descricao: "Console híbrido com tela OLED vibrante para jogar em casa ou em qualquer lugar.",
          preco: 2499.99,
          estoque: 10,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/61nqNujSF2L._AC_SL1500_.jpg",
        },
        {
          nome: "PlayStation 4",
          descricao: "Console com enorme biblioteca de exclusivos e ótimo custo-benefício para jogadores.",
          preco: 2199.99,
          estoque: 6,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/71PGvPXpk5L._AC_SL1500_.jpg",
        },
        {
          nome: "Xbox Series S",
          descricao: "Versão compacta da nova geração Xbox com Game Pass e excelente desempenho.",
          preco: 2499.99,
          estoque: 8,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://images.tcdn.com.br/img/img_prod/1298816/xbox_series_s_1tb_preto_233_1_b1762d9fe1a725a1d6490b34be52ad34.png",
        },
        {
          nome: "Nintendo Switch Lite",
          descricao: "Console portátil leve e confortável, compatível com toda a biblioteca Nintendo.",
          preco: 1499.99,
          estoque: 7,
          categoriaId: consoles.id_categoria,
          imagem_url: "https://images8.kabum.com.br/produtos/fotos/sync_mirakl/498028/xlarge/Console-Nintendo-Switch-Lite-Hbhsbbza1-32GB-Azul_1759239596.jpg",
        },
        {
          nome: "Steam Deck OLED",
          descricao: "PC portátil da Valve com tela OLED e acesso à biblioteca completa do Steam.",
          preco: 3299.99,
          estoque: 4,
          categoriaId: consoles.id_categoria,
          imagem_url: "",
        },
        {
          nome: "PlayStation 5 Slim",
          descricao: "Versão compacta do PS5 com design mais fino, leve e leitor de disco destacável.",
          preco: 3599.99,
          estoque: 6,
          categoriaId: consoles.id_categoria,
          imagem_url: "",
        },

        // PCS
        {
          nome: "PC Gamer Ryzen 5",
          descricao: "PC gamer com Ryzen 5 e RTX 4060 para excelente desempenho em jogos atuais.",
          preco: 5499.99,
          estoque: 5,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/51musk0N0CL._AC_SX300_SY300_QL70_ML2_.jpg",
        },
        {
          nome: "PC Gamer Ryzen 7",
          descricao: "Configuração avançada com Ryzen 7 e RTX 4070 para alto desempenho em jogos.",
          preco: 7499.99,
          estoque: 4,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://m.media-amazon.com/images/I/51Rrt+xQYYL._AC_SY300_SX300_QL70_ML2_.jpg",
        },
        {
          nome: "PC Gamer Intel i5",
          descricao: "PC gamer equilibrado com Intel Core i5 e RTX 3060 para jogos modernos com qualidade.",
          preco: 4999.99,
          estoque: 6,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://imgs.pontofrio.com.br/1576352166/1xg.jpg?imwidth=500",
        },
        {
          nome: "PC Gamer Intel i7",
          descricao: "Máquina de alto desempenho com Intel i7 e RTX 4070 Super para alta resolução.",
          preco: 8999.99,
          estoque: 3,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://cdn.dooca.store/559/products/cvxnzz7m3obadawmsvceqrvkiy4gzcbgs81a_620x620+fill_ffffff.png?v=1714069641",
        },
        {
          nome: "Workstation Ryzen 9",
          descricao: "Workstation com Ryzen 9 e 32GB de RAM para edição de vídeo e modelagem 3D.",
          preco: 10999.99,
          estoque: 2,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://images6.kabum.com.br/produtos/fotos/sync_mirakl/1037326/xlarge/Workstation-RTX-5090-32GB-Ryzen-9-9950X3D-64GB-DDR5-Windows-11-Pro-IA-Render-8K_1778764421.jpg",
        },
        {
          nome: "Mini PC Gamer",
          descricao: "PC compacto com ótimo desempenho, ideal para jogos e trabalho em espaços reduzidos.",
          preco: 4299.99,
          estoque: 8,
          categoriaId: pcs.id_categoria,
          imagem_url: "https://alfatecnologico.com.br/cdn/shop/files/minipc1site_2da5fa9b-4fb9-4c6a-ad47-264436d68aad.jpg?v=1692657159&width=500",
        },
        {
          nome: "PC Gamer Intel i9",
          descricao: "PC topo de linha com Intel i9 e RTX 4090 para gaming em 4K com máxima qualidade.",
          preco: 14999.99,
          estoque: 2,
          categoriaId: pcs.id_categoria,
          imagem_url: "",
        },
        {
          nome: "Notebook Gamer RTX 4060",
          descricao: "Notebook gamer com RTX 4060, tela 144Hz e processador de alta performance para jogar em qualquer lugar.",
          preco: 6999.99,
          estoque: 5,
          categoriaId: pcs.id_categoria,
          imagem_url: "",
        },
      ],
    });

    console.log("Categorias e produtos criados com sucesso!");
  } else {
    console.log(`Banco já possui ${totalProdutos} produtos — seed de produtos ignorada.`);
  }

  console.log("Seed executada com sucesso!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });