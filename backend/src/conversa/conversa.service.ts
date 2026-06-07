import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class ConversaService {
  constructor(private prisma: PrismaService) {}

  create(participantes: [number, number]) {
    return this.prisma.conversa.create({
      data: {
        participante1Id: participantes[0],
        participante2Id: participantes[1],
      },
      include: {
        participante1: { select: { id_usuario: true, nome: true, email: true } },
        participante2: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: true,
      },
    });
  }

  findAll() {
    return this.prisma.conversa.findMany({
      include: {
        participante1: { select: { id_usuario: true, nome: true, email: true } },
        participante2: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: { orderBy: { enviada_em: 'desc' }, take: 1 },
      },
    });
  }

  async findOne(id: number) {
    const conversa = await this.prisma.conversa.findUnique({
      where: { id_conversa: id },
      include: {
        participante1: { select: { id_usuario: true, nome: true, email: true } },
        participante2: { select: { id_usuario: true, nome: true, email: true } },
        mensagem: { orderBy: { enviada_em: 'asc' } },
      },
    });
    if (!conversa) throw new NotFoundException(`Conversa #${id} não encontrada`);
    return conversa;
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.conversa.findMany({
      where: {
        OR: [
          { participante1Id: id_usuario },
          { participante2Id: id_usuario },
        ],
      },
      include: {
        participante1: { select: { id_usuario: true, nome: true, email: true } },
        participante2: { select: { id_usuario: true, nome: true, email: true } },
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
