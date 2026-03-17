import prisma from "../database/prisma.js";
export async function listarCategorias(req, res) {
  try {
    const categorias = await prisma.categoria.findMany({
      include: {
        produtos: true
      }
    });

    res.json(categorias);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}

export async function criarCategoria(req, res) {
  try {
    const { nome, descricao } = req.body;

    const categoria = await prisma.categoria.create({
      data: {
        nome,
        descricao
      }
    });

    res.status(201).json(categoria);
  } catch (error) {
    res.status(500).json({ erro: error.message });
  }
}
