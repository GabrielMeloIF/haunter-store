import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversaService {
  constructor(private prisma: PrismaService) {}

  create(usuario: number[]) {
    return this.prisma.conversa.create({
      data: {
        usuario
: {
          connect: usuario.map((id) => ({ id_usuario: id })),
        },
      },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
      },
    });
  }

  findAll() {
    return this.prisma.conversa.findMany({
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: { orderBy: { enviada_em: 'desc' }, take: 1 },
      },
    });
  }

  async findOne(id: number) {
    const conversa = await this.prisma.conversa.findUnique({
      where: { id_conversa: id },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: { orderBy: { enviada_em: 'asc' } },
      },
    });
    if (!conversa) throw new NotFoundException(`Conversa #${id} não encontrada`);
    return conversa;
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.conversa.findMany({
      where: { usuario: { some: { id_usuario } } },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: { orderBy: { enviada_em: 'desc' }, take: 1 },
      },
      orderBy: { criada_em: 'desc' },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.conversa.delete({ where: { id_conversa: id } });
  }
}
