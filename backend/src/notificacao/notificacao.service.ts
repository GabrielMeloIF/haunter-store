import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class NotificacaoService {
  constructor(private prisma: PrismaService) {}

  create(data: {
    id_usuario: number;
    tipo: 'MENSAGEM' | 'CONVERSA' | 'SISTEMA';
    titulo: string;
    descricao: string;
  }) {
    return this.prisma.notificacao.create({ data });
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.notificacao.findMany({
      where: { id_usuario },
      orderBy: { criada_em: 'desc' },
    });
  }

  findNaoLidas(id_usuario: number) {
    return this.prisma.notificacao.findMany({
      where: { id_usuario, lida: false },
      orderBy: { criada_em: 'desc' },
    });
  }

  async marcarComoLida(id: number) {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id_notificacao: id },
    });
    if (!notificacao) throw new NotFoundException(`Notificação #${id} não encontrada`);
    return this.prisma.notificacao.update({
      where: { id_notificacao: id },
      data: { lida: true },
    });
  }

  async marcarTodasComoLidas(id_usuario: number) {
    const { count } = await this.prisma.notificacao.updateMany({
      where: { id_usuario, lida: false },
      data: { lida: true },
    });
    return { atualizadas: count };
  }

  async remove(id: number) {
    const notificacao = await this.prisma.notificacao.findUnique({
      where: { id_notificacao: id },
    });
    if (!notificacao) throw new NotFoundException(`Notificação #${id} não encontrada`);
    return this.prisma.notificacao.delete({ where: { id_notificacao: id } });
  }
}
