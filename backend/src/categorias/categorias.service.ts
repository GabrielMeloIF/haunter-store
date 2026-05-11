import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class CategoriasService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.categoria.findMany();
  }

  async findOne(id: number) {
    const cat = await this.prisma.categoria.findUnique({
      where: { id_categoria: id },
      include: { produto: true },
    });
    if (!cat) throw new NotFoundException(`Categoria #${id} não encontrada`);
    return cat;
  }

  create(data: { nome_categoria: string; descricao: string }) {
    return this.prisma.categoria.create({ data });
  }

  update(id: number, data: Partial<{ nome_categoria: string; descricao: string }>) {
    return this.prisma.categoria.update({ where: { id_categoria: id }, data });
  }

  remove(id: number) {
    return this.prisma.categoria.delete({ where: { id_categoria: id } });
  }
}
