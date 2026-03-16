import { prisma } from "../database/prisma.js"

export async function createUser(req, res) {
  try {

    const { nome, email, senha, cpf, telefone, endereco, tipo_usuario } = req.body

    const user = await prisma.user.create({
      data: {
        nome,
        email,
        senha,
        cpf,
        telefone,
        endereco,
        tipo_usuario
      }
    })

    res.status(201).json(user)

  } catch (error) {

    if (error.code === "P2002") {
      return res.status(400).json({ error: "Email já cadastrado" })
    }

    console.log(error)
    res.status(500).json({ error: "Erro ao criar usuário" })
  }
}