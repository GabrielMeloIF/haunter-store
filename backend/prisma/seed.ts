import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  await prisma.categoria.createMany({
    data: [
      {
        nome_categoria: "Periféricos",
        descricao: "Mouse, teclado, etc"
      },
      {
        nome_categoria: "Jogos",
        descricao: "Jogos digitais e físicos"
      }
    ],
    skipDuplicates: true 
  })
}

main()
  .then(() => console.log("Seed rodou"))
  .catch(e => console.error(e))
  .finally(() => prisma.$disconnect())
  process.exit(1)
  