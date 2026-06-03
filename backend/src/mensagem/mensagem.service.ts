import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class MensagemService {
  constructor(private prisma: PrismaService) {}

  async create(data: { id_conversa?: number; id_destinatario?: number; id_remetente: number; conteudo: string }) {
    let id_conversa = data.id_conversa;

    if (!id_conversa) {
      if (!data.id_destinatario) {
        throw new Error('id_conversa ou id_destinatario é necessário');
      }

      // procurar conversa existente entre os dois usuários (ambas ordens)
      const existing = await this.prisma.conversa.findFirst({
        where: {
          OR: [
            { participante1Id: data.id_remetente, participante2Id: data.id_destinatario },
            { participante1Id: data.id_destinatario, participante2Id: data.id_remetente },
          ],
        },
      });

      if (existing) {
        id_conversa = existing.id_conversa;
      } else {
        const conv = await this.prisma.conversa.create({
          data: {
            participante1Id: data.id_remetente,
            participante2Id: data.id_destinatario,
          },
        });
        id_conversa = conv.id_conversa;
      }
    }

    return this.prisma.mensagem.create({
      data: {
        id_conversa: id_conversa!,
        id_remetente: data.id_remetente,
        conteudo: data.conteudo,
      },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
      },
    });
  }

  findByConversa(id_conversa: number) {
    return this.prisma.mensagem.findMany({
      where: { id_conversa },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
      },
      orderBy: { enviada_em: 'asc' },
    });
  }

  async findOne(id: number) {
    const mensagem = await this.prisma.mensagem.findUnique({
      where: { id_mensagem: id },
      include: {
        usuario: { select: { id_usuario: true, nome: true, email: true } },
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
