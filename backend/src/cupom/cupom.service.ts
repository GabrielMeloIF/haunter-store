import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CupomService {
  constructor(private prisma: PrismaService) {}

  create(data: { codigo: string; descricao: string; desconto: number; validade: string }) {
    return this.prisma.cupom.create({
      data: { ...data, validade: new Date(data.validade) },
    });
  }

  findAll() {
    return this.prisma.cupom.findMany({ orderBy: { criado_em: 'desc' } });
  }

  async findOne(id: number) {
    const cupom = await this.prisma.cupom.findUnique({ where: { id_cupom: id } });
    if (!cupom) throw new NotFoundException(`Cupom #${id} não encontrado`);
    return cupom;
  }

  async validar(codigo: string, id_usuario: number) {
    const cupom = await this.prisma.cupom.findUnique({ where: { codigo } });
    if (!cupom) throw new NotFoundException(`Cupom "${codigo}" não encontrado`);
    if (new Date() > cupom.validade) throw new BadRequestException('Cupom expirado');

    const uso = await this.prisma.cupomUsuario.findFirst({
      where: { id_cupom: cupom.id_cupom, id_usuario, utilizado: true },
    });
    if (uso) throw new BadRequestException('Cupom já utilizado por este usuário');

    return { valido: true, desconto: cupom.desconto, cupom };
  }

  async utilizar(codigo: string, id_usuario: number) {
    await this.validar(codigo, id_usuario);
    const cupom = await this.prisma.cupom.findUnique({ where: { codigo } });

    const existente = await this.prisma.cupomUsuario.findFirst({
      where: { id_cupom: cupom!.id_cupom, id_usuario },
    });

    if (existente) {
      return this.prisma.cupomUsuario.update({
        where: { id_cupom_usuario: existente.id_cupom_usuario },
        data: { utilizado: true, utilizado_em: new Date() },
      });
    }

    return this.prisma.cupomUsuario.create({
      data: {
        id_usuario,
        id_cupom: cupom!.id_cupom,
        utilizado: true,
        utilizado_em: new Date(),
      },
    });
  }

  findByUsuario(id_usuario: number) {
    return this.prisma.cupomUsuario.findMany({
      where: { id_usuario },
      include: { cupom: true },
      orderBy: { utilizado_em: 'desc' },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.cupom.delete({ where: { id_cupom: id } });
  }
}
