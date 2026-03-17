import prisma from "../database/prisma.js";
export async function listarProdutos(req, res) {
  try {
    const produtos = await prisma.produto.findMany({
      include: {
        categoria: true
      }
    });

    res.json(produtos);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

export async function buscarProduto(req, res) {
  try {
    const { id } = req.params;

    const produto = await prisma.produto.findUnique({
      where: {
        id: Number(id)
      },
      include: {
        categoria: true
      }
    });

    res.json(produto);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}