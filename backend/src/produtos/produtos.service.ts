import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ProdutosService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.produto.findMany({ include: { categoria: true } });
  }

  async findOne(id: number) {
    const produto = await this.prisma.produto.findUnique({
      where: { id },
      include: { categoria: true },
    });
    if (!produto) throw new NotFoundException(`Produto #${id} não encontrado`);
    return produto;
  }

  create(data: {
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    tipo_produto?: string;
    categoriaId: number;
  }) {
    return this.prisma.produto.create({ data });
  }

  update(
    id: number,
    data: Partial<{
      nome: string;
      descricao: string;
      preco: number;
      estoque: number;
      tipo_produto: string;
      categoriaId: number;
    }>,
  ) {
    return this.prisma.produto.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.produto.delete({ where: { id } });
  }
}
