import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.usuario.findMany({
      select: { id_usuario: true, nome: true, email: true, senha: true },
    });
  }

  async findOne(id: number) {
    return this.prisma.usuario.findUnique({
      where: { id_usuario: id },
      select: { id_usuario: true, nome: true, email: true, senha: true },
    });
  }

  async create(data: {
    nome: string;
    email: string;
    senha: string;
    confirmar_senha: string;
    tipo_usuario?: 'CLIENTE' | 'ADMIN';
  }) {
    const bcrypt = await import('bcrypt');

    const senhaHash = await bcrypt.hash(data.senha, 10);

    return this.prisma.usuario.create({
      data: {
        nome: data.nome,
        email: data.email,
        senha: senhaHash,
        confirmar_senha: senhaHash,
        tipo_usuario: data.tipo_usuario ?? 'CLIENTE',
      },
    });
  }

  async update(
    id: number,
    data: Partial<{
      nome: string;
      email: string;
      senha: string;
      confirmar_senha: string;
      tipo_usuario: 'CLIENTE' | 'ADMIN';
    }>,
  ) {
    if (!id) throw new Error('ID inválido');

    
    if (data.senha) {
      const bcrypt = await import('bcrypt');
      data.senha = await bcrypt.hash(data.senha, 10);
    }

    return this.prisma.usuario.update({
      where: { id_usuario: Number(id) }, 
      data,
    });
  }

  async remove(id: number) {
    if (!id) throw new Error('ID inválido');

    const user = await this.prisma.usuario.findUnique({
      where: { id_usuario: id },
    });

    if (!user) {
      throw new Error(`Usuário #${id} não encontrado`);
    }

    // Deletar todas as mensagens do usuário
    await this.prisma.mensagem.deleteMany({
      where: { id_remetente: id },
    });

    // Deletar todas as conversas onde o usuário é participante
    await this.prisma.conversa.deleteMany({
      where: {
        OR: [
          { participante1Id: id },
          { participante2Id: id },
        ],
      },
    });

    // Deletar todos os itens de pedido e depois os pedidos
    const pedidos = await this.prisma.pedido.findMany({
      where: { id_usuario: id },
    });

    for (const pedido of pedidos) {
      await this.prisma.itempedido.deleteMany({
        where: { id_pedido: pedido.id_pedido },
      });
    }

    await this.prisma.pedido.deleteMany({
      where: { id_usuario: id },
    });

    // Deletar todos os produtos do usuário
    await this.prisma.produto.deleteMany({
      where: { id_usuario: id },
    });

    // Deletar todas as avaliações do usuário
    await this.prisma.avaliacao.deleteMany({
      where: { id_usuario: id },
    });

    // Deletar todos os itens do carrinho do usuário
    await this.prisma.carrinho.deleteMany({
      where: { id_usuario: id },
    });

    // Deletar cupons do usuário
    await this.prisma.cupomusuario.deleteMany({
      where: { id_usuario: id },
    });

    // Deletar notificações do usuário
    await this.prisma.notificacao.deleteMany({
      where: { id_usuario: id },
    });

    // Finalmente, deletar o usuário
    return this.prisma.usuario.delete({
      where: { id_usuario: id },
    });
  }
}
