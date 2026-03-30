import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class AvaliacaoService {
  constructor(private prisma: PrismaService) {}

  create(data: { id_usuario: number; id_produto: number; nota: number; comentario: string }) {
    return this.prisma.avaliacao.create({
      data,
      include: {
        usuario: { select: { id_usuario: true, nome: true } },
        produto: { select: { id: true, nome: true } },
      },
    });
  }

  findByProduto(id_produto: number) {
    return this.prisma.avaliacao.findMany({
      where: { id_produto },
      include: { usuario: { select: { id_usuario: true, nome: true } } },
      orderBy: { avaliada_em: 'desc' },
    });
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.avaliacao.findMany({
      where: { id_usuario },
      include: { produto: { select: { id: true, nome: true } } },
      orderBy: { avaliada_em: 'desc' },
    });
  }

  async findOne(id: number) {
    const avaliacao = await this.prisma.avaliacao.findUnique({
      where: { id_avaliacao: id },
      include: {
        usuario: { select: { id_usuario: true, nome: true } },
        produto: { select: { id: true, nome: true } },
      },
    });
    if (!avaliacao) throw new NotFoundException(`Avaliação #${id} não encontrada`);
    return avaliacao;
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.avaliacao.delete({ where: { id_avaliacao: id } });
  }
}
