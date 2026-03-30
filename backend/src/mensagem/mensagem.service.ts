import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MensagemService {
  constructor(private prisma: PrismaService) {}

  create(data: { id_conversa: number; id_remetente: number; conteudo: string }) {
    return this.prisma.mensagem.create({
      data: {
        id_conversa: data.id_conversa,
        id_remetente: data.id_remetente,
        conteudo: data.conteudo,
      },
      include: {
        remetente: { select: { id_usuario: true, nome: true, email: true } },
      },
    });
  }

  findByConversa(id_conversa: number) {
    return this.prisma.mensagem.findMany({
      where: { id_conversa },
      include: {
        remetente: { select: { id_usuario: true, nome: true, email: true } },
      },
      orderBy: { enviada_em: 'asc' },
    });
  }

  async findOne(id: number) {
    const mensagem = await this.prisma.mensagem.findUnique({
      where: { id_mensagem: id },
      include: {
        remetente: { select: { id_usuario: true, nome: true, email: true } },
      },
    });
    if (!mensagem) throw new NotFoundException(`Mensagem #${id} não encontrada`);
    return mensagem;
  }

  async marcarComoLida(id: number) {
    await this.findOne(id);
    return this.prisma.mensagem.update({
      where: { id_mensagem: id },
      data: { lida: true },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.mensagem.delete({ where: { id_mensagem: id } });
  }
}
