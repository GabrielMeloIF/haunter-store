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

    if (!produto)
      throw new NotFoundException(`Produto #${id} não encontrado`);

    return produto;
  }

  async createMany(data: any[]) {
    return this.prisma.produto.createMany({
      data,
    });
  }

  async updateMany(
    produtos: {
      id: number;
      imagem_url?: string;
      nome?: string;
      descricao?: string;
      preco?: number;
      estoque?: number;
      categoriaId?: number;
    }[],
  ) {
    const updates = await Promise.all(
      produtos.map((produto) =>
        this.prisma.produto.update({
          where: { id: produto.id },
          data: {
            nome: produto.nome,
            descricao: produto.descricao,
            preco: produto.preco,
            estoque: produto.estoque,
            categoriaId: produto.categoriaId,
            imagem_url: produto.imagem_url,
          },
        }),
      ),
    );

    return updates;
  }

  create(data: {
    nome: string;
    descricao: string;
    preco: number;
    estoque: number;
    tipo_produto?: string;
    categoriaId: number;
    imagem_url: string;
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
      imagem_url: string;
    }>,
  ) {
    return this.prisma.produto.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.produto.delete({ where: { id } });
  }
}