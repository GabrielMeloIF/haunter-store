import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CarrinhoService {
  constructor(private prisma: PrismaService) {}

  findByUsuario(id_usuario: number) {
    return this.prisma.carrinho.findMany({
      where: { id_usuario },
      include: { produto: true },
    });
  }

  async addItem(data: { id_usuario: number; id_produto: number; quantidade: number }) {
    // Se o item já existe, apenas incrementa a quantidade
    const existing = await this.prisma.carrinho.findFirst({
      where: { id_usuario: data.id_usuario, id_produto: data.id_produto },
    });
    if (existing) {
      return this.prisma.carrinho.update({
        where: { id_carrinho: existing.id_carrinho },
        data: { quantidade: existing.quantidade + data.quantidade },
      });
    }
    return this.prisma.carrinho.create({ data });
  }

  updateItem(id_carrinho: number, quantidade: number) {
    return this.prisma.carrinho.update({
      where: { id_carrinho },
      data: { quantidade },
    });
  }

  async removeItem(id_carrinho: number) {
    const item = await this.prisma.carrinho.findUnique({ where: { id_carrinho } });
    if (!item) throw new NotFoundException(`Item #${id_carrinho} não encontrado`);
    return this.prisma.carrinho.delete({ where: { id_carrinho } });
  }

  clearCarrinho(id_usuario: number) {
    return this.prisma.carrinho.deleteMany({ where: { id_usuario } });
  }
}
