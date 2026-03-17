import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {

    const periferico = await prisma.categoria.create({
        data: {
            nome_categoria: "Periférico",
            descricao: "Equipamentos de computador"
        }
    })

    const jogo = await prisma.categoria.create({
        data: {
            nome_categoria: "Jogo",
            descricao: "Jogos digitais"
        }
    })

    await prisma.produto.createMany({
        data: [

            {
                nome: "Mouse Gamer Logitech G203",
                descricao: "Mouse gamer com sensor de alta precisão e iluminação RGB personalizável.",
                preco: 129.90,
                estoque: 25,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Teclado Mecânico Redragon Kumara",
                descricao: "Teclado mecânico compacto com switches Outemu e iluminação RGB.",
                preco: 289.90,
                estoque: 15,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "GTA V (PC)",
                descricao: "Jogo de ação e aventura em mundo aberto, desenvolvido pela Rockstar Games.",
                preco: 99.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Elden Ring (PC)",
                descricao: "Jogo de RPG de ação em mundo aberto, desenvolvido pela FromSoftware.",
                preco: 229.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Cyberpunk 2077 (PC)",
                descricao: "Jogo de RPG de ação em mundo aberto, desenvolvido pela CD Projekt Red.",
                preco: 199.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Headset Gamer HyperX Cloud Stinger",
                descricao: "Headset gamer com drivers de 50mm e design confortável para longas sessões de jogo.",
                preco: 199.90,
                estoque: 20,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mousepad Gamer Corsair MM300",
                descricao: "Mousepad gamer de tecido com base antiderrapante e bordas costuradas para durabilidade.",
                preco: 89.90,
                estoque: 30,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Red Dead Redemption 2 (PC)",
                descricao: "Jogo de ação e aventura em mundo aberto, desenvolvido pela Rockstar Games.",
                preco: 149.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "The Witcher 3: Wild Hunt (PC)",
                descricao: "Jogo de RPG de ação em mundo aberto, desenvolvido pela CD Projekt Red.",
                preco: 79.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "FIFA 22 (PC)",
                descricao: "Jogo de futebol desenvolvido pela EA Sports, com gráficos realistas e jogabilidade aprimorada.",
                preco: 249.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Teclado Gamer Razer BlackWidow Elite",
                descricao: "Teclado mecânico com switches Razer Green e iluminação RGB personalizável.",
                preco: 499.90,
                estoque: 10,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mouse Gamer Razer DeathAdder V2",
                descricao: "Mouse gamer com sensor óptico de alta precisão e iluminação RGB personalizável.",
                preco: 299.90,
                estoque: 20,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Headset Gamer Razer Kraken Ultimate",
                descricao: "Headset gamer com drivers de 50mm e iluminação RGB personalizável.",
                preco: 399.90,
                estoque: 15,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mousepad Gamer Razer Goliathus Extended Chroma",
                descricao: "Mousepad gamer de tecido com base antiderrapante e iluminação RGB personalizável.",
                preco: 149.90,
                estoque: 25,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Call of Duty: Warzone (PC)",
                descricao: "Jogo de tiro em primeira pessoa, desenvolvido pela Infinity Ward e Raven Software.",
                preco: 0.00,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Assassin's Creed Valhalla (PC)",
                descricao: "Jogo de ação e aventura em mundo aberto, desenvolvido pela Ubisoft.",
                preco: 199.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Headset Gamer SteelSeries Arctis 7",
                descricao: "Headset gamer sem fio com drivers de 40mm e design confortável para longas sessões de jogo.",
                preco: 499.90,
                estoque: 10,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mousepad Gamer SteelSeries QcK Prism",
                descricao: "Mousepad gamer de tecido com base antiderrapante e iluminação RGB personalizável.",
                preco: 199.90,
                estoque: 20,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Resident Evil Village (PC)",
                descricao: "Jogo de survival horror, desenvolvido pela Capcom.",
                preco: 199.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Death Stranding (PC)",
                descricao: "Jogo de ação e aventura, desenvolvido pela Kojima Productions.",
                preco: 149.90,
                estoque: 999,
                categoriaId: jogo.id_categoria
            },

            {
                nome: "Teclado Gamer Logitech G Pro X",
                descricao: "Teclado mecânico com switches intercambiáveis e iluminação RGB personalizável.",
                preco: 499.90,
                estoque: 10,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mouse Gamer Logitech G502 Hero",
                descricao: "Mouse gamer com sensor óptico de alta precisão e iluminação RGB personalizável.",
                preco: 299.90,
                estoque: 20,
                categoriaId: periferico.id_categoria
            }, 

            {
                nome: "Headset Gamer Logitech G733",
                descricao: "Headset gamer sem fio com drivers de 40mm e design confortável para longas sessões de jogo.",
                preco: 399.90,
                estoque: 15,
                categoriaId: periferico.id_categoria
            },

            {
                nome: "Mousepad Gamer Logitech G840 XL",
                descricao: "Mousepad gamer de tecido com base antiderrapante e tamanho extra grande para máxima liberdade de movimento.",
                preco: 199.90,
                estoque: 20,
                categoriaId: periferico.id_categoria
            }


        ]

    })

    console.log("Seed executado com sucesso 🚀")

}

main()
    .catch((e) => {
        console.error(e)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })